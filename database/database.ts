import * as SQLite from 'expo-sqlite';

// Database configuration
const DATABASE_NAME = 'financeManager.db';

// Open database connection
export const db = SQLite.openDatabaseSync(DATABASE_NAME);

// Transaction interface
export interface Transaction {
  TID?: number; // Auto-increment primary key
  WID: number;  // Wallet ID
  amount: number; // Amount
  category: string; // cat
  description: string; // refrence
  date: string; // ISO date string
}

// Wallet interface
export interface Wallet {
  WID?: number; // Auto-increment primary key
  name: string; // Wallet name
  currency: string; // Currency symbol ($, €, £ ...)
}

// Expense Category interface
export interface ExpenseCategory {
  ECID?: number; // Auto-increment primary key
  name: string; // Category name
  description?: string; // Optional description
}

// Income Category interface
export interface IncomeCategory {
  ICID?: number; // Auto-increment primary key
  name: string; // Category name
  description?: string; // Optional description
}

// Initialize database and create tables
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Create wallets table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS wallets (
        WID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        currency TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create expense categories table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS expense_categories (
        ECID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create income categories table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS income_categories (
        ICID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create transactions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        TID INTEGER PRIMARY KEY AUTOINCREMENT,
        WID INTEGER NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (WID) REFERENCES wallets(WID)
      );
    `);

    // Create indexes for better query performance
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_wallets_name ON wallets(name);
      CREATE INDEX IF NOT EXISTS idx_expense_categories_name ON expense_categories(name);
      CREATE INDEX IF NOT EXISTS idx_income_categories_name ON income_categories(name);
      CREATE INDEX IF NOT EXISTS idx_transactions_wid ON transactions(WID);
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
    `);

    // Pre-populate expense categories
    await db.execAsync(`
      INSERT OR IGNORE INTO expense_categories (name, description) VALUES
      ('Food & Dining', 'Restaurants, groceries, coffee'),
      ('Shopping', 'Clothing, electronics, general purchases'),
      ('Transportation', 'Gas, public transport, car maintenance'),
      ('Bills & Utilities', 'Electricity, water, internet, phone'),
      ('Entertainment', 'Movies, games, hobbies'),
      ('Healthcare', 'Medical expenses, pharmacy, insurance'),
      ('Education', 'Books, courses, school fees'),
      ('Travel', 'Flights, hotels, vacation expenses'),
      ('Home & Garden', 'Furniture, repairs, gardening'),
      ('Personal Care', 'Haircut, cosmetics, spa'),
      ('Insurance', 'Life, health, car insurance'),
      ('Taxes', 'Income tax, property tax'),
      ('Gifts & Donations', 'Presents, charity'),
      ('Business', 'Office supplies, meetings'),
      ('Other Expenses', 'Miscellaneous expenses');
    `);

    // Pre-populate income categories
    await db.execAsync(`
      INSERT OR IGNORE INTO income_categories (name, description) VALUES
      ('Salary', 'Regular employment income'),
      ('Freelance', 'Contract and freelance work'),
      ('Business', 'Business revenue and profits'),
      ('Investment', 'Dividends, interest, capital gains'),
      ('Rental', 'Property rental income'),
      ('Bonus', 'Work bonuses and incentives'),
      ('Gift', 'Money received as gifts'),
      ('Refund', 'Tax refunds, purchase returns'),
      ('Side Hustle', 'Part-time work, gig economy'),
      ('Pension', 'Retirement income'),
      ('Government Benefits', 'Social security, unemployment'),
      ('Royalties', 'Book, music, patent royalties'),
      ('Other Income', 'Miscellaneous income sources');
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Check if database exists and has tables
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const walletTable = await db.getFirstAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='wallets';
    `);
    
    const transactionTable = await db.getFirstAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='transactions';
    `);

    const expenseCategoryTable = await db.getFirstAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='expense_categories';
    `);

    const incomeCategoryTable = await db.getFirstAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='income_categories';
    `);
    
    return walletTable !== null && transactionTable !== null && 
           expenseCategoryTable !== null && incomeCategoryTable !== null;
  } catch (error) {
    console.error('Error checking database health:', error);
    return false;
  }
};
