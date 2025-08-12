# Expensely

Expensely helps you track your finances. Set budgets, see your spending history, and more. Managing your finances never looked so good.


Now available on the [iOS App Store](http://apps.apple.com/us/app/expensely/id6747648173) 🎉

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. For testing:
   press `i` for ios sim (on mac) or `w` for web local host

## DB

Getter:
   * getCurrencyFormatted() - Format amounts with currency
   * getDateFormatted() - Format dates in different styles
   * getCurrentDateISO() - Get current date as ISO string
   * getDateRangeISO() - Get date ranges
   * getCurrencySymbols() - Get all available currency symbols
   * getCurrencySymbol() - Get specific currency symbol by code
   * getTransactionType() - Determine if amount is income or expense
   * getAbsoluteAmount() - Get absolute value of amounts
   * getMonthName(), getYear(), getDayOfWeek() - Extract date components

Setter:

   * setTransactionAmount() - Validate and format transaction amounts
   * setValidDate() - Validate and format dates
   * setWalletName() - Validate wallet names
   * setCurrency() - Validate currency symbols
   * setCategoryName() - Validate category names
   * setTransactionDescription() - Validate descriptions
   * setTransactionAmountWithType() - Set amounts with income/expense type
   * setDateToStartOfDay() / setDateToEndOfDay() - Date boundary helpers
   * setWalletId() - Validate wallet IDs

Helper:

* isToday() - Check if date is today
* isWithinLastDays() - Check date ranges
* isValidAmount() - Validate amounts
* isValidISODate() - Validate ISO date strings
     
## Locations

the main page is at `/app/index.tsx` and the components are in `/components` dont touch the ios folder


## Dont do this, this is for me


### IOS

```bash
Eas build
```
      
```bash
Eas submit
```

### Web

```bash
npx expo export --platform web
```

```bash
Eas deploy
```
h