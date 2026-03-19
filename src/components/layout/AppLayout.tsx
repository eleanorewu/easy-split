import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { BottomNav } from './BottomNav';
import type { TabType } from './BottomNav';
import { useStore } from '../../store/useStore';

interface AppLayoutProps {
  children: ReactNode;
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onAddClick: () => void;
}

export function AppLayout({ children, currentTab, onChangeTab, onAddClick }: AppLayoutProps) {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const ledger = useStore(state => state.ledgers.find(l => l.id === activeLedgerId));
  const setActiveLedger = useStore(state => state.setActiveLedger);

  return (
    <div className="min-h-screen bg-apple-card/50 dark:bg-apple-bg-dark text-apple-text dark:text-apple-text-dark font-sans selection:bg-apple-blue selection:text-white">
      <div className="max-w-md mx-auto min-h-screen bg-apple-bg dark:bg-apple-bg-dark shadow-2xl shadow-black/5 relative pb-24 pt-[env(safe-area-inset-top)] flex flex-col">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-apple-bg/80 dark:bg-apple-bg-dark/80 backdrop-blur-xl border-b border-apple-border dark:border-apple-border-dark px-4 h-[56px] flex items-center justify-between">
          <button 
            onClick={() => setActiveLedger(null)}
            className="flex items-center text-apple-blue font-medium active:opacity-70 transition-opacity -ml-2 p-2 outline-none"
          >
            <ChevronLeft size={24} />
            <span className="text-[17px] -ml-1">帳本</span>
          </button>
          <div className="font-semibold text-[17px] truncate max-w-[50%]">
            {ledger?.name}
          </div>
          <div className="w-[60px]" /> {/* Spacer to naturally balance flex alignment */}
        </header>

        <main className="px-5 py-6 flex-1">
          {children}
        </main>
        
        <BottomNav currentTab={currentTab} onChangeTab={onChangeTab} onAddClick={onAddClick} />
      </div>
    </div>
  );
}
