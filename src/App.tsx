import { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import type { TabType } from './components/layout/BottomNav';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { MembersTab } from './components/members/MembersTab';
import { ExpensesTab } from './components/expenses/ExpensesTab';
import { SettlementTab } from './components/settlement/SettlementTab';
import { LedgerListScreen } from './components/ledgers/LedgerListScreen';
import { useStore } from './store/useStore';
import { supabase } from './utils/supabase';
import { useSync } from './hooks/useSync';

function App() {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const theme = useStore(state => state.theme);
  const session = useStore(state => state.session);
  const setSession = useStore(state => state.setSession);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const { fetchCloudLedgers } = useSync();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  useEffect(() => {
    if (session?.user) {
      fetchCloudLedgers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Reset tab to dashboard when returning to the Ledger list
  useEffect(() => {
    if (!activeLedgerId) {
      setCurrentTab('dashboard'); // Ensures next entry starts at dashboard
    }
  }, [activeLedgerId]);

  if (!activeLedgerId) {
    return <LedgerListScreen onEnterLedger={(tab) => setCurrentTab(tab)} />;
  }

  return (
    <AppLayout 
      currentTab={currentTab} 
      onChangeTab={setCurrentTab}
    >
      <h1 className="mb-6 text-apple-text dark:text-apple-text-dark">
        {currentTab === 'dashboard' && '總覽'}
        {currentTab === 'expenses' && '明細'}
        {currentTab === 'members' && '成員管理'}
        {currentTab === 'settlement' && '結算明細'}
      </h1>
      
      {currentTab === 'dashboard' && <DashboardTab />}
      {currentTab === 'expenses' && <ExpensesTab />}
      {currentTab === 'members' && <MembersTab />}
      {currentTab === 'settlement' && <SettlementTab />}
    </AppLayout>
  );
}

export default App;
