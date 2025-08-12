// =====================================
// LEGACY FUNCTIONS (for backward compatibility)
// =====================================

/**
 * @deprecated Use getCurrencyFormatted instead
 */
export const formatCurrency = (amount: number): string => {
  return getCurrencyFormatted(amount);
};

/**
 * @deprecated Use getDateFormatted instead
 */
export const formatDate = (dateString: string): string => {
  return getDateFormatted(dateString, 'short');
};

/**
 * @deprecated Use getDateFormatted with 'datetime' format instead
 */
export const formatDateTime = (dateString: string): string => {
  return getDateFormatted(dateString, 'datetime');
};

/**
 * @deprecated Use getCurrentDateISO instead
 */
export const getCurrentISODate = (): string => {
  return getCurrentDateISO();
};

// =====================================
// CLEAR GETTER FUNCTIONS
// =====================================

/**
 * Get formatted currency string from a number
 * @param amount - The amount to format
 * @param currency - Optional currency code (default: USD)
 * @param locale - Optional locale (default: en-US)
 * @returns Formatted currency string
 */
export const getCurrencyFormatted = (
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Get formatted date string from ISO date
 * @param dateString - ISO date string
 * @param format - 'short' | 'long' | 'datetime'
 * @returns Formatted date string
 */
export const getDateFormatted = (
  dateString: string, 
  format: 'short' | 'long' | 'datetime' = 'short'
): string => {
  const date = new Date(dateString);
  
  switch (format) {
    case 'long':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    case 'datetime':
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'short':
    default:
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
};

/**
 * Get current date as ISO string
 * @returns Current date in ISO format
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString();
};

/**
 * Get date range as ISO strings
 * @param daysBack - Number of days to go back from today
 * @returns Object with startDate and endDate as ISO strings
 */
export const getDateRangeISO = (daysBack: number): { startDate: string; endDate: string } => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

/**
 * Get available currency symbols
 * @returns Array of currency symbols
 */
export const getCurrencySymbols = (): readonly string[] => {
  return CURRENCY_SYMBOLS;
};

/**
 * Get currency symbol by code
 * @param currencyCode - Currency code (USD, EUR, GBP, etc.)
 * @returns Currency symbol or default '$'
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  const currencyMap: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'INR': '₹',
    'RUB': '₽',
    'CAD': 'C$',
    'AUD': 'A$',
    'KRW': '₩',
    'ILS': '₪',
    'NGN': '₦',
    'PKR': '₨',
    'VND': '₫',
  };
  
  return currencyMap[currencyCode.toUpperCase()] || '$';
};

// =====================================
// CLEAR SETTER FUNCTIONS  
// =====================================

/**
 * Set and validate transaction amount
 * @param amount - The amount to validate and format
 * @returns Validated and formatted amount
 * @throws Error if amount is invalid
 */
export const setTransactionAmount = (amount: string | number): number => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    throw new Error('Invalid amount: must be a valid number');
  }
  
  if (numAmount < 0) {
    throw new Error('Invalid amount: must be non-negative');
  }
  
  // Round to 2 decimal places
  return Math.round(numAmount * 100) / 100;
};

/**
 * Set and validate date string
 * @param date - Date as string, Date object, or ISO string
 * @returns Validated ISO date string
 * @throws Error if date is invalid
 */
export const setValidDate = (date: string | Date): string => {
  let dateObj: Date;
  
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  return dateObj.toISOString();
};

/**
 * Set and validate wallet name
 * @param name - Wallet name to validate
 * @returns Validated and trimmed wallet name
 * @throws Error if name is invalid
 */
export const setWalletName = (name: string): string => {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    throw new Error('Wallet name cannot be empty');
  }
  
  if (trimmedName.length < 2) {
    throw new Error('Wallet name must be at least 2 characters long');
  }
  
  if (trimmedName.length > 50) {
    throw new Error('Wallet name must be less than 50 characters');
  }
  
  return trimmedName;
};

/**
 * Set and validate currency symbol
 * @param currency - Currency symbol to validate
 * @returns Validated currency symbol
 * @throws Error if currency is invalid
 */
export const setCurrency = (currency: string): string => {
  const trimmedCurrency = currency.trim();
  
  if (!trimmedCurrency) {
    throw new Error('Currency cannot be empty');
  }
  
  if (!CURRENCY_SYMBOLS.includes(trimmedCurrency as any)) {
    throw new Error(`Invalid currency symbol. Must be one of: ${CURRENCY_SYMBOLS.join(', ')}`);
  }
  
  return trimmedCurrency;
};

/**
 * Set and validate category name
 * @param category - Category name to validate
 * @returns Validated and trimmed category name
 * @throws Error if category is invalid
 */
export const setCategoryName = (category: string): string => {
  const trimmedCategory = category.trim();
  
  if (!trimmedCategory) {
    throw new Error('Category name cannot be empty');
  }
  
  if (trimmedCategory.length < 2) {
    throw new Error('Category name must be at least 2 characters long');
  }
  
  if (trimmedCategory.length > 50) {
    throw new Error('Category name must be less than 50 characters');
  }
  
  return trimmedCategory;
};

/**
 * Set and validate transaction description
 * @param description - Description to validate
 * @returns Validated and trimmed description
 * @throws Error if description is invalid
 */
export const setTransactionDescription = (description: string): string => {
  const trimmedDescription = description.trim();
  
  if (trimmedDescription.length > 200) {
    throw new Error('Description must be less than 200 characters');
  }
  
  return trimmedDescription;
};

// =====================================
// DATA RETRIEVAL HELPER FUNCTIONS
// =====================================

/**
 * Get transaction type from amount (positive = income, negative = expense)
 * @param amount - Transaction amount
 * @returns 'income' | 'expense'
 */
export const getTransactionType = (amount: number): 'income' | 'expense' => {
  return amount >= 0 ? 'income' : 'expense';
};

/**
 * Get absolute amount (removes negative sign for expenses)
 * @param amount - Transaction amount
 * @returns Absolute value of amount
 */
export const getAbsoluteAmount = (amount: number): number => {
  return Math.abs(amount);
};

/**
 * Get month name from date string
 * @param dateString - ISO date string
 * @returns Month name (e.g., 'January', 'February')
 */
export const getMonthName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long' });
};

/**
 * Get year from date string
 * @param dateString - ISO date string
 * @returns Year as number
 */
export const getYear = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getFullYear();
};

/**
 * Get day of week from date string
 * @param dateString - ISO date string
 * @returns Day name (e.g., 'Monday', 'Tuesday')
 */
export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// =====================================
// DATA SETTING HELPER FUNCTIONS
// =====================================

/**
 * Set transaction amount with type (positive for income, negative for expense)
 * @param amount - The base amount (always positive)
 * @param type - 'income' | 'expense'
 * @returns Signed amount (positive for income, negative for expense)
 */
export const setTransactionAmountWithType = (amount: number, type: 'income' | 'expense'): number => {
  const validAmount = setTransactionAmount(amount);
  return type === 'expense' ? -Math.abs(validAmount) : Math.abs(validAmount);
};

/**
 * Set date to start of day (00:00:00)
 * @param date - Date as string or Date object
 * @returns ISO string of date at start of day
 */
export const setDateToStartOfDay = (date: string | Date): string => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj.toISOString();
};

/**
 * Set date to end of day (23:59:59)
 * @param date - Date as string or Date object
 * @returns ISO string of date at end of day
 */
export const setDateToEndOfDay = (date: string | Date): string => {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj.toISOString();
};

/**
 * Set wallet ID with validation
 * @param wid - Wallet ID to validate
 * @returns Validated wallet ID
 * @throws Error if wallet ID is invalid
 */
export const setWalletId = (wid: string | number): number => {
  const numWid = typeof wid === 'string' ? parseInt(wid, 10) : wid;
  
  if (isNaN(numWid) || numWid <= 0) {
    throw new Error('Invalid wallet ID: must be a positive number');
  }
  
  return numWid;
};

// =====================================
// VALIDATION HELPER FUNCTIONS
// =====================================

/**
 * Check if date is today
 * @param dateString - ISO date string to check
 * @returns true if date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.toDateString() === today.toDateString();
};

/**
 * Check if date is within last N days
 * @param dateString - ISO date string to check
 * @param days - Number of days to check
 * @returns true if date is within last N days
 */
export const isWithinLastDays = (dateString: string, days: number): boolean => {
  const date = new Date(dateString);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return date >= cutoffDate;
};

/**
 * Check if amount is valid for transactions
 * @param amount - Amount to validate
 * @returns true if amount is valid
 */
export const isValidAmount = (amount: number): boolean => {
  return !isNaN(amount) && isFinite(amount);
};

/**
 * Check if string is a valid ISO date
 * @param dateString - String to validate
 * @returns true if string is valid ISO date
 */
export const isValidISODate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString();
};

// =====================================
// LEGACY CONSTANTS (for backward compatibility)
// =====================================

// Common transaction categories (deprecated - use database categories instead)
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
