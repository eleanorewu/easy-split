import { useState } from 'react';
import { Plus, BookText, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CreateLedgerModal } from './CreateLedgerModal';
import { ThemeToggle } from '../ui/ThemeToggle';

export function LedgerListScreen() {
  const ledgers = useStore(state => state.ledgers);
  const removeLedger = useStore(state => state.removeLedger);
  const setActiveLedger = useStore(state => state.setActiveLedger);
  const users = useStore(state => state.users);
  const expenses = useStore(state => state.expenses);

  const [isAdding, setIsAdding] = useState(false);

  const getLedgerStats = (id: string) => {
    const lUsers = users.filter(u => u.ledgerId === id);
    const lExpenses = expenses.filter(e => e.ledgerId === id);
    const totalTwd = lExpenses.reduce((sum, e) => sum + (e.currency === 'TWD' ? e.amount : e.amount * e.exchangeRate), 0);
    return { userCount: lUsers.length, expenseCount: lExpenses.length, total: Math.round(totalTwd) };
  };

  return (
    <div className="min-h-screen bg-apple-bg dark:bg-apple-bg-dark text-apple-text dark:text-apple-text-dark font-sans relative transition-colors duration-500">
      <div className="max-w-md mx-auto min-h-screen bg-apple-bg dark:bg-apple-bg-dark pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+2rem)] px-5 py-8 shadow-soft-dark dark:shadow-black/20 transition-colors duration-500">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold tracking-tight text-apple-text dark:text-apple-text-dark">我的帳本</h1>
          <ThemeToggle />
        </div>

        <div className="space-y-4">
          {ledgers.map(ledger => {
            const stats = getLedgerStats(ledger.id);
            const dateStr = new Date(ledger.createdAt).toLocaleDateString();
            return (
              <div 
                key={ledger.id} 
                onClick={() => setActiveLedger(ledger.id)}
                className="bg-apple-card/60 dark:bg-apple-card-dark/60 backdrop-blur-2xl rounded-[2rem] p-6 shadow-soft dark:shadow-soft-dark border border-white/50 dark:border-white/10 cursor-pointer hover:shadow-soft-hover active:scale-95 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-pastel-mint dark:bg-pastel-mint/10 rounded-[1.25rem] flex items-center justify-center text-apple-blue-heavy shadow-inner">
                      <BookText size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{ledger.name}</h2>
                      <p className="text-xs text-gray-500 mt-0.5">建立於 {dateStr}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm(`確定要刪除「${ledger.name}」嗎？所有相關消費紀錄都會被清空喔！`)) {
                        removeLedger(ledger.id);
                      }
                    }}
                    className="text-gray-300 hover:text-red-500 p-2 transition-colors z-10 relative"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="text-sm font-medium text-gray-500 font-rounded">
                    {stats.userCount} <span className="text-xs">成員</span> · {stats.expenseCount} <span className="text-xs">帳目</span>
                  </div>
                  <div className="flex items-center text-apple-blue-heavy font-mono font-bold text-lg">
                    <span className="text-[11px] mr-1 opacity-70 font-sans tracking-wide">NT$</span> {stats.total.toLocaleString()}
                    <ArrowRight size={18} className="ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setIsAdding(true)}
            className="w-full bg-apple-card/40 dark:bg-apple-card-dark/40 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-[2px] border-dashed border-apple-border dark:border-apple-border-dark flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-apple-blue-heavy hover:border-apple-blue-heavy/50 hover:bg-white/50 dark:hover:bg-black/20 active:scale-95 transition-all"
          >
            <Plus size={28} />
            <span className="font-medium">建立新帳本</span>
          </button>
        </div>
      </div>
      {isAdding && <CreateLedgerModal onClose={() => setIsAdding(false)} />}
    </div>
  );
}
