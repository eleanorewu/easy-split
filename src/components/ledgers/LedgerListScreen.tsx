import { useState } from 'react';
import { Plus, BookText, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function LedgerListScreen() {
  const ledgers = useStore(state => state.ledgers);
  const addLedger = useStore(state => state.addLedger);
  const removeLedger = useStore(state => state.removeLedger);
  const setActiveLedger = useStore(state => state.setActiveLedger);
  const users = useStore(state => state.users);
  const expenses = useStore(state => state.expenses);

  const [isAdding, setIsAdding] = useState(false);
  const [newLedgerName, setNewLedgerName] = useState('');

  const handleCreate = () => {
    if (newLedgerName.trim()) {
      addLedger(newLedgerName.trim());
      setNewLedgerName('');
      setIsAdding(false);
    }
  };

  const getLedgerStats = (id: string) => {
    const lUsers = users.filter(u => u.ledgerId === id);
    const lExpenses = expenses.filter(e => e.ledgerId === id);
    const totalTwd = lExpenses.reduce((sum, e) => sum + (e.currency === 'TWD' ? e.amount : e.amount * e.exchangeRate), 0);
    return { userCount: lUsers.length, expenseCount: lExpenses.length, total: Math.round(totalTwd) };
  };

  return (
    <div className="min-h-screen bg-apple-card/50 dark:bg-apple-bg-dark text-apple-text dark:text-apple-text-dark font-sans selection:bg-apple-blue selection:text-white">
      <div className="max-w-md mx-auto min-h-screen bg-apple-bg dark:bg-apple-bg-dark pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+2rem)] px-5 py-8 shadow-2xl shadow-black/5">
        <h1 className="text-4xl font-bold mb-8 tracking-tight">我的帳本</h1>

        <div className="space-y-4">
          {ledgers.map(ledger => {
            const stats = getLedgerStats(ledger.id);
            const dateStr = new Date(ledger.createdAt).toLocaleDateString();
            return (
              <div 
                key={ledger.id} 
                onClick={() => setActiveLedger(ledger.id)}
                className="bg-apple-card dark:bg-apple-card-dark rounded-3xl p-5 shadow-sm border border-apple-border dark:border-apple-border-dark cursor-pointer active:scale-95 transition-transform group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-apple-blue/10 rounded-2xl flex items-center justify-center text-apple-blue">
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
                  <div className="text-sm font-medium text-gray-500">
                    {stats.userCount} 位成員 · {stats.expenseCount} 筆花費
                  </div>
                  <div className="flex items-center text-apple-blue font-semibold">
                    NT$ {stats.total.toLocaleString()}
                    <ArrowRight size={18} className="ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}

          {isAdding ? (
            <div className="bg-apple-card dark:bg-apple-card-dark rounded-3xl p-5 shadow-sm border border-apple-border dark:border-apple-border-dark flex gap-3 items-center">
              <input
                autoFocus
                type="text"
                value={newLedgerName}
                onChange={e => setNewLedgerName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="輸入帳本名稱 (如: 沖繩五日遊)"
                className="flex-1 bg-apple-bg dark:bg-black/50 border border-apple-border dark:border-apple-border-dark rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-apple-blue transition-all"
              />
              <button 
                onClick={handleCreate}
                disabled={!newLedgerName.trim()}
                className="bg-apple-blue text-white p-3 rounded-xl disabled:opacity-50 active:scale-95 transition-all"
              >
                <Plus size={24} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full bg-apple-card dark:bg-apple-card-dark rounded-3xl p-5 shadow-sm border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-apple-blue hover:border-apple-blue/50 hover:bg-apple-blue/5 active:scale-95 transition-all"
            >
              <Plus size={28} />
              <span className="font-medium">建立新帳本</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
