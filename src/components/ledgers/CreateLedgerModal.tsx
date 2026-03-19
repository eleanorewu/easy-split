import { useState } from 'react';
import { X, Plus, Users, Pencil } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Avatar as AvatarType } from '../../types';
import { Avatar } from '../ui/Avatar';
import { AvatarPickerModal } from '../ui/AvatarPickerModal';

interface CreateLedgerModalProps {
  onClose: () => void;
}

type DraftMember = { name: string; avatar?: AvatarType };

export function CreateLedgerModal({ onClose }: CreateLedgerModalProps) {
  const addLedger = useStore(state => state.addLedger);
  
  const [name, setName] = useState('');
  const [ledgerAvatar, setLedgerAvatar] = useState<AvatarType | undefined>(undefined);
  const [isPickingLedgerAvatar, setIsPickingLedgerAvatar] = useState(false);

  const [members, setMembers] = useState<DraftMember[]>([]);
  const [newMember, setNewMember] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState<AvatarType | undefined>(undefined);
  const [isPickingNewMemberAvatar, setIsPickingNewMemberAvatar] = useState(false);
  const [editingMemberIdx, setEditingMemberIdx] = useState<number | null>(null);
  const [errorName, setErrorName] = useState('');
  const [errorMember, setErrorMember] = useState('');

  const handleAddMember = () => {
    const trimmed = newMember.trim();
    if (!trimmed) return;
    
    if (trimmed.length > 15) {
      setErrorMember('成員名稱不能超過 15 個字');
      return;
    }
    if (members.some(m => m.name === trimmed)) {
      setErrorMember('此成員名稱已存在');
      return;
    }

    setMembers([...members, { name: trimmed, avatar: newMemberAvatar }]);
    setNewMember('');
    setErrorMember('');
    setNewMemberAvatar(undefined);
  };

  const handleRemoveMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorName('請輸入帳本名稱');
      return;
    }
    if (trimmedName.length > 20) {
      setErrorName('名稱不能超過 20 個字');
      return;
    }

    addLedger(trimmedName, members, ledgerAvatar);
    onClose();
  };

  const editingMember = editingMemberIdx === null ? undefined : members[editingMemberIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-0 sm:p-5">
      <div className="w-full max-w-md bg-apple-bg/90 dark:bg-apple-bg-dark/90 backdrop-blur-3xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-soft-dark border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-apple-border/50 dark:border-apple-border-dark/50 bg-transparent z-10 sticky top-0">
          <h2 className="text-2xl tracking-tight">建立新帳本</h2>
          <button 
            onClick={onClose}
            className="btn-ghost bg-apple-bg dark:bg-black/50 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto min-h-[50vh] sm:min-h-0 space-y-6">
          
          {/* Ledger Name Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400">
                帳本名稱 <span className="text-red-500">*</span>
              </label>
              <button
                onClick={() => setIsPickingLedgerAvatar(true)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-apple-blue-heavy transition-colors"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-apple-card/60 dark:bg-apple-card-dark/60 border border-white/30 dark:border-white/10 text-apple-blue-heavy shadow-inner">
                  <Avatar
                    avatar={ledgerAvatar}
                    fallback="book"
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                  />
                </span>
                <span>頭像（選填）</span>
              </button>
            </div>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorName) setErrorName('');
              }}
              placeholder="例如：沖繩五日遊"
              className={errorName ? 'apple-input w-full border-red-500' : 'apple-input w-full'}
            />
            {errorName && <p className="text-sm text-red-500">{errorName}</p>}
          </div>

          {/* Initial Members Section */}
          <div className="space-y-3">
             <div className="flex items-center gap-2">
                <Users size={18} className="text-apple-blue" />
                <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400">
                  初始成員 (選填)
                </label>
             </div>
             
             <div className="flex gap-2 items-start">
               <button
                 onClick={() => setIsPickingNewMemberAvatar(true)}
                 className="w-14 h-14 rounded-[1.5rem] bg-apple-card/60 dark:bg-apple-card-dark/60 border border-white/50 dark:border-white/10 flex items-center justify-center text-apple-blue-heavy shadow-inner relative outline-none flex-shrink-0"
                 aria-label="設定成員頭像（選填）"
                 title="設定頭像（選填）"
               >
                 <Avatar
                   avatar={newMemberAvatar}
                   fallback="user"
                   className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center"
                 />
                 <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white/80 dark:bg-black/50 border border-white/60 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300">
                   <Pencil size={12} />
                 </span>
               </button>
               <div className="flex-1 space-y-1">
                 <input
                   type="text"
                   value={newMember}
                   onChange={(e) => {
                     setNewMember(e.target.value);
                     if (errorMember) setErrorMember('');
                   }}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       e.preventDefault();
                       handleAddMember();
                     }
                   }}
                   placeholder="輸入成員名稱"
                   className={errorMember ? 'apple-input w-full border-red-500' : 'apple-input w-full'}
                 />
                 {errorMember && <p className="text-sm text-red-500 pl-1">{errorMember}</p>}
               </div>
               <button
                 onClick={handleAddMember}
                 className="btn-primary w-14 h-14 rounded-apple-xl flex-shrink-0"
               >
                 <Plus size={24} />
               </button>
             </div>

             {/* Member Tags */}
             {members.length > 0 && (
               <div className="flex flex-wrap gap-2 mt-3 p-3 bg-apple-card dark:bg-apple-card-dark rounded-xl border border-apple-border dark:border-apple-border-dark">
                 {members.map((m, idx) => (
                   <div key={`${m.name}-${idx}`} className="flex items-center gap-2 bg-apple-bg dark:bg-black/50 px-3 py-1.5 rounded-lg text-sm font-medium">
                     <button
                       onClick={() => setEditingMemberIdx(idx)}
                       className="w-7 h-7 rounded-lg bg-apple-card/60 dark:bg-apple-card-dark/60 border border-white/30 dark:border-white/10 text-apple-blue-heavy shadow-inner flex items-center justify-center outline-none"
                       aria-label={`編輯 ${m.name} 頭像`}
                       title="編輯頭像"
                     >
                       <Avatar
                         avatar={m.avatar}
                         fallback="user"
                         className="w-7 h-7 rounded-lg flex items-center justify-center"
                       />
                     </button>
                     <span>{m.name}</span>
                     <button 
                       onClick={() => handleRemoveMember(idx)}
                       className="text-gray-400 hover:text-red-500 transition-colors"
                     >
                       <X size={16} />
                     </button>
                   </div>
                 ))}
               </div>
             )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-apple-border/50 dark:border-apple-border-dark/50 bg-transparent z-10">
          <button 
            onClick={handleSave}
            className="btn-primary w-full py-4 rounded-apple-xl shadow-soft-hover"
          >
            建立並開始記帳
          </button>
        </div>
      </div>

      {isPickingLedgerAvatar && (
        <AvatarPickerModal
          title="設定帳本頭像（選填）"
          initialAvatar={ledgerAvatar}
          onClose={() => setIsPickingLedgerAvatar(false)}
          onSave={(avatar) => {
            setLedgerAvatar(avatar);
            setIsPickingLedgerAvatar(false);
          }}
        />
      )}

      {isPickingNewMemberAvatar && (
        <AvatarPickerModal
          title="設定成員頭像（選填）"
          initialAvatar={newMemberAvatar}
          onClose={() => setIsPickingNewMemberAvatar(false)}
          onSave={(avatar) => {
            setNewMemberAvatar(avatar);
            setIsPickingNewMemberAvatar(false);
          }}
        />
      )}

      {editingMember !== undefined && editingMemberIdx !== null && (
        <AvatarPickerModal
          title={`編輯「${editingMember.name}」頭像`}
          initialAvatar={editingMember.avatar}
          onClose={() => setEditingMemberIdx(null)}
          onSave={(avatar) => {
            setMembers(prev => prev.map((m, i) => (i === editingMemberIdx ? { ...m, avatar } : m)));
            setEditingMemberIdx(null);
          }}
        />
      )}
    </div>
  );
}
