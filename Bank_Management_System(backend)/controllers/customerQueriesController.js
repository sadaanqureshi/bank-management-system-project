const db = require("../config/db");


const createCustomerQuery = async (req, res) => {
    const { CustomerID, QueryType, Description } = req.body;

    // Step 1: Validate input fields
    if (!CustomerID || !QueryType || !Description) {
        return res.status(400).send({
            success: false,
            message: 'CustomerID, QueryType, and Description are required.',
        });
    }

    try {
        // Step 2: Check if the CustomerID is valid (exists in the Customers table)
        const [customerData] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);

        if (customerData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No customer found with CustomerID ${CustomerID}.`,
            });
        }

        // Step 3: Assign current date as QueryDate
        const queryDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        // Step 4: Assign a valid EmployeeID (For simplicity, we can assign a default EmployeeID for handling the query)
        // In practice, you could either assign an employee based on available ones or randomly pick one
        const [availableEmployeeData] = await db.query('SELECT EmployeeID FROM Employees LIMIT 1'); // Picking the first available employee (you can modify this logic)
        if (availableEmployeeData.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No employees available to handle the query.',
            });
        }

        const employeeID = availableEmployeeData[0].EmployeeID; // Get the first employee's ID

        // Step 5: Insert the query into the Customer_Queries table
        const insertQuery = `
            INSERT INTO Customer_Queries (CustomerID, EmployeeID, QueryDate, QueryType, Description, Status)
            VALUES (?, ?, ?, ?, ?, ?)`;

        const status = 'Pending'; // Default status when the query is created

        const [result]=await db.query(insertQuery, [CustomerID, employeeID, queryDate, QueryType, Description, status]);
const [querydetails]=await db.query(`select * from Customer_Queries where QueryID=?`,result.insertId)
        // Step 6: Return success response
        res.status(200).send({
            success: true,
            message: 'Query submitted successfully.',
            querydetails: querydetails[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error submitting the query.',
            error: error.message,
        });
    }
};


//get all queries
const getAllCustomerQueries = async (req, res) => {
    try {
        // Step 1: Retrieve all customer queries with customer and employee details
        const [queries] = await db.query(`
           SELECT 
                cq.QueryID,
                cq.CustomerID,
                cq.EmployeeID,
                cq.QueryDate,
                cq.QueryType,
                cq.Description,
                cq.Status,
                CONCAT(c.FirstName, ' ', c.LastName) AS CustomerName,  
                c.Email AS CustomerEmail,                            
                c.Phone AS CustomerPhone
            FROM Customer_Queries cq
            LEFT JOIN Customers c ON cq.CustomerID = c.CustomerID
        `);

        // Step 2: Check if there are any queries
        if (queries.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No customer queries found.',
            });
        }

        // Step 3: Return success response with all queries
        res.status(200).send({
            success: true,
            message: 'Customer queries retrieved successfully.',
            queries: queries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error retrieving customer queries.',
            error: error.message,
        });
    }
};


//get queries by customer id

const getQueriesByCustomerID = async (req, res) => {
    const { CustomerID } = req.params; // Get CustomerID from route parameters

    try {
        // Step 1: Check if the customer exists
        const [customerData] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);

        if (customerData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No customer found with CustomerID ${CustomerID}.`,
            });
        }

        // Step 2: Retrieve queries for the specified customer with customer and employee details
        const [queries] = await db.query(`
            SELECT 
                cq.QueryID,
                cq.CustomerID,
                cq.EmployeeID,
                cq.QueryDate,
                cq.QueryType,
                cq.Description,
                cq.Status,
                CONCAT(c.FirstName, ' ', c.LastName) AS CustomerName,  -- Concatenate First and Last Name
                c.Email AS CustomerEmail,                            
                c.Phone AS CustomerPhone
            FROM Customer_Queries cq
            LEFT JOIN Customers c ON cq.CustomerID = c.CustomerID
            WHERE cq.CustomerID = ?
        `, [CustomerID]);

        // Step 3: Check if there are any queries
        if (queries.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No queries found for customer with CustomerID ${CustomerID}.`,
            });
        }

        // Step 4: Return success response with the customer's queries
        res.status(200).send({
            success: true,
            message: 'Customer queries retrieved successfully.',
            queries: queries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error retrieving customer queries.',
            error: error.message,
        });
    }
};


//update query
const updateCustomerQuery = async (req, res) => {
    const { CustomerID, QueryType, Description } = req.body;
    const { QueryID } = req.params; // Get QueryID from route parameters

    // Step 1: Validate input fields
    if (!CustomerID || !QueryType || !Description) {
        return res.status(400).send({
            success: false,
            message: 'CustomerID, QueryType, and Description are required.',
        });
    }

    try {
        // Step 2: Check if the CustomerID exists in the Customers table
        const [customerData] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);

        if (customerData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No customer found with CustomerID ${CustomerID}.`,
            });
        }

        // Step 3: Check if the QueryID exists in the Customer_Queries table
        const [queryData] = await db.query('SELECT * FROM Customer_Queries WHERE QueryID = ?', [QueryID]);

        if (queryData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No query found with QueryID ${QueryID}.`,
            });
        }

        // Step 4: Update the query with the new QueryType and Description
        const updateQuery = `
            UPDATE Customer_Queries 
            SET QueryType = ?, Description = ? 
            WHERE QueryID = ? AND CustomerID = ?
        `;

        const [updateResult] = await db.query(updateQuery, [QueryType, Description, QueryID, CustomerID]);

        // Step 5: Check if the update was successful
        if (updateResult.affectedRows === 0) {
            return res.status(400).send({
                success: false,
                message: 'Failed to update the query.',
            });
        }

        // Step 6: Return success response
        res.status(200).send({
            success: true,
            message: 'Query updated successfully.',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error updating the query.',
            error: error.message,
        });
    }
};





module.exports={createCustomerQuery,getAllCustomerQueries,getQueriesByCustomerID,updateCustomerQuery}