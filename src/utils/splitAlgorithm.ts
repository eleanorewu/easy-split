import type { User, Expense } from '../types';

export interface Transaction {
  from: string; // User ID
  to: string; // User ID
  amountTWD: number;
}

export function calculateSplits(users: User[], expenses: Expense[]): Transaction[] {
  const balances: Record<string, number> = {};

  // Initialize balances for all users
  users.forEach(u => {
    balances[u.id] = 0;
  });

  // Calculate net balances based on expenses
  expenses.forEach(exp => {
    // Convert to TWD for unified calculation
    const amountTWD = exp.currency === 'JPY' ? exp.amount * exp.exchangeRate : exp.amount;
    
    // Payer's balance goes up
    if (balances[exp.paidBy] !== undefined) {
      balances[exp.paidBy] += amountTWD;
    }

    const validSplitAmong = exp.splitAmong.filter(id => balances[id] !== undefined);
    if (validSplitAmong.length === 0) return;

    const share = amountTWD / validSplitAmong.length;
    
    // Splitters' balances go down (they owe money)
    validSplitAmong.forEach(id => {
      balances[id] -= share;
    });
  });

  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  Object.entries(balances).forEach(([id, balance]) => {
    if (balance < -0.01) { // Floating point tolerance
      debtors.push({ id, amount: -balance });
    } else if (balance > 0.01) {
      creditors.push({ id, amount: balance });
    }
  });

  // Sort descending for greedy optimization (largest debt matches largest credit)
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions: Transaction[] = [];

  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];

    const amount = Math.min(debtor.amount, creditor.amount);

    transactions.push({
      from: debtor.id,
      to: creditor.id,
      amountTWD: Number(amount.toFixed(2)), // Keep 2 decimal places
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (Math.abs(debtor.amount) < 0.01) d++;
    if (Math.abs(creditor.amount) < 0.01) c++;
  }

  return transactions;
}
