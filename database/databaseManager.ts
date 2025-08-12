import { initializeDatabase, checkDatabaseHealth } from './database';
import { TransactionService } from './transactionService';
import { WalletService } from './walletService';
import { CategoryService } from './categoryService';

export class DatabaseManager {
  private static initialized = false;

  // Initialize the database (call this when app starts)
  static async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('Database already initialized');
      return;
    }

    try {
      console.log('Initializing database...');
      await initializeDatabase();
      
      // Verify database health
      const isHealthy = await checkDatabaseHealth();
      if (!isHealthy) {
        throw new Error('Database health check failed');
      }

      this.initialized = true;
      console.log('Database initialization completed successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // Check if database is ready
  static isInitialized(): boolean {
    return this.initialized;
  }

  // Get transaction service
  static getTransactionService(): typeof TransactionService {
    if (!this.initialized) {
      throw new Error('Database not initialized. Call DatabaseManager.initialize() first.');
    }
    return TransactionService;
  }

  // Get wallet service
  static getWalletService(): typeof WalletService {
    if (!this.initialized) {
      throw new Error('Database not initialized. Call DatabaseManager.initialize() first.');
    }
    return WalletService;
  }

  // Get category service
  static getCategoryService(): typeof CategoryService {
    if (!this.initialized) {
      throw new Error('Database not initialized. Call DatabaseManager.initialize() first.');
    }
    return CategoryService;
  }

  // Test database with sample data
  static async testDatabase(): Promise<void> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log('Testing database operations...');

      // Create test wallets
      const testWallet1 = {
        name: 'Main Wallet',
        currency: '$'
      };

      const testWallet2 = {
        name: 'Euro Account',
        currency: '€'
      };

      const wid1 = await WalletService.createWallet(testWallet1);
      const wid2 = await WalletService.createWallet(testWallet2);
      console.log('Created test wallets with WIDs:', wid1, wid2);

      // Create a test transaction
      const testTransaction = {
        WID: wid1,
        amount: 100.50,
        category: 'Food',
        description: 'Grocery shopping',
        date: new Date().toISOString()
      };

      const tid = await TransactionService.createTransaction(testTransaction);
      console.log('Created test transaction with TID:', tid);

      // Fetch the created transaction
      const retrieved = await TransactionService.getTransactionById(tid);
      console.log('Retrieved transaction:', retrieved);

      // Get all wallets
      const allWallets = await WalletService.getAllWallets();
      console.log('Total wallets in database:', allWallets.length);

      // Get wallet with summary
      const walletSummary = await WalletService.getWalletWithSummary(wid1);
      console.log('Wallet summary:', walletSummary);

      // Get all transactions
      const allTransactions = await TransactionService.getAllTransactions();
      console.log('Total transactions in database:', allTransactions.length);

      // Update the transaction
      const updated = await TransactionService.updateTransaction(tid, { 
        description: 'Updated grocery shopping' 
      });
      console.log('Transaction updated:', updated);

      // Get transaction count
      const count = await TransactionService.getTransactionCount();
      console.log('Transaction count:', count);

      console.log('Database test completed successfully!');
    } catch (error) {
      console.error('Database test failed:', error);
      throw error;
    }
  }
}
