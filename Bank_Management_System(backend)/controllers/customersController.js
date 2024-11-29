const db = require("../config/db");

// GET ALL CUSTOMERS
const getCustomers = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM Customers");
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No customers found",
            });
        }
        res.status(200).send({
            success: true,
            message: "All customers retrieved",
            totalCustomers: data.length,
            data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving customers",
            error,
        });
    }
};

// GET CUSTOMER BY ID

const getCustomerByID = async (req, res) => {
    try {
        const CustomerID = req.params.id;
        console.log(CustomerID);
        if (!CustomerID) {
            return res.status(400).send({
                success: false,
                message: "CustomerID is required",
            });
        }
        const [data] = await db.query(`SELECT c.*,a.AccountID,a.AccountType,a.Balance FROM Customers c
Left join Accounts a ON c.CustomerID =a.CustomerID  
WHERE c.CustomerID = ?`, [CustomerID]);
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Customer not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Customer retrieved successfully",
            data: data[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving customer",
            error,
        });
    }
};


const createCustomer = async (req, res) => {
    try {
        const { CustomerID, Password, FirstName, LastName, Address, Email, Phone, BranchID } = req.body;

        // Validate required fields
        if (!CustomerID || !Password || !FirstName || !LastName || !Address || !Email || !Phone) {
            return res.status(400).send({
                success: false,
                message: "All fields except BranchID are required",
            });
        }

        // Check if BranchID exists
        if (BranchID) {
            const [branchExists] = await db.query("SELECT 1 FROM Branches WHERE BranchID = ?", [BranchID]);
            if (!branchExists) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid BranchID. Branch does not exist.",
                });
            }
        }

        // Insert customer into the database
        const [result] = await db.query(
            "INSERT INTO Customers (CustomerID,  FirstName, LastName, Address, Email, Phone, BranchID, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [CustomerID, FirstName, LastName, Address, Email, Phone, BranchID || null, Password]
        );

        // Log the stored customer data
        console.log("Customer data stored in the database:", {
            CustomerID,
            Password,
            FirstName,
            LastName,
            Address,
            Email,
            Phone,
            BranchID: BranchID || null,
        });

        // Respond to the client
        res.status(201).send({
            success: true,
            message: "Customer created successfully",
            data: {
                CustomerID,
                FirstName,
                LastName,
                Address,
                Email,
                Phone,
                BranchID: BranchID || null,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error creating customer",
            error,
        });
    }
};

// UPDATE CUSTOMER
const updateCustomer = async (req, res) => {
    try {
      const CustomerID = req.params.id;
      const { FirstName, LastName, Address, Email, Phone, BranchID, Password } = req.body;
      console.log(CustomerID);
  
      if (!CustomerID) {
        return res.status(400).send({ success: false, message: "CustomerID is required in the URL" });
      }
  
      // Check if CustomerID exists
      const [customerExists] = await db.query("SELECT 1 FROM Customers WHERE CustomerID = ?", [CustomerID]);
      if (!customerExists.length) {
        return res.status(404).send({ success: false, message: "CustomerID does not exist." });
      }
  
      // Validate BranchID if provided
      if (BranchID) {
        const [branchExists] = await db.query("SELECT 1 FROM Branches WHERE BranchID = ?", [BranchID]);
        if (!branchExists.length) {
          return res.status(400).send({ success: false, message: "Invalid BranchID. Branch does not exist." });
        }
      }
  
      // Build dynamic update query
      const fields = [];
      const values = [];
  
      if (FirstName) fields.push("FirstName = ?") && values.push(FirstName);
      if (LastName) fields.push("LastName = ?") && values.push(LastName);
      if (Address) fields.push("Address = ?") && values.push(Address);
      if (Email) fields.push("Email = ?") && values.push(Email);
      if (Phone) fields.push("Phone = ?") && values.push(Phone);
      if (BranchID) fields.push("BranchID = ?") && values.push(BranchID);
      if (Password) fields.push("Password = ?") && values.push(Password); // Add hashing for production
  
      if (!fields.length) {
        return res.status(400).send({ success: false, message: "No fields to update" });
      }
  
      const query = `UPDATE Customers SET ${fields.join(", ")} WHERE CustomerID = ?`;
      values.push(CustomerID);
  
      const [result] = await db.query(query, values);
  
      if (result.affectedRows === 0) {
        return res.status(404).send({ success: false, message: "No customer found with the provided CustomerID" });
      }
  
      res.status(200).send({ success: true, message: "Customer updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Error updating customer", error });
    }
  };
  

// DELETE CUSTOMER
const deleteCustomer = async (req, res) => {
    try {
        const CustomerID = req.params.id;

        // Check if the customer exists
        const [customer] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);
        if (!customer || customer.length === 0) {
            return res.status(404).send({
                success: false,
                message: `CustomerID ${CustomerID} does not exist`,
            });
        }

        // Delete the customer (this will also delete related accounts due to ON DELETE CASCADE)
        const result = await db.query('DELETE FROM Customers WHERE CustomerID = ?', [CustomerID]);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: `No customer found with CustomerID ${CustomerID}`,
            });
        }

        res.status(200).send({
            success: true,
            message: "Customer and related accounts deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error deleting customer",
            error,
        });
    }
};

// Get Customer Details for Dashboard



module.exports = {
    getCustomers,
    getCustomerByID,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};