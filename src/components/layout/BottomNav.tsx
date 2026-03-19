import { Home, Receipt, Users, Landmark, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type TabType = 'dashboard' | 'expenses' | 'members' | 'settlement';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onAddClick: () => void;
}

export function BottomNav({ currentTab, onChangeTab, onAddClick }: BottomNavProps) {
  const tabsLeft = [
    { id: 'dashboard', label: '總覽', icon: Home },
    { id: 'expenses', label: '帳目', icon: Receipt },
  ];
  
  const tabsRight = [
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
            "flex flex-col items-center justify-center w-[20%] h-full space-y-1 transition-all outline-none",
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
      <div className="mx-4 bg-apple-card/70 dark:bg-apple-card-dark/70 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2rem] shadow-soft dark:shadow-soft-dark pointer-events-auto transition-all">
        <div className="flex justify-between items-center h-[68px] px-2 relative">
          {tabsLeft.map(renderTab)}
          
          {/* Center Add Button */}
          <div className="relative -top-6 flex justify-center w-[20%]">
            <button 
              onClick={onAddClick}
              className="w-[60px] h-[60px] bg-apple-blue text-white rounded-full flex items-center justify-center shadow-soft-hover active:scale-95 transition-all outline-none border-[4px] border-apple-bg dark:border-apple-bg-dark"
            >
              <Plus size={28} strokeWidth={2.5} />
            </button>
          </div>

          {tabsRight.map(renderTab)}
        </div>
      </div>
    </div>
  );
}
