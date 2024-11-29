const db = require("../config/db");



//get employee by ID
const getEmployeeByID = async (req, res) => {
    try {
        const { EmployeeID } = req.params;
        console.log(EmployeeID);
        // Validate EmployeeID
        if (!EmployeeID) {
            return res.status(400).send({
                success: false,
                message: "EmployeeID is required.",
            });
        }

        // Query to fetch employee by EmployeeID
        const [data] = await db.query(`
            SELECT 
                e.*, 
                b.BranchID, 
                b.BranchName, 
                b.Location AS BranchLocation
            FROM Employees e
            JOIN Branches b ON e.BranchID = b.BranchID 
            WHERE e.EmployeeID = ?
        `, [EmployeeID]);

        // Check if employee exists
        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Employee with EmployeeID ${EmployeeID} not found.`,
            });
        }

        // Respond with employee details
        res.status(200).send({
            success: true,
            message: `Employee with EmployeeID ${EmployeeID} retrieved successfully.`,
            data: data[0],  // Return the employee details
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Employee by ID API',
            error: error.message || error,
        });
    }
};



//Get employees by BranchID
const getEmployeesByBranchID = async (req, res) => {
    try {
        const { BranchID } = req.params;

        // Validate BranchID
        if (!BranchID) {
            return res.status(400).send({
                success: false,
                message: "BranchID is required.",
            });
        }

        // Check if the BranchID exists in Branches table
        const [branchData] = await db.query(`
            SELECT * FROM Branches WHERE BranchID = ?
        `, [BranchID]);

        // If the branch does not exist
        if (branchData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Branch with BranchID ${BranchID} not found.`,
            });
        }

        // Query to fetch employees by BranchID
        const [data] = await db.query(`
            SELECT 
                e.EmployeeID,
                e.FirstName,
                e.LastName,
                e.Position,
                e.Salary,
                e.HireDate,
                b.BranchID,
                b.BranchName,
                b.Location AS BranchLocation
            FROM Employees e
            JOIN Branches b ON e.BranchID = b.BranchID 
            WHERE e.BranchID = ?
        `, [BranchID]);

        // Check if employees exist
        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No employees found for BranchID ${BranchID}.`,
            });
        }

        // Respond with employee details
        res.status(200).send({
            success: true,
            message: `Employees from BranchID ${BranchID} retrieved successfully.`,
            data: data,  // Return the list of employees
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Employees by BranchID API',
            error: error.message || error,
        });
    }
};

//update Employee
const updateEmployee = async (req, res) => {
    try {
        const { EmployeeID } = req.params;
        const { FirstName, LastName, Position, Salary, BranchID } = req.body;

        // Validate input data
        if (!FirstName || !LastName || !Position || !Salary || !BranchID) {
            return res.status(400).send({
                success: false,
                message: "All fields (FirstName, LastName, Position, Salary, BranchID) are required.",
            });
        }

        // Check if the employee exists
        const [employee] = await db.query(`
            SELECT * FROM Employees WHERE EmployeeID = ?
        `, [EmployeeID]);

        if (employee.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Employee with EmployeeID ${EmployeeID} not found.`,
            });
        }

        // Check if the BranchID exists
        const [branch] = await db.query(`
            SELECT * FROM Branches WHERE BranchID = ?
        `, [BranchID]);

        if (branch.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Branch with BranchID ${BranchID} not found.`,
            });
        }

        // Update the employee details
        await db.query(`
            UPDATE Employees
            SET FirstName = ?, LastName = ?, Position = ?, Salary = ?, BranchID = ?
            WHERE EmployeeID = ?
        `, [FirstName, LastName, Position, Salary, BranchID, EmployeeID]);

        // Respond with success message
        res.status(200).send({
            success: true,
            message: `Employee with EmployeeID ${EmployeeID} updated successfully.`,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Employee API',
            error: error.message || error,
        });
    }
};




// Create employee
const createEmployee = async (req, res) => {
    try {
        const { EmployeeID, FirstName, LastName, Position, Salary, HireDate, BranchID } = req.body;

        console.log(EmployeeID, FirstName, LastName, Position, Salary, HireDate, BranchID);

        // Check if all required fields are provided
        if (!EmployeeID || !FirstName || !LastName || !Position || !Salary || !HireDate || !BranchID) {
            return res.status(400).send({
                success: false,
                message: "All fields are required: EmployeeID, FirstName, LastName, Position, Salary, HireDate, BranchID",
            });
        }
        const [existingEmployee] = await db.query('SELECT * FROM Employees WHERE EmployeeID = ?', [EmployeeID]);
        if (existingEmployee.length > 0) {
            return res.status(400).send({
                success: false,
                message: `Employee with EmployeeID ${EmployeeID} already exists.`,
                alert: `Employee with EmployeeID ${EmployeeID} already exists.`,
            });
        }

        // Insert the new employee data into the database
        const data = await db.query(
            'INSERT INTO Employees (EmployeeID, FirstName, LastName, Position, Salary, HireDate, BranchID) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [EmployeeID, FirstName, LastName, Position, Salary, HireDate, BranchID]
        );

        // Check if the insertion was successful
        if (!data) {
            return res.status(500).send({
                success: false,
                message: "Error in Insert Employees Query",
            });
        }



        // Respond with success message
        res.status(201).send({
            success: true,
            message: "Employee created successfully!",

        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Create Employee API',
            error: error.message || error,
        });
    }
};


//delete employee
const deleteEmployee = async (req, res) => {
    try {
        const { EmployeeID } = req.params;

        // Validate EmployeeID
        if (!EmployeeID) {
            return res.status(400).send({
                success: false,
                message: "EmployeeID is required.",
            });
        }

        // Check if the employee exists
        const [employee] = await db.query(`
            SELECT * FROM Employees WHERE EmployeeID = ?
        `, [EmployeeID]);

        if (employee.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Employee with EmployeeID ${EmployeeID} not found.`,
            });
        }

        // Delete the employee
        await db.query(`
            DELETE FROM Employees WHERE EmployeeID = ?
        `, [EmployeeID]);

        // Respond with success message
        res.status(200).send({
            success: true,
            message: `Employee with EmployeeID ${EmployeeID} deleted successfully.`,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Delete Employee API',
            error: error.message || error,
        });
    }
};


const getAllEmployees = async (req, res) => {
    try {
        // Query to fetch all employees with branch details
        const [data] = await db.query(`
            SELECT 
                e.EmployeeID,
                e.FirstName,
                e.LastName,
                e.Position,
                e.Salary,
                e.HireDate,
                b.BranchID,
                b.BranchName,
                b.Location AS BranchLocation
            FROM Employees e
            LEFT JOIN Branches b ON e.BranchID = b.BranchID
        `);
        console.log(data);

        // Check if there are any employees
        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No employees found.',
            });
        }

        // Respond with the list of employees
        res.status(200).send({
            success: true,
            message: 'All employees retrieved successfully.',
            data: data, // Return the list of employees with branch details
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Employees API',
            error: error.message || error,
        });
    }
};



module.exports = {
    createEmployee, getEmployeeByID, getEmployeesByBranchID, updateEmployee, deleteEmployee, getAllEmployees

};