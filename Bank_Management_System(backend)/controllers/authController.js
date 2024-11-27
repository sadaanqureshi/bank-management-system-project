const db = require("../config/db");
// const bcrypt = require('bcrypt'); // For password comparison (if hashed)
const jwt = require('jsonwebtoken'); // For token generation

const JWT_SECRET = 'your-secret-key'; // Replace with a secure secret key



// const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' });
//   }
//   console.log('Email:', email);
//   console.log('Password:', password);

//     try {
//       // Query the customer by email
//       const [result] = await db.query(
//         "SELECT * FROM Customers WHERE Email = ?",
//         [email]
//       );
//       console.log('result:', result);
//       if (result.length === 0) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       const customer = result[0];

//       // Compare the provided password with the stored password
//       // If password is stored as plain text (not recommended), use direct comparison
//       const isMatch = customer.Password === password;

//       // If passwords are hashed, uncomment the below line and remove the above line:
//       // const isMatch = await bcrypt.compare(password, customer.Password);

//       if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       // Generate JWT token
//       const token = jwt.sign(
//         { id: customer.CustomerID, email: customer.Email },
//         JWT_SECRET,
//         { expiresIn: '1h' } // Token expires in 1 hour
//       );
//       console.log('Token:', token);

//       return res.status(200).json({
//         success: true,
//         message: 'Login successful',
//         token,
//         customer: {
//           id: customer.CustomerID,
//           firstName: customer.FirstName,
//           lastName: customer.LastName,
//           email: customer.Email,
//         },
//       });
      

//     //   return res.status(200).json({
//     //     message: 'Login successful',
//     //     token,
//     //     customer: {
//     //       id: customer.CustomerID,
//     //       firstName: customer.FirstName,
//     //       lastName: customer.LastName,
//     //       email: customer.Email,
//     //     },
//     //   });
//     } catch (queryError) {
//       console.error('Database query error:', queryError);
//       return res.status(500).json({ message: 'Database query error' });
//     }
// };




const login = async (req, res) => {
  try {
      const { CustomerID, Password } = req.body;

      // Validate required fields
      if (!CustomerID || !Password) {
          return res.status(400).send({
              success: false,
              message: "All fields are required: CustomerID and Password.",
          });
      }

      // Check if CustomerID exists
      const [customer] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);
      if (!customer || customer.length === 0) {
          return res.status(404).send({
              success: false,
              message: `Customer with ID ${CustomerID} does not exist.`,
          });
      }

      // Check if AccountID exists
      const [account] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);
      if (!account || account.length === 0) {
          return res.status(404).send({
              success: false,
              message: `Account with ID ${AccountID} does not exist.`,
          });
      }


      // Check LoginAttempts table for failed attempts
      const [loginAttempts] = await db.query('SELECT * FROM LoginAttempts WHERE CustomerID = ?', [CustomerID]);

      if (loginAttempts && loginAttempts.length > 0) {
          const { FailedAttempts, LastFailedAttempt } = loginAttempts[0];
          const now = new Date();
          const lastAttemptTime = new Date(LastFailedAttempt);
          const diffInSeconds = Math.floor((now - lastAttemptTime) / 1000);

          // If 30 seconds have passed, reset FailedAttempts to 0
          if (diffInSeconds >= 30) {
              await db.query(
                  'UPDATE LoginAttempts SET FailedAttempts = 0, LastFailedAttempt = NULL WHERE CustomerID = ?',
                  [CustomerID]
              );
          } else if (FailedAttempts >= 3) {
              // If 30 seconds haven't passed and FailedAttempts >= 3, block the login
              return res.status(429).send({
                  success: false,
                  message: `Too many failed attempts. Please try again after ${30 - diffInSeconds} seconds.`,
              });
          }
      }

      // Check Password
      if (customer[0].Password !== Password) {
          // Increment failed attempts in LoginAttempts table
          if (loginAttempts && loginAttempts.length > 0) {
              await db.query(
                  'UPDATE LoginAttempts SET FailedAttempts = FailedAttempts + 1, LastFailedAttempt = NOW() WHERE CustomerID = ?',
                  [CustomerID]
              );
          } else {
              await db.query(
                  'INSERT INTO LoginAttempts (CustomerID, FailedAttempts, LastFailedAttempt) VALUES (?, 1, NOW())',
                  [CustomerID]
              );
          }
          return res.status(401).send({
              success: false,
              message: "Incorrect password.",
          });
      }

      // Reset FailedAttempts on successful login
      await db.query('UPDATE LoginAttempts SET FailedAttempts = 0, LastFailedAttempt = NULL WHERE CustomerID = ?', [CustomerID]);

      // Return success response
      return res.status(200).send({
          success: true,
          message: "Login successful.",
          customerDetails: {
              CustomerID: customer[0].CustomerID,
              FirstName: customer[0].FirstName,
              LastName: customer[0].LastName,
              Email: customer[0].Email,
          },
      });
  } catch (error) {
      console.error(error);
      res.status(500).send({
          success: false,
          message: "Error in Login API.",
          error: error.message || error,
      });
  }
};



module.exports = { login };

///hhhhhhhhh/jjjjj