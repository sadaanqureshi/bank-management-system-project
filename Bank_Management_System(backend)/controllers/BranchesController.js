const db = require("../config/db");

//GET ALL BRANCHES LIST
const getBranches = async(req,res)=>{
    try {
        const [data] = await db.query(`
            SELECT 
                b.*,
                COUNT(e.EmployeeID) AS TotalEmployees
            FROM Branches b
            LEFT JOIN Employees e ON b.BranchID = e.BranchID
            GROUP BY b.BranchID
        `);
        
        if(!data){
            return res.status(404).send({
                success:false,
                message: 'No records found',
               
            })
        }
            res.status(200).send({
                success:true,
                message: 'All Branches Records',
                totalbranches: data[0].length,
                data:data
            })

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'Error in Get All branches API',
            error
        })
    }
}

//Get Branches BY ID
const getBranchesbyID = async (req, res) => {
    try {
        const branchID = req.params.id;

        // Validate branchID
        if (!branchID) {
            return res.status(400).send({
                success: false,
                message: 'Invalid Branch ID',
            });
        }

        // Query to fetch branch details and count employees
        const [data] = await db.query(`
            SELECT 
                b.BranchID,
                b.BranchName,
                b.Location,
                b.Phone,
                COUNT(e.EmployeeID) AS TotalEmployees
            FROM Branches b
            LEFT JOIN Employees e ON b.BranchID = e.BranchID
            WHERE b.BranchID = ?
        `, [branchID]);

        // Check if branch exists
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Branch ID ${branchID} does not exist`,
            });
        }

        // Respond with branch and employee count
        res.status(200).send({
            success: true,
            message: 'Branch Record Retrieved Successfully',
            data: data,  // Return branch details including employee count
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Branch by ID API',
            error: error.message || error,
        });
    }
};

//create branches
const createBranches=async(req,res)=>{
    try {
        const {BranchID,BranchName,Location,Phone}=req.body;
        if (!BranchID || !BranchName || !Location || !Phone) {
            return res.status(500).send({
                success: false,
                message: "All fields are required: BranchID, BranchName, Location, Phone",
            });
        }
        const data=await db.query('INSERT INTO Branches (BranchID, BranchName, Location, Phone) VALUES (?, ?, ?, ?)', [BranchID, BranchName, Location, Phone])
        if(!data){
            return res.status(404).send({
                success:false,
                message: "Error in Insert Branches Query"
            })
        }
        res.status(201).send({
            success: true,
            message: "Branch created successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'Error in Create Branches API',
            error
    })
}
}


const updateBranch = async (req, res) => {
    try {
        const  BranchID  = req.params.id; // Get BranchID from the URL
        const { BranchName, Location, Phone } = req.body; // Get updated fields from request body

        // Validate that BranchID and at least one field to update are provided
        if (!BranchID) {
            return res.status(400).send({
                success: false,
                message: "BranchID is required in the URL",
            });
        }

        if (!BranchName && !Location && !Phone) {
            return res.status(400).send({
                success: false,
                message: "At least one field (BranchName, Location, or Phone) must be provided to update",
            });
        }

        // Build the SQL query dynamically based on provided fields
        let query = "UPDATE Branches SET ";
        const fields = [];
        const values = [];

        if (BranchName) {
            fields.push("BranchName = ?");
            values.push(BranchName);
        }

        if (Location) {
            fields.push("Location = ?");
            values.push(Location);
        }

        if (Phone) {
            fields.push("Phone = ?");
            values.push(Phone);
        }

        // Join fields for query and add BranchID to values
        query += fields.join(", ") + " WHERE BranchID = ?";
        values.push(BranchID);

        // Execute the query
        const result = await db.query(query, values);

        // Check if the update affected any rows
        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: `No branch found with BranchID ${BranchID}`,
            });
        }

        // Success response
        res.status(200).send({
            success: true,
            message: `Branch with BranchID ${BranchID} updated successfully`,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            success: false,
            message: "Error in Update Branch API",
            error,
        });
    }
};

//Delete Branches
const deleteBranch = async (req, res) => {
    try {
        const { id: BranchID } = req.params;

        // Validate BranchID
        if (!BranchID) {
            return res.status(400).send({
                success: false,
                message: "Invalid Branch ID",
            });
        }

        // Check if the branch exists
        const [branch] = await db.query(`
            SELECT * FROM Branches WHERE BranchID = ?
        `, [BranchID]);

        if (branch.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Branch with BranchID ${BranchID} not found.`,
            });
        }

        // Delete the branch
        const [result] = await db.query(`
            DELETE FROM Branches WHERE BranchID = ?
        `, [BranchID]);

        // Confirm successful deletion
        if (result.affectedRows === 0) {
            return res.status(500).send({
                success: false,
                message: `Failed to delete Branch with BranchID ${BranchID}.`,
            });
        }

        res.status(200).send({
            success: true,
            message: `Branch with BranchID ${BranchID} deleted successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Branch API",
            error: error.message || error,
        });
    }
};

module.exports={getBranches,getBranchesbyID,createBranches,updateBranch,deleteBranch}