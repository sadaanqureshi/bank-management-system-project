const db = require("../config/db");
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const login = async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);

    const { CustomerID, Password } = req.body;

    // Validate input fields
    if (!CustomerID || !Password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: CustomerID and Password.",
      });
    }

    // Check if CustomerID exists in the database
    const [customer] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);

    if (!customer || customer.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${CustomerID} does not exist.`,
      });
    }

    // Check Password validity (No bcrypt hashing used, comparing directly)
    const storedPassword = customer[0].Password; // Assuming this is the plain-text Password in the database

    if (Password !== storedPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        CustomerID: customer[0].CustomerID,
        Email: customer[0].Email,
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token validity: 1 hour
    );

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      customerDetails: {
        CustomerID: customer[0].CustomerID,
        FirstName: customer[0].FirstName,
        LastName: customer[0].LastName,
        Email: customer[0].Email,
      },
    });
  } catch (error) {
    console.error('Error in login function:', error.message || error);
    return res.status(500).json({
      success: false,
      message: "Error in Login API.",
      error: error.message || error,
    });
  }
};

module.exports = { login };
