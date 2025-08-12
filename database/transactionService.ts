import { db, Transaction } from './database';

export class TransactionService {
  
  // Insert a new transaction
  static async createTransaction(transaction: Omit<Transaction, 'TID'>): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO transactions (WID, amount, category, description, date) 
         VALUES (?, ?, ?, ?, ?)`,
        [transaction.WID, transaction.amount, transaction.category, transaction.description, transaction.date]
      );
      
      console.log('Transaction created with TID:', result.lastInsertRowId);
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Get all transactions
  static async getAllTransactions(): Promise<Transaction[]> {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM transactions ORDER BY date DESC`
      );
      return result as Transaction[];
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      throw error;
    }
  }

  // Get transactions by wallet ID
  static async getTransactionsByWallet(walletId: number): Promise<Transaction[]> {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM transactions WHERE WID = ? ORDER BY date DESC`,
        [walletId]
      );
      return result as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions by wallet:', error);
      throw error;
    }
  }

  // Get transaction by TID
  static async getTransactionById(tid: number): Promise<Transaction | null> {
    try {
      const result = await db.getFirstAsync(
        `SELECT * FROM transactions WHERE TID = ?`,
        [tid]
      );
      return result as Transaction | null;
    } catch (error) {
      console.error('Error fetching transaction by ID:', error);
      throw error;
    }
  }

  // Update a transaction
  static async updateTransaction(tid: number, updates: Partial<Omit<Transaction, 'TID'>>): Promise<boolean> {
    try {
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      const result = await db.runAsync(
        `UPDATE transactions SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE TID = ?`,
        [...values, tid]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  // Delete a transaction
  static async deleteTransaction(tid: number): Promise<boolean> {
    try {
      const result = await db.runAsync(
        `DELETE FROM transactions WHERE TID = ?`,
        [tid]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Get transactions by category
  static async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM transactions WHERE category = ? ORDER BY date DESC`,
        [category]
      );
      return result as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions by category:', error);
      throw error;
    }
  }

  // Get transactions within date range
  static async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM transactions WHERE date BETWEEN ? AND ? ORDER BY date DESC`,
        [startDate, endDate]
      );
      return result as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
  }

  // Get total amount by wallet
  static async getTotalAmountByWallet(walletId: number): Promise<number> {
    try {
      const result = await db.getFirstAsync(
        `SELECT SUM(amount) as total FROM transactions WHERE WID = ?`,
        [walletId]
      );
      
      return (result as any)?.total || 0;
    } catch (error) {
      console.error('Error calculating total amount by wallet:', error);
      throw error;
    }
  }

  // Get transaction count
  static async getTransactionCount(): Promise<number> {
    try {
      const result = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM transactions`
      );
      
      return (result as any)?.count || 0;
    } catch (error) {
      console.error('Error getting transaction count:', error);
      throw error;
    }
  }
}
