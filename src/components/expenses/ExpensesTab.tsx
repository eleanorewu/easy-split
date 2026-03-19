import { useState } from 'react';
import { Trash2, ReceiptText, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AddExpenseModal } from './AddExpenseModal';

export function ExpensesTab() {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const allExpenses = useStore(state => state.expenses);
  const allUsers = useStore(state => state.users);
  const expenses = allExpenses.filter(e => e.ledgerId === activeLedgerId);
  const users = allUsers.filter(u => u.ledgerId === activeLedgerId);
  const removeExpense = useStore(state => state.removeExpense);

  const [isAddingExpense, setIsAddingExpense] = useState(false);

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || '未知';

  return (
    <>
      <div className="space-y-4 pb-24 relative min-h-[60vh]">
        {expenses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            目前還沒有明細，點擊下方 + 按鈕新增 😎
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map(exp => (
              <div key={exp.id} className="bg-apple-card/60 dark:bg-apple-card-dark/60 backdrop-blur-2xl rounded-[2rem] p-5 shadow-soft dark:shadow-soft-dark border border-white/50 dark:border-white/10 flex items-center justify-between hover:shadow-soft-hover transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-pastel-mint dark:bg-pastel-mint/10 flex items-center justify-center text-apple-blue-heavy shrink-0 shadow-inner">
                    <ReceiptText size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold line-clamp-1 break-all">{exp.title}</h3>
                    <p className="text-xs text-gray-500">
                      由 {getUserName(exp.paidBy)} 先付
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-mono font-bold text-lg text-apple-blue-heavy">
                      <span className="text-xs mr-1 opacity-70 font-sans tracking-wide">{exp.currency === 'JPY' ? '¥' : 'NT$'}</span>
                      {exp.amount.toLocaleString()}
                    </div>
                    {exp.currency === 'JPY' && (
                      <div className="text-[10px] text-gray-500">
                        (匯率 {exp.exchangeRate})
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if(confirm('確定要刪除這筆帳目嗎？')) removeExpense(exp.id);
                    }}
                    className="text-red-500 opacity-80 hover:opacity-100 p-1 active:scale-95 transition-all outline-none"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Adding Expense */}
      <button
        onClick={() => setIsAddingExpense(true)}
        className="fixed bottom-24 right-5 md:right-[calc(50%-12rem)] w-[60px] h-[60px] bg-apple-blue-heavy text-white rounded-full flex items-center justify-center shadow-soft-hover hover:scale-105 active:scale-95 transition-all outline-none border-[4px] border-apple-bg dark:border-apple-bg-dark z-50"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {isAddingExpense && <AddExpenseModal onClose={() => setIsAddingExpense(false)} />}
    </>
  );
}
