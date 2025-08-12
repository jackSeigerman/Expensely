import { db, Wallet } from './database';

export class WalletService {
  
  // Insert a new wallet
  static async createWallet(wallet: Omit<Wallet, 'WID'>): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO wallets (name, currency) VALUES (?, ?)`,
        [wallet.name, wallet.currency]
      );
      
      console.log('Wallet created with WID:', result.lastInsertRowId);
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  // Get all wallets
  static async getAllWallets(): Promise<Wallet[]> {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM wallets ORDER BY name ASC`
      );
      return result as Wallet[];
    } catch (error) {
      console.error('Error fetching all wallets:', error);
      throw error;
    }
  }

  // Get wallet by WID
  static async getWalletById(wid: number): Promise<Wallet | null> {
    try {
      const result = await db.getFirstAsync(
        `SELECT * FROM wallets WHERE WID = ?`,
        [wid]
      );
      return result as Wallet | null;
    } catch (error) {
      console.error('Error fetching wallet by ID:', error);
      throw error;
    }
  }

  // Get wallet by name
  static async getWalletByName(name: string): Promise<Wallet | null> {
    try {
      const result = await db.getFirstAsync(
        `SELECT * FROM wallets WHERE name = ?`,
        [name]
      );
      return result as Wallet | null;
    } catch (error) {
      console.error('Error fetching wallet by name:', error);
      throw error;
    }
  }

  // Update a wallet
  static async updateWallet(wid: number, updates: Partial<Omit<Wallet, 'WID'>>): Promise<boolean> {
    try {
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      const result = await db.runAsync(
        `UPDATE wallets SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE WID = ?`,
        [...values, wid]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw error;
    }
  }

  // Delete a wallet (only if no transactions exist)
  static async deleteWallet(wid: number): Promise<boolean> {
    try {
      // Check if wallet has transactions
      const transactionCount = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM transactions WHERE WID = ?`,
        [wid]
      );
      
      if ((transactionCount as any)?.count > 0) {
        throw new Error('Cannot delete wallet with existing transactions');
      }
      
      const result = await db.runAsync(
        `DELETE FROM wallets WHERE WID = ?`,
        [wid]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting wallet:', error);
      throw error;
    }
  }

  // Get wallet count
  static async getWalletCount(): Promise<number> {
    try {
      const result = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM wallets`
      );
      
      return (result as any)?.count || 0;
    } catch (error) {
      console.error('Error getting wallet count:', error);
      throw error;
    }
  }

  // Get wallets by currency
  static async getWalletsByCurrency(currency: string): Promise<Wallet[]> {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM wallets WHERE currency = ? ORDER BY name ASC`,
        [currency]
      );
      return result as Wallet[];
    } catch (error) {
      console.error('Error fetching wallets by currency:', error);
      throw error;
    }
  }

  // Get wallet with transaction summary
  static async getWalletWithSummary(wid: number): Promise<{
    wallet: Wallet | null;
    transactionCount: number;
    totalAmount: number;
  }> {
    try {
      const wallet = await this.getWalletById(wid);
      
      if (!wallet) {
        return {
          wallet: null,
          transactionCount: 0,
          totalAmount: 0
        };
      }

      const summary = await db.getFirstAsync(`
        SELECT 
          COUNT(*) as transactionCount,
          COALESCE(SUM(amount), 0) as totalAmount
        FROM transactions 
        WHERE WID = ?
      `, [wid]);

      return {
        wallet,
        transactionCount: (summary as any)?.transactionCount || 0,
        totalAmount: (summary as any)?.totalAmount || 0
      };
    } catch (error) {
      console.error('Error fetching wallet with summary:', error);
      throw error;
    }
  }

  // Check if wallet name exists (for validation)
  static async isWalletNameExists(name: string, excludeWid?: number): Promise<boolean> {
    try {
      let query = `SELECT COUNT(*) as count FROM wallets WHERE name = ?`;
      const params: any[] = [name];
      
      if (excludeWid) {
        query += ` AND WID != ?`;
        params.push(excludeWid);
      }
      
      const result = await db.getFirstAsync(query, params);
      return (result as any)?.count > 0;
    } catch (error) {
      console.error('Error checking wallet name existence:', error);
      throw error;
    }
  }
}
