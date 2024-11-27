const express = require('express');
const {
  getCustomers,
  getCustomerByID,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customersController');

const router = express.Router();

// Routes
router.get('/getall', getCustomers); // Get all customers
router.get('/get/:id', getCustomerByID); // Get a customer by ID
router.post('/create', createCustomer); // Create a new customer
router.put('/update/:id', updateCustomer); // Update a customer
router.delete('/delete/:id', deleteCustomer); // Delete a customer

module.exports = router;
