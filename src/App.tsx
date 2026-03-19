import { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import type { TabType } from './components/layout/BottomNav';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { MembersTab } from './components/members/MembersTab';
import { ExpensesTab } from './components/expenses/ExpensesTab';
import { SettlementTab } from './components/settlement/SettlementTab';
import { AddExpenseModal } from './components/expenses/AddExpenseModal';
import { LedgerListScreen } from './components/ledgers/LedgerListScreen';
import { useStore } from './store/useStore';

function App() {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const theme = useStore(state => state.theme);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Router: If no explicit ledger is selected, view all ledgers
  if (!activeLedgerId) {
    return <LedgerListScreen />;
  }

  return (
    <AppLayout 
      currentTab={currentTab} 
      onChangeTab={setCurrentTab}
      onAddClick={() => setIsModalOpen(true)}
    >
      <h1 className="text-4xl font-display font-bold mb-6 tracking-tight text-apple-text dark:text-apple-text-dark">
        {currentTab === 'dashboard' && '總覽'}
        {currentTab === 'expenses' && '帳目'}
        {currentTab === 'members' && '成員'}
        {currentTab === 'settlement' && '結算明細'}
      </h1>
      
      {currentTab === 'dashboard' && <DashboardTab />}
      {currentTab === 'members' && <MembersTab />}
      {currentTab === 'expenses' && <ExpensesTab />}
      {currentTab === 'settlement' && <SettlementTab />}

      {isModalOpen && <AddExpenseModal onClose={() => setIsModalOpen(false)} />}
    </AppLayout>
  );
}

export default App;
