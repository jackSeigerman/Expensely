import { db, ExpenseCategory, IncomeCategory } from './database';

export class CategoryService {
  
  // Get all expense categories
  static async getAllExpenseCategories(): Promise<ExpenseCategory[]> {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM expense_categories ORDER BY name ASC`
      );
      return result as ExpenseCategory[];
    } catch (error) {
      console.error('Error fetching expense categories:', error);
      throw error;
    }
  }

  // Get expense category by ID
  static async getExpenseCategoryById(ecid: number): Promise<ExpenseCategory | null> {
    try {
      const result = await db.getFirstAsync(
        `SELECT * FROM expense_categories WHERE ECID = ?`,
        [ecid]
      );
      return result as ExpenseCategory | null;
    } catch (error) {
      console.error('Error fetching expense category by ID:', error);
      throw error;
    }
  }

  // Create new expense category
  static async createExpenseCategory(category: Omit<ExpenseCategory, 'ECID'>): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO expense_categories (name, description) VALUES (?, ?)`,
        [category.name, category.description || null]
      );
      
      console.log('Expense category created with ECID:', result.lastInsertRowId);
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating expense category:', error);
      throw error;
    }
  }

  // Update expense category
  static async updateExpenseCategory(ecid: number, updates: Partial<Omit<ExpenseCategory, 'ECID'>>): Promise<boolean> {
    try {
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      const result = await db.runAsync(
        `UPDATE expense_categories SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE ECID = ?`,
        [...values, ecid]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating expense category:', error);
      throw error;
    }
  }

  // Delete expense category
  static async deleteExpenseCategory(ecid: number): Promise<boolean> {
    try {
      const result = await db.runAsync(
        `DELETE FROM expense_categories WHERE ECID = ?`,
        [ecid]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting expense category:', error);
      throw error;
    }
  }

  
  // Get all income categories
  static async getAllIncomeCategories(): Promise<IncomeCategory[]> {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM income_categories ORDER BY name ASC`
      );
      return result as IncomeCategory[];
    } catch (error) {
      console.error('Error fetching income categories:', error);
      throw error;
    }
  }

  // Get income category by ID
  static async getIncomeCategoryById(icid: number): Promise<IncomeCategory | null> {
    try {
      const result = await db.getFirstAsync(
        `SELECT * FROM income_categories WHERE ICID = ?`,
        [icid]
      );
      return result as IncomeCategory | null;
    } catch (error) {
      console.error('Error fetching income category by ID:', error);
      throw error;
    }
  }

  // Create new income category
  static async createIncomeCategory(category: Omit<IncomeCategory, 'ICID'>): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO income_categories (name, description) VALUES (?, ?)`,
        [category.name, category.description || null]
      );
      
      console.log('Income category created with ICID:', result.lastInsertRowId);
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating income category:', error);
      throw error;
    }
  }

  // Update income category
  static async updateIncomeCategory(icid: number, updates: Partial<Omit<IncomeCategory, 'ICID'>>): Promise<boolean> {
    try {
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      const result = await db.runAsync(
        `UPDATE income_categories SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE ICID = ?`,
        [...values, icid]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating income category:', error);
      throw error;
    }
  }

  // Delete income category
  static async deleteIncomeCategory(icid: number): Promise<boolean> {
    try {
      const result = await db.runAsync(
        `DELETE FROM income_categories WHERE ICID = ?`,
        [icid]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting income category:', error);
      throw error;
    }
  }


  // Get category count
  static async getCategoryCount(): Promise<{ expenseCount: number; incomeCount: number }> {
    try {
      const expenseResult = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM expense_categories`
      );
      
      const incomeResult = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM income_categories`
      );
      
      return {
        expenseCount: (expenseResult as any)?.count || 0,
        incomeCount: (incomeResult as any)?.count || 0
      };
    } catch (error) {
      console.error('Error getting category count:', error);
      throw error;
    }
  }

  // Check if expense category name exists
  static async isExpenseCategoryNameExists(name: string, excludeEcid?: number): Promise<boolean> {
    try {
      let query = `SELECT COUNT(*) as count FROM expense_categories WHERE name = ?`;
      const params: any[] = [name];
      
      if (excludeEcid) {
        query += ` AND ECID != ?`;
        params.push(excludeEcid);
      }
      
      const result = await db.getFirstAsync(query, params);
      return (result as any)?.count > 0;
    } catch (error) {
      console.error('Error checking expense category name existence:', error);
      throw error;
    }
  }

  // Check if income category name exists
  static async isIncomeCategoryNameExists(name: string, excludeIcid?: number): Promise<boolean> {
    try {
      let query = `SELECT COUNT(*) as count FROM income_categories WHERE name = ?`;
      const params: any[] = [name];
      
      if (excludeIcid) {
        query += ` AND ICID != ?`;
        params.push(excludeIcid);
      }
      
      const result = await db.getFirstAsync(query, params);
      return (result as any)?.count > 0;
    } catch (error) {
      console.error('Error checking income category name existence:', error);
      throw error;
    }
  }
}
