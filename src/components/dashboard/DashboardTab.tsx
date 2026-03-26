import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus } from 'lucide-react';
import { AddExpenseModal } from '../expenses/AddExpenseModal';

export function DashboardTab() {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const allUsers = useStore(state => state.users);
  const allExpenses = useStore(state => state.expenses);
  const users = allUsers.filter(u => u.ledgerId === activeLedgerId);
  const expenses = allExpenses.filter(e => e.ledgerId === activeLedgerId);

  const totalTwd = expenses.map(e => e.currency === 'TWD' ? e.amount : e.amount * e.exchangeRate).reduce((a, b) => a + b, 0);

  const [isAddingExpense, setIsAddingExpense] = useState(false);

  return (
    <>
      <div className="space-y-6 pb-24">
      <div className="apple-card p-8 text-center flex flex-col items-center justify-center min-h-[160px]">
        <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3 tracking-widest">總花費 (折合台幣)</h2>
        <div className="text-5xl font-mono font-bold tracking-tight text-apple-text dark:text-apple-text-dark">
          <span className="text-2xl mr-1 text-apple-blue-heavy font-sans">NT$</span>
          {Math.round(totalTwd).toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="apple-card p-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-rounded font-bold text-apple-blue-heavy mb-2">{expenses.length}</span>
          <span className="text-xs text-gray-500 font-medium tracking-wide">累積帳目</span>
        </div>
        <div className="apple-card p-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-rounded font-bold text-apple-blue-heavy mb-2">{users.length}</span>
          <span className="text-xs text-gray-500 font-medium tracking-wide">參與成員</span>
        </div>
      </div>
    </div>

    <button
      onClick={() => setIsAddingExpense(true)}
      className="btn-primary fixed bottom-24 right-5 md:right-[calc(50%-12rem)] w-[60px] h-[60px] rounded-full shadow-soft-hover hover:scale-105 border-[4px] border-apple-bg dark:border-apple-bg-dark z-50 flex items-center justify-center"
    >
      <Plus size={28} strokeWidth={2.5} />
    </button>

    {isAddingExpense && <AddExpenseModal onClose={() => setIsAddingExpense(false)} />}
    </>
  );
}
