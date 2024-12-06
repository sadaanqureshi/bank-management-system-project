const express = require('express');
const app = express();
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mySqlPool = require('./config/db');
const cors = require('cors'); // Import CORS

app.use(express.json());

// Configure dotenv
dotenv.config();

// Middleware
app.use(morgan('dev')); // Logging middleware
//app.use(cors()); // Use CORS middleware
app.use(cors({ origin: "http://localhost:3000" })); 

// Routes
app.use('/api/v1/branches', require('./routes/branchesRoutes'));
app.use('/api/v1/customers', require('./routes/customersRoutes'));
app.use('/api/v1/accounts', require('./routes/accountsRoutes'));
app.use('/api/v1/transactions', require('./routes/transactionsRoutes'));
app.use('/api/v1/loans', require('./routes/loansRoutes'));
app.use('/api/v1/payments', require('./routes/paymentsRoutes'));
app.use('/api/v1/employees', require('./routes/employeesRoutes'));
app.use('/api/v1/accountcards', require('./routes/accountCardsRoutes'));
app.use('/api/v1/customerqueries', require('./routes/customerQueriesRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// Health check routes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.get('/test', (req, res) => {
  res.send('API is working');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack.red);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const PORT = process.env.PORT || 8000;

// Conditionally listen to ensure DB connection is successful
mySqlPool.query('SELECT 1')
  .then(() => {
    console.log('MySQL DB connected'.bgCyan.white);

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`.bgMagenta.white);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:'.bgRed.white, error.message);
    process.exit(1); // Exit the process if DB connection fails
  });
