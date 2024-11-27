const db = require("../config/db");
// const bcrypt = require('bcrypt'); // For password comparison (if hashed)
const jwt = require('jsonwebtoken'); // For token generation

const JWT_SECRET = 'your-secret-key'; // Replace with a secure secret key

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  console.log('Email:', email);
  console.log('Password:', password);

    try {
      // Query the customer by email
      const [result] = await db.query(
        "SELECT * FROM Customers WHERE Email = ?",
        [email]
      );
      console.log('result:', result);
      if (result.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const customer = result[0];

      // Compare the provided password with the stored password
      // If password is stored as plain text (not recommended), use direct comparison
      const isMatch = customer.Password === password;

      // If passwords are hashed, uncomment the below line and remove the above line:
      // const isMatch = await bcrypt.compare(password, customer.Password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: customer.CustomerID, email: customer.Email },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );
      console.log('Token:', token);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        customer: {
          id: customer.CustomerID,
          firstName: customer.FirstName,
          lastName: customer.LastName,
          email: customer.Email,
        },
      });
      

    //   return res.status(200).json({
    //     message: 'Login successful',
    //     token,
    //     customer: {
    //       id: customer.CustomerID,
    //       firstName: customer.FirstName,
    //       lastName: customer.LastName,
    //       email: customer.Email,
    //     },
    //   });
    } catch (queryError) {
      console.error('Database query error:', queryError);
      return res.status(500).json({ message: 'Database query error' });
    }
};

module.exports = { login };