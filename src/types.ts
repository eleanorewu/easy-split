export type Currency = 'TWD' | 'JPY';

export type Avatar =
  | { kind: 'emoji'; emoji: string }
  | { kind: 'icon'; icon: string }
  | { kind: 'image'; dataUrl: string };

export interface Ledger {
  id: string;
  name: string;
  createdAt: number;
  avatar?: Avatar;
  isCloud?: boolean;
}

export interface User {
  id: string;
  ledgerId: string;
  name: string;
  avatar?: Avatar;
}

export interface Expense {
  id: string;
  ledgerId: string;
  title: string;
  amount: number;
  currency: Currency;
  exchangeRate: number; // Using JPY -> TWD rate. e.g. 0.21. If TWD, rate is 1.
  paidBy: string; // User ID who paid
  splitAmong: string[]; // User IDs who are involved in the split (including the payer if they are part of it)
  date: number; // timestamp
}
