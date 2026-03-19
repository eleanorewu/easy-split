import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Expense, Ledger } from '../types';

interface AppState {
  ledgers: Ledger[];
  activeLedgerId: string | null;
  users: User[];
  expenses: Expense[];
  
  // Actions
  addLedger: (name: string) => void;
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
      ledgers: [],
      activeLedgerId: null,
      users: [],
      expenses: [],
      
      addLedger: (name) => set((state) => {
        const newLedger = { id: crypto.randomUUID(), name, createdAt: Date.now() };
        return {
          ledgers: [...state.ledgers, newLedger],
          activeLedgerId: newLedger.id // Optionally switch to it immediately
        };
      }),
      
      setActiveLedger: (id) => set({ activeLedgerId: id }),
      
      removeLedger: (id) => set((state) => ({
        ledgers: state.ledgers.filter(l => l.id !== id),
        activeLedgerId: state.activeLedgerId === id ? null : state.activeLedgerId,
        users: state.users.filter(u => u.ledgerId !== id),
        expenses: state.expenses.filter(e => e.ledgerId !== id),
      })),
      
      addUser: (name) => set((state) => {
        if (!state.activeLedgerId) return state;
        return {
          users: [...state.users, { id: crypto.randomUUID(), ledgerId: state.activeLedgerId, name }]
        };
      }),
      
      removeUser: (id, cascadeRemoveExpenses = true) => set((state) => {
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
