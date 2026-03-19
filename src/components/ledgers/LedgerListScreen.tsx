import { useState } from 'react';
import { BookText, Trash2, UserPlus, Calculator, Plus, Pencil } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CreateLedgerModal } from './CreateLedgerModal';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { TabType } from '../layout/BottomNav';
import { Avatar } from '../ui/Avatar';
import { AvatarPickerModal } from '../ui/AvatarPickerModal';

export function LedgerListScreen({ onEnterLedger }: { onEnterLedger?: (tab: TabType) => void }) {
  const ledgers = useStore(state => state.ledgers);
  const removeLedger = useStore(state => state.removeLedger);
  const setActiveLedger = useStore(state => state.setActiveLedger);
  const updateLedgerAvatar = useStore(state => state.updateLedgerAvatar);
  const users = useStore(state => state.users);
  const expenses = useStore(state => state.expenses);

  const [isAdding, setIsAdding] = useState(false);
  const [editingLedgerId, setEditingLedgerId] = useState<string | null>(null);

  const getLedgerStats = (id: string) => {
    const lUsers = users.filter(u => u.ledgerId === id);
    const lExpenses = expenses.filter(e => e.ledgerId === id);
    const totalTwd = lExpenses.reduce((sum, e) => sum + (e.currency === 'TWD' ? e.amount : e.amount * e.exchangeRate), 0);
    return { userCount: lUsers.length, expenseCount: lExpenses.length, total: Math.round(totalTwd) };
  };

  const editingLedger = editingLedgerId ? ledgers.find(l => l.id === editingLedgerId) : undefined;

  return (
    <div className="min-h-screen bg-apple-bg dark:bg-apple-bg-dark text-apple-text dark:text-apple-text-dark font-sans relative transition-colors duration-500">
      <div className="max-w-md mx-auto min-h-screen bg-apple-bg dark:bg-apple-bg-dark pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+2rem)] px-5 py-8 shadow-soft-dark dark:shadow-black/20 relative flex flex-col transition-colors duration-500">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold tracking-tight text-apple-text dark:text-apple-text-dark">我的帳本</h1>
          <ThemeToggle />
        </div>

        {ledgers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-70 flex-1">
            <BookText size={48} className="text-gray-400 mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">還沒有任何帳本</h2>
            <p className="text-gray-500 font-rounded text-sm max-w-[200px] mx-auto">點擊下方按鈕開始您的第一趟分帳旅程吧！</p>
          </div>
        ) : (
          <div className="space-y-5 pb-8 flex-1">
            {ledgers.map(ledger => {
              const stats = getLedgerStats(ledger.id);
              const dateStr = new Date(ledger.createdAt).toLocaleDateString();
              return (
                <div 
                  key={ledger.id} 
                  onClick={() => {
                    setActiveLedger(ledger.id);
                    onEnterLedger?.('dashboard');
                  }}
                  className="bg-apple-card/60 dark:bg-apple-card-dark/60 backdrop-blur-2xl rounded-[2rem] p-6 shadow-soft dark:shadow-soft-dark border border-white/50 dark:border-white/10 cursor-pointer hover:shadow-soft-hover active:scale-[0.98] transition-all group relative overflow-hidden flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingLedgerId(ledger.id);
                        }}
                        className="w-14 h-14 bg-pastel-mint dark:bg-pastel-mint/10 rounded-[1.25rem] flex items-center justify-center text-apple-blue-heavy shadow-inner relative outline-none"
                        aria-label="編輯帳本頭像"
                        title="編輯頭像"
                      >
                        <Avatar
                          avatar={ledger.avatar}
                          fallback="book"
                          className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center"
                        />
                        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white/80 dark:bg-black/50 border border-white/60 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil size={12} />
                        </span>
                      </button>
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

                  <div className="flex justify-between items-end mb-5">
                    <div className="text-sm font-medium text-gray-500 font-rounded">
                      {stats.userCount} <span className="text-xs">成員</span> · {stats.expenseCount} <span className="text-xs">帳目</span>
                    </div>
                    <div className="flex items-center text-apple-blue-heavy font-mono font-bold text-lg">
                      <span className="text-[11px] mr-1 opacity-70 font-sans tracking-wide">NT$</span> {stats.total.toLocaleString()}
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2 mt-auto border-t border-gray-200 dark:border-gray-800 pt-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLedger(ledger.id);
                        onEnterLedger?.('members');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-apple-bg/50 dark:bg-apple-bg-dark/50 text-apple-blue-heavy font-medium text-[13px] hover:opacity-80 transition-opacity"
                    >
                      <UserPlus size={16} /> 新增成員
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLedger(ledger.id);
                        onEnterLedger?.('settlement');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-apple-bg/50 dark:bg-apple-bg-dark/50 text-apple-text dark:text-apple-text-dark font-medium text-[13px] hover:opacity-80 transition-opacity"
                    >
                      <Calculator size={16} /> 快速結算
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Global Add Ledger Button at bottom of the list */}
        <div className="mt-8 pt-4">
          <button
            onClick={() => setIsAdding(true)}
            className="w-full bg-apple-card/40 dark:bg-apple-card-dark/40 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-[2px] border-dashed border-apple-border dark:border-apple-border-dark flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-apple-blue-heavy hover:border-apple-blue-heavy/50 hover:bg-white/50 dark:hover:bg-black/20 active:scale-95 transition-all outline-none"
          >
            <Plus size={28} />
            <span className="font-medium text-lg">建立新帳本</span>
          </button>
        </div>
      </div>
      {isAdding && <CreateLedgerModal onClose={() => setIsAdding(false)} />}
      {editingLedger && (
        <AvatarPickerModal
          title={`編輯「${editingLedger.name}」頭像`}
          initialAvatar={editingLedger.avatar}
          onClose={() => setEditingLedgerId(null)}
          onSave={(avatar) => {
            updateLedgerAvatar(editingLedger.id, avatar);
            setEditingLedgerId(null);
          }}
        />
      )}
    </div>
  );
}
