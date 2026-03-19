import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { calculateSplits } from '../../utils/splitAlgorithm';
import type { Transaction } from '../../utils/splitAlgorithm';
import { fetchJpyToTwdRate } from '../../utils/exchangeRateApi';

export function SettlementTab() {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const allUsers = useStore(state => state.users);
  const allExpenses = useStore(state => state.expenses);
  const users = allUsers.filter(u => u.ledgerId === activeLedgerId);
  const expenses = allExpenses.filter(e => e.ledgerId === activeLedgerId);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [currencyDisplay, setCurrencyDisplay] = useState<'TWD' | 'JPY'>('TWD');
  const [latestRate, setLatestRate] = useState(0.21);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setTransactions(calculateSplits(users, expenses));
    
    setIsFetching(true);
    fetchJpyToTwdRate().then(rate => {
      setLatestRate(rate);
      setIsFetching(false);
    });
  }, [users, expenses]);

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || '未知';

  if (users.length === 0 || expenses.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        需要有成員和帳目才能進行結算 😎
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Currency Toggle */}
      <div className="apple-card p-2 flex items-center justify-between">
        <div className="px-5 py-2 flex items-center gap-2 text-sm font-medium text-gray-500 font-rounded">
          顯示幣別
          {isFetching && currencyDisplay === 'JPY' && <Loader2 size={14} className="animate-spin text-apple-blue" />}
        </div>
        <div className="flex bg-apple-bg dark:bg-black/50 rounded-xl p-1 shrink-0 w-32 border border-apple-border dark:border-apple-border-dark">
          <button
            onClick={() => setCurrencyDisplay('TWD')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${currencyDisplay === 'TWD' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'}`}
          >TWD</button>
          <button
            onClick={() => setCurrencyDisplay('JPY')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${currencyDisplay === 'JPY' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'}`}
          >JPY</button>
        </div>
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="apple-card p-6 text-center py-10 text-gray-500">
          🎉 大家已經互不相欠囉！
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((t, idx) => {
            const amount = currencyDisplay === 'TWD' 
              ? Math.round(t.amountTWD)
              : Math.round(t.amountTWD / latestRate);

            return (
              <div key={idx} className="apple-card apple-card-hover p-6 flex items-center justify-between">
                <div className="flex flex-col items-center flex-1">
                  <span className="font-semibold text-lg">{getUserName(t.from)}</span>
                  <span className="text-xs text-apple-blue-heavy font-medium font-rounded">應付</span>
                </div>
                
                <div className="flex flex-col items-center px-4 shrink-0">
                  <div className="flex items-center gap-1 font-mono font-bold text-xl text-apple-text dark:text-apple-text-dark">
                    <span className="text-sm opacity-50 font-sans tracking-wide">{currencyDisplay === 'JPY' ? '¥' : 'NT$'}</span>
                    {amount.toLocaleString()}
                  </div>
                  <ArrowRight size={20} className="text-gray-300 dark:text-gray-600 my-2" />
                </div>

                <div className="flex flex-col items-center flex-1">
                  <span className="font-semibold text-lg">{getUserName(t.to)}</span>
                  <span className="text-xs text-pastel-mint-heavy font-medium font-rounded" style={{color: '#7FB8A1'}}>應收</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
