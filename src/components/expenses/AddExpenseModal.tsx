import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Currency } from '../../types';
import { fetchJpyToTwdRate } from '../../utils/exchangeRateApi';

interface AddExpenseModalProps {
  onClose: () => void;
}

export function AddExpenseModal({ onClose }: AddExpenseModalProps) {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const allUsers = useStore(state => state.users);
  const users = allUsers.filter(u => u.ledgerId === activeLedgerId);
  const addExpense = useStore(state => state.addExpense);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('TWD');
  const [exchangeRate, setExchangeRate] = useState<string>('1');
  const [paidBy, setPaidBy] = useState<string>(users[0]?.id || '');
  const [splitAmong, setSplitAmong] = useState<Set<string>>(new Set(users.map(u => u.id)));
  
  const [isFetchingRate, setIsFetchingRate] = useState(false);

  useEffect(() => {
    if (currency === 'JPY') {
      setIsFetchingRate(true);
      fetchJpyToTwdRate().then(rate => {
        setExchangeRate(rate.toString());
      }).finally(() => {
        setIsFetchingRate(false);
      });
    } else {
      setExchangeRate('1');
    }
  }, [currency]);

  const toggleSplitUser = (userId: string) => {
    const next = new Set(splitAmong);
    if (next.has(userId)) {
      next.delete(userId);
    } else {
      next.add(userId);
    }
    setSplitAmong(next);
  };

  const handleSave = () => {
    if (!title || !amount || !paidBy || splitAmong.size === 0) return;
    
    addExpense({
      title,
      amount: Number(amount),
      currency,
      exchangeRate: Number(exchangeRate) || 1,
      paidBy,
      splitAmong: Array.from(splitAmong),
    });
    onClose();
  };

  if (users.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-apple-card/90 dark:bg-apple-card-dark/90 backdrop-blur-2xl rounded-[2.5rem] p-8 w-full max-w-sm text-center shadow-soft-dark border border-white/20">
          <h3 className="text-2xl font-display font-bold mb-3">無法新增帳目</h3>
          <p className="text-gray-500 mb-6 font-rounded">請先到「成員」頁籤新增參與分帳的人員喔！</p>
          <button onClick={onClose} className="w-full bg-apple-blue-heavy text-white py-4 rounded-[1.5rem] font-rounded font-bold shadow-soft-hover transition-all active:scale-95">我知道了</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-md flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-apple-bg/90 dark:bg-apple-bg-dark/90 backdrop-blur-3xl w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-soft-dark border border-white/20 max-h-[90vh] overflow-y-auto pb-safe relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-transparent px-6 py-5 border-b border-apple-border/50 dark:border-apple-border-dark/50 flex justify-between items-center z-10">
          <h2 className="text-2xl font-display font-bold">新增帳目</h2>
          <button onClick={onClose} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Name & Amount */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">消費名稱</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="例如：晚餐、交通費"
                className="w-full bg-apple-card/60 dark:bg-apple-card-dark/60 border border-white/50 dark:border-white/10 rounded-[1.5rem] px-5 py-4 outline-none focus:ring-2 focus:ring-apple-blue-heavy transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-500 mb-1">幣別</label>
                <div className="flex bg-apple-card/60 dark:bg-apple-card-dark/60 rounded-[1.5rem] p-1.5 border border-white/50 dark:border-white/10">
                  <button
                    onClick={() => setCurrency('TWD')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors ${currency === 'TWD' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'}`}
                  >TWD</button>
                  <button
                    onClick={() => setCurrency('JPY')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors ${currency === 'JPY' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'}`}
                  >JPY</button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500 mb-1">金額</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full bg-apple-card/60 dark:bg-apple-card-dark/60 border border-white/50 dark:border-white/10 rounded-[1.5rem] px-5 py-4 outline-none focus:ring-2 focus:ring-apple-blue-heavy transition-all font-mono text-lg"
                />
              </div>
            </div>

            {/* Exchange Rate Setup */}
            {currency === 'JPY' && (
              <div className="bg-apple-blue/10 rounded-xl p-4 flex items-center justify-between border border-apple-blue/20">
                <div className="flex gap-2 items-center text-sm font-medium text-apple-blue">
                  {isFetchingRate ? <Loader2 size={16} className="animate-spin" /> : null}
                  當前匯率 (JPY to TWD)
                </div>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={e => setExchangeRate(e.target.value)}
                  step="0.0001"
                  className="w-24 text-right bg-transparent outline-none font-semibold text-apple-blue border-b border-apple-blue/30 focus:border-apple-blue transition-colors"
                />
              </div>
            )}
          </div>

          <hr className="border-apple-border dark:border-apple-border-dark" />

          {/* Paid By */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">誰先付的？</label>
            <div className="flex flex-wrap gap-2">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => setPaidBy(u.id)}
                  className={`px-5 py-2.5 rounded-[1.5rem] font-medium transition-all border ${paidBy === u.id ? 'bg-[#7FB8A1] text-white border-transparent shadow-sm font-bold' : 'bg-apple-card/40 dark:bg-apple-card-dark/40 border-white/50 dark:border-white/10 text-gray-600 dark:text-gray-300'}`}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-apple-border dark:border-apple-border-dark" />

          {/* Split Among */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-500">分攤給誰？（皆平分）</label>
              <button 
                onClick={() => setSplitAmong(new Set(splitAmong.size === users.length ? [] : users.map(u=>u.id)))}
                className="text-apple-blue text-sm font-medium"
              >
                {splitAmong.size === users.length ? '全不選' : '全選'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => toggleSplitUser(u.id)}
                  className={`px-5 py-2.5 rounded-[1.5rem] font-medium transition-all border ${splitAmong.has(u.id) ? 'bg-apple-blue-heavy text-white border-transparent shadow-sm font-bold' : 'bg-apple-card/40 dark:bg-apple-card-dark/40 border-white/50 dark:border-white/10 text-gray-600 dark:text-gray-300'}`}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-transparent backdrop-blur-xl p-6 border-t border-apple-border/50 dark:border-apple-border-dark/50">
          <button
            onClick={handleSave}
            disabled={!title || !amount || Number(amount) <= 0 || splitAmong.size === 0}
            className="w-full bg-apple-blue-heavy text-white py-4 rounded-[1.5rem] font-rounded font-bold text-lg disabled:opacity-50 active:scale-95 transition-all shadow-soft-hover"
          >
            確定儲存
          </button>
        </div>
      </div>
    </div>
  );
}
