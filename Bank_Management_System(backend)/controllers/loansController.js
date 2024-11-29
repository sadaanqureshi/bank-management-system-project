
const db = require("../config/db");

//Get All loans
const getLoans = async (req, res) => {
    try {
        // Query to fetch all loans from the Loans table
        const [data] = await db.query("SELECT * FROM Loans");
        
        // Check if no loans were found
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No loans found",
            });
        }

        // Return success response with loans data
        res.status(200).send({
            success: true,
            message: "All loans retrieved successfully",
            totalLoans: data.length,
            data,  // The loans data array
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving loans",
            error,  // Error object
        });
    }
};

//get loans by customer id
const getLoansByCustomerID = async (req, res) => {
    try {
        const customerid = req.params.customerid;

        if (!customerid) {
            return res.status(400).send({
                success: false,
                message: 'Invalid Customer ID',
            });
        }

        // Check if there are any loan for the given CustomerID
        const [data] = await db.query(`
            SELECT 
                l.CustomerID,
                c.FirstName, 
                c.LastName, 
                c.Address, 
                c.Phone, 
                c.Email, 
                l.LoanID, 
                l.LoanType, 
                l.Amount, 
                l.InterestRate, 
                l.LoanDate, 
                l.DueDate, 
                l.Status
            FROM Customers c
            LEFT JOIN Loans l ON c.CustomerID = l.CustomerID
            WHERE c.CustomerID = ?`, [customerid]);

        // Check if no loans were found for the customer
        if (!data || data.length === 0 || !data[0].LoanID) {
            // Check if the customer exists
            const [customerCheck] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [customerid]);

            if (!customerCheck || customerCheck.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: `Customer ID ${customerid} does not exist`,
                });
            }

            return res.status(404).send({
                success: false,
                message: `No Loans found for Customer ID ${customerid}`,
            });
        }

        res.status(200).send({
            success: true,
            message: `Loans for Customer ID ${customerid}`,
            data,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching Loans by Customer ID',
            error,
        });
    }
};





//create loan
const createLoan = async (req, res) => {
    try {
        const { CustomerID, LoanType } = req.body;

        // Validate input fields
        if (!CustomerID || !LoanType) {
            return res.status(400).send({
                success: false,
                message: "CustomerID and LoanType are required.",
            });
        }
            // Fetch customer and account details
            const [customerAndAccount] = await db.query(
                `SELECT c.*, a.AccountID, a.AccountType, a.Balance 
                 FROM Customers c 
                 LEFT JOIN Accounts a ON c.CustomerID = a.CustomerID 
                 WHERE c.CustomerID = ?`, 
                [CustomerID]
            );
    
            if (!customerAndAccount || customerAndAccount.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: `CustomerID ${CustomerID} does not exist.`,
                });
            }
    
            const AccountID = customerAndAccount[0].AccountID;
    
            if (AccountID === null) {
                return res.status(404).send({
                    success: false,
                    message: `No account found for CustomerID ${CustomerID}.`,
                });
            }
    

            
        // Check if the customer already has an active loan


        const [existingLoan] = await db.query(
            `SELECT * FROM Loans WHERE CustomerID = ? AND Status = 'Active'`,
            [CustomerID]
        );

        if (existingLoan.length > 0) {
            return res.status(400).send({
                success: false,
                message: `CustomerID ${CustomerID} already has an active loan.`,
                alert: "Customer already has an active loan",
            });
        }

    
        // Calculate interest and total loan amount
        const loanAmount = 50000; // Fixed loan amount
        const interestRate = 15.0; // 15% interest
        const interestAmount = (loanAmount * interestRate) / 100;
        const totalLoanAmount = loanAmount + interestAmount;

        // Get the current date and calculate due date (1 year later)
        const loanDate = new Date();
        const dueDate = new Date(loanDate);
        dueDate.setFullYear(dueDate.getFullYear() + 1);

        // Insert loan record into the Loans table
        const [loan] = await db.query(
            'INSERT INTO Loans (CustomerID, LoanType, Amount, InterestRate, LoanDate, DueDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                CustomerID,
                LoanType,
                totalLoanAmount,
                interestRate,
                loanDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                dueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                'Active', // Status
            ]
        );

        // Update account balance by adding the loan amount
        await db.query('UPDATE Accounts SET Balance = Balance + ? WHERE AccountID = ?', [loanAmount, AccountID]);

        // Re-fetch updated account details to include the new balance
        const [updatedAccount] = await db.query(
            `SELECT c.*, a.AccountID, a.AccountType, a.Balance 
             FROM Customers c 
             LEFT JOIN Accounts a ON c.CustomerID = a.CustomerID 
             WHERE c.CustomerID = ?`, 
            [CustomerID]
        );

        res.status(201).send({
            success: true,
            message: "Loan created successfully, and loan amount added to account balance!",
            loanDetails: {
                LoanID: loan.insertId,
                CustomerID,
                LoanType,
                LoanAmount: loanAmount,
                InterestAmount: interestAmount,
                TotalLoanAmount: totalLoanAmount,
                InterestRate: `${interestRate}%`,
                LoanDate: loanDate.toISOString().split('T')[0],
                DueDate: dueDate.toISOString().split('T')[0],
                Status: 'Active',
            },
            customerAndAccountDetails: updatedAccount[0], // Return updated balance here
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error creating loan',
            error: error.message || error,
        });
    }
};



module.exports = {
    getLoans,getLoansByCustomerID,createLoan
    
};
