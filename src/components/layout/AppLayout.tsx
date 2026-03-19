import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { BottomNav } from './BottomNav';
import type { TabType } from './BottomNav';
import { useStore } from '../../store/useStore';
import { ThemeToggle } from '../ui/ThemeToggle';

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
    <div className="min-h-screen bg-apple-bg dark:bg-apple-bg-dark text-apple-text dark:text-apple-text-dark font-sans">
      <div className="max-w-md mx-auto min-h-screen bg-apple-bg dark:bg-apple-bg-dark shadow-soft-dark dark:shadow-black/20 relative pb-28 pt-[env(safe-area-inset-top)] flex flex-col">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-apple-bg/70 dark:bg-apple-bg-dark/70 backdrop-blur-2xl border-b border-apple-border/50 dark:border-apple-border-dark/50 px-4 h-[60px] flex items-center justify-between">
          <button 
            onClick={() => setActiveLedger(null)}
            className="flex items-center text-apple-blue font-medium active:opacity-70 transition-opacity -ml-2 p-2 outline-none"
          >
            <ChevronLeft size={24} />
            <span className="text-[17px] -ml-1 font-display">帳本</span>
          </button>
          <div className="font-display font-semibold text-[18px] truncate max-w-[50%]">
            {ledger?.name}
          </div>
          <div className="w-[60px] flex justify-end">
            <ThemeToggle />
          </div>
        </header>

        <main className="px-5 py-6 flex-1">
          {children}
        </main>
        
        <BottomNav currentTab={currentTab} onChangeTab={onChangeTab} onAddClick={onAddClick} />
      </div>
    </div>
  );
}
