// Main exports for database functionality
export { db, initializeDatabase, checkDatabaseHealth } from './database';
export { TransactionService } from './transactionService';
export { WalletService } from './walletService';
export { CategoryService } from './categoryService';
export { DatabaseManager } from './databaseManager';
export * from './utils';

// Type exports
export type { Transaction, Wallet, ExpenseCategory, IncomeCategory } from './database';
