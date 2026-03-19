import { useStore } from '../../store/useStore';

export function DashboardTab() {
  const activeLedgerId = useStore(state => state.activeLedgerId);
  const allUsers = useStore(state => state.users);
  const allExpenses = useStore(state => state.expenses);
  const users = allUsers.filter(u => u.ledgerId === activeLedgerId);
  const expenses = allExpenses.filter(e => e.ledgerId === activeLedgerId);

  const totalTwd = expenses.map(e => e.currency === 'TWD' ? e.amount : e.amount * e.exchangeRate).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="bg-apple-card dark:bg-apple-card-dark rounded-3xl p-6 shadow-sm border border-apple-border dark:border-apple-border-dark text-center">
        <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">總花費 (折合台幣)</h2>
        <div className="text-5xl font-bold tracking-tight text-apple-text dark:text-apple-text-dark">
          NT$ {Math.round(totalTwd).toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-apple-card dark:bg-apple-card-dark rounded-3xl p-5 shadow-sm border border-apple-border dark:border-apple-border-dark flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold mb-1">{expenses.length}</span>
          <span className="text-xs text-gray-500 font-medium">累積帳目</span>
        </div>
        <div className="bg-apple-card dark:bg-apple-card-dark rounded-3xl p-5 shadow-sm border border-apple-border dark:border-apple-border-dark flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold mb-1">{users.length}</span>
          <span className="text-xs text-gray-500 font-medium">參與成員</span>
        </div>
      </div>
    </div>
  );
}
