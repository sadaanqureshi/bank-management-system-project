const db = require("../config/db");

// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM Transactions');
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No transactions found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'All Transactions Records',
            totalTransactions: data.length,
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching transactions',
            error,
        });
    }
};


// Get transactions by AccountID
const getTransactionsByAccountID = async (req, res) => {
    try {
        const accountID = req.params.accountID;

        if (!accountID) {
            return res.status(400).send({
                success: false,
                message: 'Invalid Account ID',
            });
        }

        // Check if there are any transactions for the given AccountID
        const [data] = await db.query('SELECT * FROM Transactions WHERE AccountID = ?', [accountID]);

        if (!data || data.length === 0) {
            // AccountID doesn't have any transactions, but let's also check if the AccountID exists in the Accounts table
            const [accountCheck] = await db.query('SELECT * FROM Accounts WHERE AccountID = ?', [accountID]);

            if (!accountCheck || accountCheck.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: `Account ID ${accountID} does not exist`,
                });
            }

            return res.status(404).send({
                success: false,
                message: `No transactions found for Account ID ${accountID}`,
            });
        }

        res.status(200).send({
            success: true,
            message: `Transactions for Account ID ${accountID}`,
            data,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching transactions by Account ID',
            error,
        });
    }
};









// create Transaction
const createTransaction = async (req, res) => {
    try {
        const { AccountID, Amount } = req.body; // Transaction details
        const TransactionType = 'Debit'; // Assuming this is a debit transaction

        // Validate input
        if (!AccountID || Amount === undefined || Amount <= 0) {
            return res.status(400).send({
                success: false,
                message: 'Valid AccountID and positive Amount are required',
            });
        }

        // Step 1: Verify the account
        const [accountData] = await db.query('SELECT * FROM Accounts WHERE AccountID = ?', [AccountID]);
        if (!accountData || accountData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Account with AccountID ${AccountID} not found`,
            });
        }

        const currentBalance = accountData[0].Balance;

        // Step 2: Check for insufficient balance
        if (currentBalance < Amount) {
            return res.status(400).send({
                success: false,
                message: 'Insufficient balance to complete the transaction',
                currentBalance,
            });
        }

        // Step 3: Deduct the balance
        const newBalance = currentBalance - Amount;
        await db.query('UPDATE Accounts SET Balance = ? WHERE AccountID = ?', [newBalance, AccountID]);

        // Step 4: Insert the transaction into the Transactions table with SYSDATE
        const [transactionResult] = await db.query(
            'INSERT INTO Transactions (AccountID, TransactionType, Amount, TransactionDate) VALUES (?, ?, ?, SYSDATE())',
            [AccountID, TransactionType, Amount]
        );

        // Step 5: Fetch the newly inserted transaction details
        const [transactionDetails] = await db.query('SELECT * FROM Transactions WHERE TransactionID = ?', [transactionResult.insertId]);

        // Return success response
        res.status(201).send({
            success: true,
            message: 'Transaction completed successfully',
            // transactionID: transactionResult.insertId,
            // AccountID,
            // TransactionType,
            // Amount,
            // newBalance,
            transaction: transactionDetails[0],
            newBalance
        });
    } catch (error) {
        console.error('Error in creating transaction:', error);
        res.status(500).send({
            success: false,
            message: 'Error in creating transaction',
            error,
        });
    }
};


module.exports = {
    getAllTransactions,
    getTransactionsByAccountID,createTransaction
    
};