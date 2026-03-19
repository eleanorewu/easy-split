import { useState } from 'react';
import { Plus, Trash2, User as UserIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function MembersTab() {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const allUsers = useStore(state => state.users);
  const users = allUsers.filter(u => u.ledgerId === activeLedgerId);
  const addUser = useStore(state => state.addUser);
  const removeUser = useStore(state => state.removeUser);
  const [newName, setNewName] = useState('');
  const [errorName, setErrorName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setErrorName('請輸入成員名稱');
      return;
    }
    if (trimmed.length > 15) {
      setErrorName('名稱不能超過 15 個字');
      return;
    }
    if (users.some(u => u.name === trimmed)) {
      setErrorName('此成員名稱已存在');
      return;
    }

    addUser(trimmed);
    setNewName('');
    setErrorName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Add Member Card */}
      <div className="bg-apple-card/40 dark:bg-apple-card-dark/40 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-white/50 dark:border-white/10 flex flex-col gap-3">
        <div className="flex gap-3 items-center">
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (errorName) setErrorName('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="輸入成員名稱..."
              className={`flex-1 bg-apple-bg dark:bg-black/50 border ${errorName ? 'border-red-500' : 'border-apple-border/50 dark:border-apple-border-dark'} rounded-[1.5rem] px-5 py-4 outline-none focus:ring-2 focus:ring-apple-blue-heavy transition-all`}
            />
            <button
              onClick={handleAdd}
              className="bg-apple-blue-heavy text-white w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-soft-hover"
            >
              <Plus size={24} />
            </button>
        </div>
        {errorName && <p className="text-sm text-red-500 px-1">{errorName}</p>}
      </div>

      {/* Members List */}
      <div className="space-y-3 pb-8">
        {users.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            目前還沒有成員，請先新增成員 😎
          </div>
        ) : (
          users.map(user => (
            <div key={user.id} className="bg-apple-card/60 dark:bg-apple-card-dark/60 backdrop-blur-2xl rounded-[2rem] p-5 shadow-soft dark:shadow-soft-dark border border-white/50 dark:border-white/10 flex items-center justify-between group hover:shadow-soft-hover transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[1.25rem] bg-pastel-lavender dark:bg-pastel-lavender/10 flex items-center justify-center text-apple-blue-heavy shadow-inner">
                  <UserIcon size={22} />
                </div>
                <span className="font-semibold text-lg">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  if(confirm(`確定要刪除 ${user.name} 嗎？此操作也會刪除他相關的支付資訊。`)) {
                    removeUser(user.id);
                  }
                }}
                className="text-red-500 opacity-80 hover:opacity-100 p-2 active:scale-95 transition-all outline-none"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
