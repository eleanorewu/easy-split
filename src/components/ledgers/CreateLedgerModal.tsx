import { useState } from 'react';
import { X, Plus, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface CreateLedgerModalProps {
  onClose: () => void;
}

export function CreateLedgerModal({ onClose }: CreateLedgerModalProps) {
  const addLedger = useStore(state => state.addLedger);
  
  const [name, setName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorMember, setErrorMember] = useState('');

  const handleAddMember = () => {
    const trimmed = newMember.trim();
    if (!trimmed) return;
    
    if (trimmed.length > 15) {
      setErrorMember('成員名稱不能超過 15 個字');
      return;
    }
    if (members.includes(trimmed)) {
      setErrorMember('此成員名稱已存在');
      return;
    }

    setMembers([...members, trimmed]);
    setNewMember('');
    setErrorMember('');
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

    addLedger(trimmedName, members);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-0 sm:p-5">
      <div className="w-full max-w-md bg-apple-bg/90 dark:bg-apple-bg-dark/90 backdrop-blur-3xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-soft-dark border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-apple-border/50 dark:border-apple-border-dark/50 bg-transparent z-10 sticky top-0">
          <h2 className="text-2xl font-display font-bold tracking-tight">建立新帳本</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-apple-bg dark:bg-black/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto min-h-[50vh] sm:min-h-0 space-y-6">
          
          {/* Ledger Name Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400">
              帳本名稱 <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorName) setErrorName('');
              }}
              placeholder="例如：沖繩五日遊"
              className={`w-full bg-apple-card/60 dark:bg-apple-card-dark/60 border ${errorName ? 'border-red-500' : 'border-white/50 dark:border-white/10'} rounded-[1.5rem] px-5 py-4 outline-none focus:ring-2 focus:ring-apple-blue-heavy transition-all`}
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
                   className={`w-full bg-apple-card/60 dark:bg-apple-card-dark/60 border ${errorMember ? 'border-red-500' : 'border-white/50 dark:border-white/10'} rounded-[1.5rem] px-5 py-4 outline-none focus:ring-2 focus:ring-apple-blue-heavy transition-all`}
                 />
                 {errorMember && <p className="text-sm text-red-500 pl-1">{errorMember}</p>}
               </div>
               <button
                 onClick={handleAddMember}
                 className="bg-apple-blue text-white p-3 rounded-xl hover:bg-blue-600 transition-colors active:scale-95 flex-shrink-0"
               >
                 <Plus size={24} />
               </button>
             </div>

             {/* Member Tags */}
             {members.length > 0 && (
               <div className="flex flex-wrap gap-2 mt-3 p-3 bg-apple-card dark:bg-apple-card-dark rounded-xl border border-apple-border dark:border-apple-border-dark">
                 {members.map((m, idx) => (
                   <div key={idx} className="flex items-center gap-1.5 bg-apple-bg dark:bg-black/50 px-3 py-1.5 rounded-lg text-sm font-medium">
                     <span>{m}</span>
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
            className="w-full bg-apple-blue-heavy text-white font-rounded font-bold py-4 rounded-[1.5rem] hover:bg-apple-blue active:scale-95 transition-all shadow-soft-hover"
          >
            建立並開始記帳
          </button>
        </div>
      </div>
    </div>
  );
}
