import { Home, Receipt, Users, Landmark } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type TabType = 'dashboard' | 'expenses' | 'members' | 'settlement';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export function BottomNav({ currentTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', label: '總覽', icon: Home },
    { id: 'expenses', label: '明細', icon: Receipt },
    { id: 'members', label: '成員', icon: Users },
    { id: 'settlement', label: '結算', icon: Landmark },
  ];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderTab = (tab: { id: string; label: string; icon: any }) => {
    const Icon = tab.icon;
    const isActive = currentTab === tab.id;
    return (
      <button
        key={tab.id}
        onClick={() => onChangeTab(tab.id as TabType)}
        className={twMerge(
          clsx(
            "btn-base flex flex-col items-center justify-center w-1/4 h-full space-y-1",
            isActive ? "text-apple-blue-heavy scale-105" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          )
        )}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[11px] font-rounded font-medium">{tab.label}</span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto pointer-events-none" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
      <div className="mx-4 bg-apple-card/70 dark:bg-apple-card-dark/70 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-apple-2xl shadow-soft dark:shadow-soft-dark pointer-events-auto transition-all">
        <div className="flex justify-between items-center h-[68px] px-2 relative">
          {tabs.map(renderTab)}
        </div>
      </div>
    </div>
  );
}
