import { Trash2, ReceiptText } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function ExpensesTab() {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const allExpenses = useStore(state => state.expenses);
  const allUsers = useStore(state => state.users);
  const expenses = allExpenses.filter(e => e.ledgerId === activeLedgerId);
  const users = allUsers.filter(u => u.ledgerId === activeLedgerId);
  const removeExpense = useStore(state => state.removeExpense);

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || '未知';

  return (
    <div className="space-y-4 pb-24 relative min-h-[60vh]">
      {expenses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          目前還沒有明細，點擊下方 + 按鈕新增 😎
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map(exp => (
            <div key={exp.id} className="bg-apple-card dark:bg-apple-card-dark rounded-2xl p-4 shadow-sm border border-apple-border dark:border-apple-border-dark flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue shrink-0">
                  <ReceiptText size={20} />
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
                  <div className="font-semibold">
                    {exp.currency === 'JPY' ? '¥' : 'NT$'} {exp.amount.toLocaleString()}
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
  );
}
