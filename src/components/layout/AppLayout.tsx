import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { BottomNav } from './BottomNav';
import type { TabType } from './BottomNav';
import { useStore } from '../../store/useStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { AvatarPickerModal } from '../ui/AvatarPickerModal';

interface AppLayoutProps {
  children: ReactNode;
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export function AppLayout({ children, currentTab, onChangeTab }: AppLayoutProps) {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const ledger = useStore(state => state.ledgers.find(l => l.id === activeLedgerId));
  const setActiveLedger = useStore(state => state.setActiveLedger);
  const updateLedgerAvatar = useStore(state => state.updateLedgerAvatar);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  return (
    <div className="min-h-screen bg-apple-bg dark:bg-apple-bg-dark text-apple-text dark:text-apple-text-dark font-sans relative transition-colors duration-500">
      <div className="max-w-md mx-auto min-h-screen bg-apple-bg dark:bg-apple-bg-dark shadow-soft-dark dark:shadow-black/20 relative pb-28 pt-[env(safe-area-inset-top)] flex flex-col transition-colors duration-500">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-apple-bg/70 dark:bg-apple-bg-dark/70 backdrop-blur-2xl border-b border-apple-border/50 dark:border-apple-border-dark/50 px-4 h-[60px] flex items-center justify-between">
          <button 
            onClick={() => setActiveLedger(null)}
            className="flex items-center w-[100px] text-apple-blue font-medium active:opacity-70 transition-opacity -ml-2 p-2 outline-none"
          >
            <ChevronLeft size={24} />
            <span className="text-[17px] -ml-1 font-display">所有帳本</span>
          </button>
          
          <div className="font-display font-semibold text-[18px] truncate flex-1 text-center flex items-center justify-center gap-2">
            {ledger && (
              <button
                onClick={() => setIsEditingAvatar(true)}
                className="w-8 h-8 rounded-xl bg-apple-card/60 dark:bg-apple-card-dark/60 border border-white/30 dark:border-white/10 flex items-center justify-center text-apple-blue-heavy shadow-inner outline-none"
                aria-label="編輯帳本頭像"
                title="編輯頭像"
              >
                <Avatar
                  avatar={ledger.avatar}
                  fallback="book"
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                />
              </button>
            )}
            <span className="truncate">{ledger?.name}</span>
          </div>
          
          <div className="w-[100px] flex justify-end">
            <ThemeToggle />
          </div>
        </header>

        <main className="px-5 py-6 flex-1">
          {children}
        </main>
        
        {activeLedgerId && (
          <BottomNav currentTab={currentTab} onChangeTab={onChangeTab} />
        )}
      </div>

      {ledger && isEditingAvatar && (
        <AvatarPickerModal
          title={`編輯「${ledger.name}」頭像`}
          initialAvatar={ledger.avatar}
          onClose={() => setIsEditingAvatar(false)}
          onSave={(avatar) => {
            updateLedgerAvatar(ledger.id, avatar);
            setIsEditingAvatar(false);
          }}
        />
      )}
    </div>
  );
}
