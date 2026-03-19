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

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      addUser(trimmed);
      setNewName('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Add Member Card */}
      <div className="bg-apple-card dark:bg-apple-card-dark rounded-3xl p-5 shadow-sm border border-apple-border dark:border-apple-border-dark flex gap-3 items-center">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="輸入成員名稱..."
          className="flex-1 bg-apple-bg dark:bg-black/50 border border-apple-border dark:border-apple-border-dark rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-apple-blue transition-all"
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="bg-apple-blue text-white p-3 rounded-xl disabled:opacity-50 transition-opacity active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Members List */}
      <div className="space-y-3 pb-8">
        {users.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            目前還沒有成員，請先新增成員 😎
          </div>
        ) : (
          users.map(user => (
            <div key={user.id} className="bg-apple-card dark:bg-apple-card-dark rounded-2xl p-4 shadow-sm border border-apple-border dark:border-apple-border-dark flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-apple-bg dark:bg-black/50 flex items-center justify-center text-apple-text dark:text-apple-text-dark">
                  <UserIcon size={20} />
                </div>
                <span className="font-medium text-lg">{user.name}</span>
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
