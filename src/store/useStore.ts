import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Expense, Ledger } from '../types';

interface AppState {
  theme: 'light' | 'dark';
  ledgers: Ledger[];
  activeLedgerId: string | null;
  users: User[];
  expenses: Expense[];
  
  // Actions
  toggleTheme: () => void;
  addLedger: (name: string, memberNames?: string[]) => void;
  setActiveLedger: (id: string | null) => void;
  removeLedger: (id: string) => void;
  
  addUser: (name: string) => void;
  removeUser: (id: string, cascadeRemoveExpenses?: boolean) => void;
  
  addExpense: (expense: Omit<Expense, 'id' | 'date' | 'ledgerId'>) => void;
  removeExpense: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      ledgers: [],
      activeLedgerId: null,
      users: [],
      expenses: [],
      
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      addLedger: (name, memberNames) => set((state) => {
        const newLedgerId = crypto.randomUUID();
        const newLedger = { id: newLedgerId, name, createdAt: Date.now() };
        
        let newUsers = state.users;
        if (memberNames && memberNames.length > 0) {
          const usersToAdd = memberNames.map(mName => ({ id: crypto.randomUUID(), ledgerId: newLedgerId, name: mName }));
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
      
      addUser: (name: string) => set((state) => {
        if (!state.activeLedgerId) return state;
        return {
          users: [...state.users, { id: crypto.randomUUID(), ledgerId: state.activeLedgerId, name }]
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
      
      addExpense: (exp) => set((state) => {
        if (!state.activeLedgerId) return state;
        return {
          expenses: [...state.expenses, { ...exp, id: crypto.randomUUID(), ledgerId: state.activeLedgerId, date: Date.now() }]
        };
      }),
      
      removeExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),
    }),
    {
      name: 'easy-split-storage',
      version: 1, // Bumped version to introduce Ledgers
      /* eslint-disable @typescript-eslint/no-explicit-any */
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          const hasData = (persistedState.users && persistedState.users.length > 0) || (persistedState.expenses && persistedState.expenses.length > 0);
          
          if (hasData) {
            const defaultLedgerId = crypto.randomUUID();
            return {
              ...persistedState,
              ledgers: [{ id: defaultLedgerId, name: '第一趟旅程', createdAt: Date.now() }],
              activeLedgerId: defaultLedgerId,
              users: (persistedState.users || []).map((u: any) => ({ ...u, ledgerId: defaultLedgerId })),
              expenses: (persistedState.expenses || []).map((e: any) => ({ ...e, ledgerId: defaultLedgerId })),
            };
          } else {
             return {
              ...persistedState,
              ledgers: [],
              activeLedgerId: null
             };
          }
        }
        return persistedState;
      }
    }
  )
);
