const db = require("../config/db");

// Get All Accounts
const getAccounts = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM Accounts');
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No records found for accounts',
            });
        }

        res.status(200).send({
            success: true,
            message: 'All Accounts Records',
            totalAccounts: data.length,
            data,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Accounts API',
            error,
        });
    }
};

// Get Account by ID
const getAccountByID = async (req, res) => {
    try {
        const accountID = req.params.id;
        if (!accountID) {
            return res.status(404).send({
                success: false,
                message: 'Invalid Account ID',
            });
        }

        const [data] = await db.query('SELECT * FROM Accounts WHERE AccountID = ?', [accountID]);

        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No records found for this Account ID',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Account Records',
            data,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Account by ID API',
            error,
        });
    }
};

// Create Account
const createAccount = async (req, res) => {
    try {
        const { CustomerID, AccountType } = req.body;

        // Validate required fields
        if (!CustomerID || !AccountType) {
            return res.status(400).send({
                success: false,
                message: "All fields are required: CustomerID, AccountType",
            });
        }

        // Check if CustomerID exists in the Customers table
        const [customer] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);
        if (!customer || customer.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Customer with ID ${CustomerID} does not exist.`,
            });
        }

        // Check if the customer already has an account (if account already exists)
        const [existingAccount] = await db.query('SELECT * FROM Accounts WHERE CustomerID = ?', [CustomerID]);
        if (existingAccount && existingAccount.length > 0) {
            return res.status(400).send({
                success: false,
                message: `Customer with ID ${CustomerID} already has an account.`,
            });
        }

        // Insert a new account with the provided AccountType and default balance 0
        const [result] = await db.query(
            'INSERT INTO Accounts (CustomerID, AccountType, Balance) VALUES (?, ?, ?)',
            [CustomerID, AccountType, 0]  // Default balance set to 0
        );

        // Fetch the newly created account details
        const [accountDetails] = await db.query(
            `SELECT c.*, a.AccountID, a.AccountType, a.Balance 
             FROM Customers c 
             JOIN Accounts a ON c.CustomerID = a.CustomerID 
             WHERE a.AccountID = ?`,
            [result.insertId]
        );

        // Respond with combined customer and account details
        res.status(201).send({
            success: true,
            message: "Account created successfully!",
            customerAndAccountDetails: accountDetails[0],  // Return customer and account details
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in Create Account API',
            error: error.message || error,
        });
    }
};


// Update Account
const updateAccount = async (req, res) => {
    try {
        const accountID = req.params.id;
        const { CustomerID, AccountType, Balance } = req.body;

        if (!accountID) {
            return res.status(400).send({
                success: false,
                message: "AccountID is required in the URL",
            });
        }

        // Check if CustomerID exists (only if it's being updated)
        if (CustomerID) {
            const [customer] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);
            if (!customer || customer.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: `CustomerID ${CustomerID} does not exist`,
                });
            }
        }

        if (!CustomerID && !AccountType && Balance === undefined) {
            return res.status(400).send({
                success: false,
                message: "At least one field (CustomerID, AccountType, or Balance) must be provided to update",
            });
        }

        let query = "UPDATE Accounts SET ";
        const fields = [];
        const values = [];

        if (CustomerID) {
            fields.push("CustomerID = ?");
            values.push(CustomerID);
        }

        if (AccountType) {
            fields.push("AccountType = ?");
            values.push(AccountType);
        }

        if (Balance !== undefined) {
            fields.push("Balance = ?");
            values.push(Balance);
        }

        query += fields.join(", ") + " WHERE AccountID = ?";
        values.push(accountID);

        const result = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: `No account found with AccountID ${accountID}`,
            });
        }

        res.status(200).send({
            success: true,
            message: `Account with AccountID ${accountID} updated successfully`,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            success: false,
            message: "Error in Update Account API",
            error,
        });
    }
};


// Delete Account
const deleteAccount = async (req, res) => {
    try {
        const accountID = req.params.id;

        if (!accountID) {
            return res.status(404).send({
                success: false,
                message: "Invalid Account ID",
            });
        }

        // Step 1: Get account details
        const [account] = await db.query('SELECT * FROM Accounts WHERE AccountID = ?', [accountID]);
        if (!account || account.length === 0) {
            return res.status(404).send({
                success: false,
                message: `AccountID ${accountID} does not exist`,
            });
        }

        const customerID = account[0].CustomerID;

        // Step 2: Delete the account
        const result = await db.query('DELETE FROM Accounts WHERE AccountID = ?', [accountID]);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: `No account found with AccountID ${accountID}`,
            });
        }

        // Step 3: Check if the customer has any remaining accounts
        const [customerAccounts] = await db.query('SELECT * FROM Accounts WHERE CustomerID = ?', [customerID]);

        // Step 4: If no accounts remain for the customer, delete the customer
        if (customerAccounts.length === 0) {
            await db.query('DELETE FROM Customers WHERE CustomerID = ?', [customerID]);
            res.status(200).send({
                success: true,
                message: "Account and Customer Deleted Successfully",
            });
    
        }else{
            res.status(200).send({
                success: true,
                message: "Account Deleted Successfully",
            });
        }

      
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Account API",
            error,
        });
    }
};

// Get Account Details for Customer Dashboard
const getAccountDetailsForCustomer = async (req, res) => {
    try {
        const customerID = req.params.customerID;

        // Validate CustomerID
        if (!customerID) {
            return res.status(400).send({
                success: false,
                message: "CustomerID is required",
            });
        }

        // Fetch account details for the given CustomerID
        const [accounts] = await db.query('SELECT * FROM Accounts WHERE CustomerID = ?', [customerID]);

        if (!accounts || accounts.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No accounts found for this CustomerID",
            });
        }

        res.status(200).send({
            success: true,
            message: "Account details fetched successfully",
            data: accounts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching account details",
            error: error.message || error,
        });
    }
};




module.exports = { getAccounts, getAccountByID, createAccount, updateAccount, deleteAccount ,getAccountDetailsForCustomer};
