import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useStore } from '../store/useStore';
import type { Ledger, User, Expense } from '../types';

export function useSync() {
  const session = useStore(state => state.session);
  const { ledgers, users, expenses, markLedgerAsCloud, mergeCloudData } = useStore();
  const [isSyncing, setIsSyncing] = useState(false);

  const uploadLedgerToCloud = async (ledgerId: string) => {
    if (!session?.user) throw new Error('Not logged in');
    setIsSyncing(true);

    try {
      const ledger = ledgers.find(l => l.id === ledgerId);
      if (!ledger) throw new Error('Ledger not found');

      const ledgerUsers = users.filter(u => u.ledgerId === ledgerId);
      const ledgerExpenses = expenses.filter(e => e.ledgerId === ledgerId);

      // 1. 上傳帳本主檔
      const { error: ledgerError } = await supabase.from('ledgers').upsert({
        id: ledger.id,
        name: ledger.name,
        avatar_data: ledger.avatar || null,
        created_at: new Date(ledger.createdAt).toISOString(),
        created_by: session.user.id
      });
      if (ledgerError) throw ledgerError;

      // 2. 上傳成員
      if (ledgerUsers.length > 0) {
        const membersData = ledgerUsers.map(u => ({
          id: u.id,
          ledger_id: ledgerId,
          name: u.name,
          avatar_data: u.avatar || null,
          user_id: null // 先全部當作虛擬成員，未來若有認領流程再行綁定
        }));
        const { error: usersError } = await supabase.from('ledger_members').upsert(membersData);
        if (usersError) throw usersError;
      }

      // 3. 上傳花費紀錄
      if (ledgerExpenses.length > 0) {
        const expensesData = ledgerExpenses.map(e => ({
          id: e.id,
          ledger_id: ledgerId,
          title: e.title,
          amount: e.amount,
          currency: e.currency,
          exchange_rate: e.exchangeRate,
          paid_by: e.paidBy,
          date: new Date(e.date).toISOString()
        }));
        
        const { error: expError } = await supabase.from('expenses').upsert(expensesData);
        if (expError) throw expError;

        // 4. 清理並重新上傳分帳明細 expense_splits
        const expenseIds = ledgerExpenses.map(e => e.id);
        await supabase.from('expense_splits').delete().in('expense_id', expenseIds);

        const splitsData: any[] = [];
        ledgerExpenses.forEach(e => {
          const splitAmount = e.amount / e.splitAmong.length;
          e.splitAmong.forEach(memberId => {
            splitsData.push({
              expense_id: e.id,
              member_id: memberId,
              amount_owed: splitAmount
            });
          });
        });

        if (splitsData.length > 0) {
          const { error: splitsError } = await supabase.from('expense_splits').insert(splitsData);
          if (splitsError) throw splitsError;
        }
      }

      // 成功後在本地標記為雲端帳本
      markLedgerAsCloud(ledgerId);
      return true;
    } catch (err: any) {
      console.error('上傳至雲端時發生錯誤:', err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchCloudLedgers = async () => {
    if (!session?.user) return;
    setIsSyncing(true);
    
    try {
      // 抓取所有由目前使用者建立的帳本
      const { data: myLedgers, error: lError } = await supabase
        .from('ledgers')
        .select('*')
        .eq('created_by', session.user.id);
        
      if (lError) throw lError;
      if (!myLedgers || myLedgers.length === 0) return;

      const ledgerIds = myLedgers.map(l => l.id);

      // 抓取成員
      const { data: myMembers, error: mError } = await supabase
        .from('ledger_members')
        .select('*')
        .in('ledger_id', ledgerIds);
      if (mError) throw mError;

      // 抓取花費紀錄
      const { data: myExpenses, error: eError } = await supabase
        .from('expenses')
        .select('*')
        .in('ledger_id', ledgerIds);
      if (eError) throw eError;

      // 抓取分帳明細
      const expenseIds = myExpenses?.map(e => e.id) || [];
      const { data: mySplits, error: sError } = expenseIds.length > 0 
        ? await supabase.from('expense_splits').select('*').in('expense_id', expenseIds)
        : { data: [], error: null };
      if (sError) throw sError;

      // 對應回單機資料結構
      const mappedLedgers: Ledger[] = myLedgers.map(l => ({
        id: l.id,
        name: l.name,
        createdAt: new Date(l.created_at).getTime(),
        avatar: l.avatar_data,
        isCloud: true
      }));

      const mappedUsers: User[] = (myMembers || []).map(m => ({
        id: m.id,
        ledgerId: m.ledger_id,
        name: m.name,
        avatar: m.avatar_data
      }));

      const mappedExpenses: Expense[] = (myExpenses || []).map(e => {
        const splits = (mySplits || []).filter(s => s.expense_id === e.id);
        const splitAmong = splits.map(s => s.member_id);
        return {
          id: e.id,
          ledgerId: e.ledger_id,
          title: e.title,
          amount: Number(e.amount),
          currency: e.currency as any,
          exchangeRate: Number(e.exchange_rate),
          paidBy: e.paid_by,
          splitAmong,
          date: new Date(e.date).getTime()
        };
      });

      // 寫入本地端 Zustand
      mergeCloudData(mappedLedgers, mappedUsers, mappedExpenses);
    } catch (err: any) {
      console.error('抓取雲端資料時發生錯誤:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return { uploadLedgerToCloud, fetchCloudLedgers, isSyncing };
}
