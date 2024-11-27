const express = require('express');
const app = express();
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mySqlPool = require('./config/db');
const cors = require('cors'); // Import CORS

// Configure dotenv
dotenv.config();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors()); // Use CORS middleware

// Routes
app.use('/api/v1/branches', require("./routes/branchesRoutes"));
app.use('/api/v1/customers', require("./routes/customersRoutes"));
app.use('/api/v1/accounts', require("./routes/accountsRoutes"));
app.use('/api/v1/transactions', require("./routes/transactionsRoutes"));
app.use('/api/v1/loans', require("./routes/loansRoutes"));
app.use('/api/v1/payments', require("./routes/paymentsRoutes"));
app.use('/api/v1/employees', require("./routes/employeesRoutes"));
app.use('/api/v1/accountcards', require("./routes/accountCardsRoutes"));
app.use('/api/v1/customerqueries', require("./routes/customerQueriesRoutes"));
app.use('/api/v1/auth', require("./routes/authRoutes"));

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/test', function (req, res) {
  res.send('Hello World');
});

const PORT = process.env.PORT || 8000;

// Conditionally listen
mySqlPool.query('SELECT 1').then(() => {
  // MySQL
  console.log('MySQL DB connected'.bgCyan.white);

  // Listen
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgMagenta.white);
  });
}).catch((error) => {
  console.error('Error connecting to the database:', error);
});
