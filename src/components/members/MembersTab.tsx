import { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Avatar } from '../ui/Avatar';
import { AvatarPickerModal } from '../ui/AvatarPickerModal';
import type { Avatar as AvatarType } from '../../types';

export function MembersTab() {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const allUsers = useStore(state => state.users);
  const users = allUsers.filter(u => u.ledgerId === activeLedgerId);
  const addUser = useStore(state => state.addUser);
  const removeUser = useStore(state => state.removeUser);
  const updateUserAvatar = useStore(state => state.updateUserAvatar);
  const [newName, setNewName] = useState('');
  const [errorName, setErrorName] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newUserAvatar, setNewUserAvatar] = useState<AvatarType | undefined>(undefined);
  const [isPickingNewUserAvatar, setIsPickingNewUserAvatar] = useState(false);

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

    addUser(trimmed, newUserAvatar);
    setNewName('');
    setErrorName('');
    setNewUserAvatar(undefined);
  };

  const editingUser = editingUserId ? users.find(u => u.id === editingUserId) : undefined;

  return (
    <div className="space-y-6">
      
      {/* Add Member Card */}
      <div className="apple-card p-6 flex flex-col gap-3">
        <div className="flex gap-3 items-center">
            <button
              onClick={() => setIsPickingNewUserAvatar(true)}
              className="w-14 h-14 rounded-apple-xl bg-apple-bg dark:bg-black/50 border border-apple-border/50 dark:border-apple-border-dark flex items-center justify-center text-apple-blue-heavy shadow-inner relative outline-none flex-shrink-0"
              aria-label="設定成員頭像（選填）"
              title="設定頭像（選填）"
            >
              <Avatar
                avatar={newUserAvatar}
                fallback="user"
                className="w-14 h-14 rounded-apple-xl flex items-center justify-center"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white/80 dark:bg-black/50 border border-white/60 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300">
                <Pencil size={12} />
              </span>
            </button>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (errorName) setErrorName('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="輸入成員名稱..."
              className={errorName ? 'apple-input flex-1 border-red-500' : 'apple-input flex-1'}
            />
            <button
              onClick={handleAdd}
              className="btn-primary btn-icon-circle shadow-soft-hover"
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
            <div key={user.id} className="apple-card apple-card-hover p-5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setEditingUserId(user.id)}
                  className="w-12 h-12 rounded-apple-xl bg-pastel-lavender dark:bg-pastel-lavender/10 flex items-center justify-center text-apple-blue-heavy shadow-inner relative outline-none"
                  aria-label="編輯成員頭像"
                  title="編輯頭像"
                >
                  <Avatar
                    avatar={user.avatar}
                    fallback="user"
                    className="w-12 h-12 rounded-apple-xl flex items-center justify-center"
                  />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white/80 dark:bg-black/50 border border-white/60 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil size={12} />
                  </span>
                </button>
                <span className="font-semibold text-lg">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  if(confirm(`確定要刪除 ${user.name} 嗎？此操作也會刪除他相關的支付資訊。`)) {
                    removeUser(user.id);
                  }
                }}
                className="btn-ghost text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {editingUser && (
        <AvatarPickerModal
          title={`編輯「${editingUser.name}」頭像`}
          initialAvatar={editingUser.avatar}
          onClose={() => setEditingUserId(null)}
          onSave={(avatar) => {
            updateUserAvatar(editingUser.id, avatar);
            setEditingUserId(null);
          }}
        />
      )}

      {isPickingNewUserAvatar && (
        <AvatarPickerModal
          title="設定成員頭像（選填）"
          initialAvatar={newUserAvatar}
          onClose={() => setIsPickingNewUserAvatar(false)}
          onSave={(avatar) => {
            setNewUserAvatar(avatar);
            setIsPickingNewUserAvatar(false);
          }}
        />
      )}

    </div>
  );
}
