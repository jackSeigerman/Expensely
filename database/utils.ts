// Utility functions for working with transactions and dates

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getCurrentISODate = (): string => {
  return new Date().toISOString();
};

export const getDateRangeISO = (daysBack: number): { startDate: string; endDate: string } => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

// Common transaction categories
export const TRANSACTION_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Travel',
  'Income',
  'Other',
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

// Common currency symbols
export const CURRENCY_SYMBOLS = [
  '$',  // US Dollar
  '€',  // Euro
  '£',  // British Pound
  '¥',  // Japanese Yen
  '₹',  // Indian Rupee
  '₽',  // Russian Ruble
  'C$', // Canadian Dollar
  'A$', // Australian Dollar
  '¢',  // Cents
  '₩',  // South Korean Won
  '₪',  // Israeli New Shekel
  '₦',  // Nigerian Naira
  '₨',  // Pakistani Rupee
  '₫',  // Vietnamese Dong
  '₯',  // Greek Drachma
] as const;

export type CurrencySymbol = typeof CURRENCY_SYMBOLS[number];
