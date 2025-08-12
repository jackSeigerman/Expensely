import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { DatabaseManager, TransactionService, WalletService, Transaction, Wallet } from '../database';

export default function App() {
    const [dbInitialized, setDbInitialized] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [walletName, setWalletName] = useState('');
    const [walletCurrency, setWalletCurrency] = useState('');
    
    const [selectedWalletId, setSelectedWalletId] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionCategory, setTransactionCategory] = useState('');
    const [transactionDescription, setTransactionDescription] = useState('');

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            setLoading(true);
            await DatabaseManager.initialize();
            setDbInitialized(true);
            await loadTransactions();
            await loadWallets();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            Alert.alert('Error', 'Failed to initialize database');
        } finally {
            setLoading(false);
        }
    };

    const loadTransactions = async () => {
        try {
            const allTransactions = await TransactionService.getAllTransactions();
            setTransactions(allTransactions);
        } catch (error) {
            console.error('Failed to load transactions:', error);
        }
    };

    const loadWallets = async () => {
        try {
            const allWallets = await WalletService.getAllWallets();
            setWallets(allWallets);
        } catch (error) {
            console.error('Failed to load wallets:', error);
        }
    };

    const addWallet = async () => {
        try {
            if (!walletName.trim() || !walletCurrency.trim()) {
                Alert.alert('Error', 'Please fill in all wallet fields');
                return;
            }

            const newWallet = {
                name: walletName.trim(),
                currency: walletCurrency.trim()
            };

            await WalletService.createWallet(newWallet);
            await loadWallets();
            
            setWalletName('');
            setWalletCurrency('');
            
            Alert.alert('Success', 'Wallet added successfully!');
        } catch (error) {
            console.error('Failed to add wallet:', error);
            Alert.alert('Error', 'Failed to add wallet');
        }
    };

    const addTransaction = async () => {
        try {
            if (!selectedWalletId || !transactionAmount.trim() || !transactionCategory.trim()) {
                Alert.alert('Error', 'Please fill in all required transaction fields');
                return;
            }

            const amount = parseFloat(transactionAmount);
            if (isNaN(amount)) {
                Alert.alert('Error', 'Please enter a valid amount');
                return;
            }

            const newTransaction = {
                WID: parseInt(selectedWalletId),
                amount: amount,
                category: transactionCategory.trim(),
                description: transactionDescription.trim() || '',
                date: new Date().toISOString()
            };

            await TransactionService.createTransaction(newTransaction);
            await loadTransactions();
            
            setSelectedWalletId('');
            setTransactionAmount('');
            setTransactionCategory('');
            setTransactionDescription('');
            
            Alert.alert('Success', 'Transaction added successfully!');
        } catch (error) {
            console.error('Failed to add transaction:', error);
            Alert.alert('Error', 'Failed to add transaction');
        }
    };

    const clearAllData = async () => {
        try {
            for (const transaction of transactions) {
                if (transaction.TID) {
                    await TransactionService.deleteTransaction(transaction.TID);
                }
            }
            
            for (const wallet of wallets) {
                if (wallet.WID) {
                    await WalletService.deleteWallet(wallet.WID);
                }
            }
            
            await loadTransactions();
            await loadWallets();
            Alert.alert('Success', 'All data cleared!');
        } catch (error) {
            console.error('Failed to clear data:', error);
            Alert.alert('Error', 'Failed to clear data');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Initializing Database...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SQLite Database Test</Text>
            <Text style={styles.status}>
                Database Status: {dbInitialized ? 'Ready' : 'Not Ready'}
            </Text>
            
            <View style={styles.formSection}>
                <Text style={styles.formTitle}>Add Wallet</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Wallet Name"
                    value={walletName}
                    onChangeText={setWalletName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Currency Symbol (e.g., $, €, £)"
                    value={walletCurrency}
                    onChangeText={setWalletCurrency}
                />
                <TouchableOpacity style={styles.button} onPress={addWallet}>
                    <Text style={styles.buttonText}>Add Wallet</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
                <Text style={styles.formTitle}>Add Transaction</Text>
                <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Select Wallet:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.walletPicker}>
                        {wallets.map((wallet) => (
                            <TouchableOpacity
                                key={wallet.WID}
                                style={[
                                    styles.walletOption,
                                    selectedWalletId === wallet.WID?.toString() && styles.selectedWalletOption
                                ]}
                                onPress={() => setSelectedWalletId(wallet.WID?.toString() || '')}
                            >
                                <Text style={[
                                    styles.walletOptionText,
                                    selectedWalletId === wallet.WID?.toString() && styles.selectedWalletOptionText
                                ]}>
                                    {wallet.name} ({wallet.currency})
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    value={transactionAmount}
                    onChangeText={setTransactionAmount}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Category (e.g., Food, Transport)"
                    value={transactionCategory}
                    onChangeText={setTransactionCategory}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description (optional)"
                    value={transactionDescription}
                    onChangeText={setTransactionDescription}
                />
                <TouchableOpacity 
                    style={[styles.button, wallets.length === 0 && styles.disabledButton]} 
                    onPress={addTransaction}
                    disabled={wallets.length === 0}
                >
                    <Text style={styles.buttonText}>Add Transaction</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { loadTransactions(); loadWallets(); }}>
                    <Text style={styles.buttonText}>Refresh Data</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearAllData}>
                    <Text style={styles.buttonText}>Clear All Data</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>Wallets ({wallets.length}):</Text>
            
            <ScrollView style={styles.listContainer}>
                {wallets.map((wallet) => (
                    <View key={wallet.WID} style={styles.walletItem}>
                        <Text style={styles.walletTitle}>
                            {wallet.name} ({wallet.currency})
                        </Text>
                        <Text style={styles.walletDetail}>
                            WID: {wallet.WID}
                        </Text>
                    </View>
                ))}
                
                {wallets.length === 0 && (
                    <Text style={styles.emptyText}>No wallets found. Add some to get started!</Text>
                )}
            </ScrollView>

            <Text style={styles.subtitle}>Transactions ({transactions.length}):</Text>
            
            <ScrollView style={styles.listContainer}>
                {transactions.map((transaction) => {
                    const wallet = wallets.find(w => w.WID === transaction.WID);
                    return (
                        <View key={transaction.TID} style={styles.transactionItem}>
                            <Text style={styles.transactionTitle}>
                                TID: {transaction.TID} | {wallet ? `${wallet.name} (${wallet.currency})` : `WID: ${transaction.WID}`}
                            </Text>
                            <Text style={styles.transactionDetail}>
                                Amount: {wallet?.currency || '$'}{transaction.amount.toFixed(2)}
                            </Text>
                            <Text style={styles.transactionDetail}>
                                Category: {transaction.category}
                            </Text>
                            <Text style={styles.transactionDetail}>
                                Description: {transaction.description}
                            </Text>
                            <Text style={styles.transactionDetail}>
                                Date: {new Date(transaction.date).toLocaleDateString()}
                            </Text>
                        </View>
                    );
                })}
                
                {transactions.length === 0 && (
                    <Text style={styles.emptyText}>No transactions found. Add some to get started!</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    status: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    formSection: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        marginBottom: 10,
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    walletPicker: {
        marginBottom: 10,
    },
    walletOption: {
        backgroundColor: '#e9ecef',
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedWalletOption: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    walletOptionText: {
        fontSize: 14,
        color: '#333',
    },
    selectedWalletOptionText: {
        color: '#fff',
    },
    buttonContainer: {
        gap: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    dangerButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    listContainer: {
        maxHeight: 150,
        marginBottom: 20,
    },
    walletItem: {
        backgroundColor: '#e8f4fd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    walletTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#007AFF',
    },
    walletDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    transactionItem: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    transactionDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
