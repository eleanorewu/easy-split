import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Expense, Ledger, Avatar } from '../types';
import type { Session } from '@supabase/supabase-js';

interface AppState {
  theme: 'light' | 'dark';
  session: Session | null;
  ledgers: Ledger[];
  activeLedgerId: string | null;
  users: User[];
  expenses: Expense[];
  
  // Actions
  setSession: (session: Session | null) => void;
  toggleTheme: () => void;
  addLedger: (name: string, members?: { name: string; avatar?: Avatar }[], avatar?: Avatar) => void;
  setActiveLedger: (id: string | null) => void;
  removeLedger: (id: string) => void;
  updateLedgerAvatar: (ledgerId: string, avatar?: Avatar) => void;
  
  addUser: (name: string, avatar?: Avatar) => void;
  removeUser: (id: string, cascadeRemoveExpenses?: boolean) => void;
  updateUserAvatar: (userId: string, avatar?: Avatar) => void;
  
  addExpense: (expense: Omit<Expense, 'id' | 'date' | 'ledgerId'>) => void;
  removeExpense: (id: string) => void;
  
  // Cloud Sync
  markLedgerAsCloud: (ledgerId: string) => void;
  mergeCloudData: (cloudLedgers: Ledger[], cloudUsers: User[], cloudExpenses: Expense[]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      session: null,
      ledgers: [],
      activeLedgerId: null,
      users: [],
      expenses: [],
      
      setSession: (session) => set({ session }),
      
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      addLedger: (name, members, avatar) => set((state) => {
        const newLedgerId = crypto.randomUUID();
        const newLedger: Ledger = { id: newLedgerId, name, createdAt: Date.now(), avatar };
        
        let newUsers = state.users;
        if (members && members.length > 0) {
          const usersToAdd: User[] = members.map(m => ({ id: crypto.randomUUID(), ledgerId: newLedgerId, name: m.name, avatar: m.avatar }));
          newUsers = [...state.users, ...usersToAdd];
        }

        return {
          ledgers: [...state.ledgers, newLedger],
          users: newUsers,
          activeLedgerId: newLedger.id // Switch to it immediately
        };
      }),
      
      setActiveLedger: (id: string | null) => set({ activeLedgerId: id }),
      
      removeLedger: (id: string) => set((state) => ({
        ledgers: state.ledgers.filter(l => l.id !== id),
        activeLedgerId: state.activeLedgerId === id ? null : state.activeLedgerId,
        users: state.users.filter(u => u.ledgerId !== id),
        expenses: state.expenses.filter(e => e.ledgerId !== id),
      })),

      updateLedgerAvatar: (ledgerId: string, avatar?: Avatar) => set((state) => ({
        ledgers: state.ledgers.map(l => (l.id === ledgerId ? { ...l, avatar } : l))
      })),
      
      addUser: (name: string, avatar?: Avatar) => set((state) => {
        if (!state.activeLedgerId) return state;
        return {
          users: [...state.users, { id: crypto.randomUUID(), ledgerId: state.activeLedgerId, name, avatar }]
        };
      }),
      
      removeUser: (id: string, cascadeRemoveExpenses = true) => set((state) => {
        let newExpenses = state.expenses;
        if (cascadeRemoveExpenses) {
          newExpenses = newExpenses.filter(e => 
            e.paidBy !== id && !e.splitAmong.includes(id)
          );
        }
        return {
          users: state.users.filter(u => u.id !== id),
          expenses: newExpenses,
        };
      }),

      updateUserAvatar: (userId: string, avatar?: Avatar) => set((state) => ({
        users: state.users.map(u => (u.id === userId ? { ...u, avatar } : u))
      })),
      
      addExpense: (exp) => set((state) => {
        if (!state.activeLedgerId) return state;
        return {
          expenses: [...state.expenses, { ...exp, id: crypto.randomUUID(), ledgerId: state.activeLedgerId, date: Date.now() }]
        };
      }),
      
      removeExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),

      markLedgerAsCloud: (ledgerId) => set((state) => ({
        ledgers: state.ledgers.map(l => l.id === ledgerId ? { ...l, isCloud: true } : l)
      })),

      mergeCloudData: (cloudLedgers, cloudUsers, cloudExpenses) => set((state) => {
        const cloudLedgerIds = new Set(cloudLedgers.map(l => l.id));
        
        // 保留原本就只存在單機的資料
        const localOnlyLedgers = state.ledgers.filter(l => !cloudLedgerIds.has(l.id));
        const localOnlyUsers = state.users.filter(u => !cloudLedgerIds.has(u.ledgerId));
        const localOnlyExpenses = state.expenses.filter(e => !cloudLedgerIds.has(e.ledgerId));
        
        return {
          ledgers: [...localOnlyLedgers, ...cloudLedgers],
          users: [...localOnlyUsers, ...cloudUsers],
          expenses: [...localOnlyExpenses, ...cloudExpenses],
        };
      }),
    }),
    {
      name: 'easy-split-storage',
      version: 2, // Avatar support
      /* eslint-disable @typescript-eslint/no-explicit-any */
      migrate: (persistedState: any, version: number) => {
        const v = version ?? 0;
        let nextState = persistedState;

        if (v === 0) {
          const hasData = (persistedState.users && persistedState.users.length > 0) || (persistedState.expenses && persistedState.expenses.length > 0);
          
          if (hasData) {
            const defaultLedgerId = crypto.randomUUID();
            nextState = {
              ...persistedState,
              ledgers: [{ id: defaultLedgerId, name: '第一趟旅程', createdAt: Date.now() }],
              activeLedgerId: defaultLedgerId,
              users: (persistedState.users || []).map((u: any) => ({ ...u, ledgerId: defaultLedgerId })),
              expenses: (persistedState.expenses || []).map((e: any) => ({ ...e, ledgerId: defaultLedgerId })),
            };
          } else {
            nextState = {
              ...persistedState,
              ledgers: [],
              activeLedgerId: null
            };
          }
        }

        if (v <= 1) {
          nextState = {
            ...nextState,
            ledgers: (nextState.ledgers || []).map((l: any) => ({ ...l, avatar: l.avatar })),
            users: (nextState.users || []).map((u: any) => ({ ...u, avatar: u.avatar })),
          };
        }

        return nextState;
      }
    }
  )
);
