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







//create transaction

const createTransaction = async (req, res) => {
    const connection = await db.getConnection(); // Get a transactional connection
    try {
        const { AccountID, Amount, PIN, CardType } = req.body;

        // Validate input
        if (!AccountID || Amount === undefined || Amount <= 0 || !CardType) {
            return res.status(400).send({
                success: false,
                message: 'Valid AccountID, Amount, and CardType are required.',
            });
        }

        await connection.beginTransaction(); // Start the transaction

        // Step 1: Verify the account and get balance from Accounts table
        const [accountData] = await connection.query(
            'SELECT a.*, ac.CardID, ac.CardType, ac.PIN FROM Accounts a LEFT JOIN Account_Cards ac ON a.AccountID = ac.AccountID WHERE a.AccountID = ?',
            [AccountID]
        );

        if (!accountData || accountData.length === 0) {
            throw new Error(`Account with AccountID ${AccountID} not found.`);
        }

        const account = accountData[0];

        // Step 2: Check if Account has the CardType (Debit or Credit)
        const selectedCard = accountData.find(card => card.CardType.toLowerCase() === CardType.toLowerCase());

        if (!selectedCard) {
            throw new Error(`Account does not have a ${CardType} card.`);
        }

        // Step 3: Verify the PIN
        if (account.PIN !== PIN) {
            throw new Error('Invalid PIN');
        }

        const currentBalance = account.Balance;  // Get the balance from the Accounts table

        // Step 4: Check for insufficient balance
        if (currentBalance < Amount) {
            throw new Error('Insufficient balance to complete the transaction');
        }

        // Step 5: Deduct the balance from the Accounts table
        const newBalance = currentBalance - Amount;
        await connection.query('UPDATE Accounts SET Balance = ? WHERE AccountID = ?', [newBalance, AccountID]);

        // Step 6: Insert the transaction into the Transactions table
        const [transactionResult] = await connection.query(
            'INSERT INTO Transactions (AccountID, TransactionType, Amount, TransactionDate) VALUES (?, ?, ?, SYSDATE())',
            [AccountID, 'Debit', Amount]
        );

        // Step 7: Fetch the newly inserted transaction details
        const [transactionDetails] = await connection.query(
            'SELECT * FROM Transactions WHERE TransactionID = ?',
            [transactionResult.insertId]
        );

        // Commit the transaction
        await connection.commit();

        // Return success response
        res.status(201).send({
            success: true,
            message: 'Transaction completed successfully',
            transaction: transactionDetails[0],
            newBalance,
        });
    } catch (error) {
        // Rollback the transaction in case of an error
        await connection.rollback(); // This undoes all changes made during the transaction
        console.error('Error in creating transaction:', error);
        res.status(500).send({
            success: false,
            message: error.message || 'Error in creating transaction',
        });
    } finally {
        // Release the connection back to the pool
        connection.release();
    }
};




module.exports = {
    getAllTransactions,
    getTransactionsByAccountID,createTransaction
    
};