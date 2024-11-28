const express = require('express');
const { getAccounts, getAccountByID, createAccount, updateAccount, deleteAccount, getAccountDetailsForCustomer, depositMoney } = require('../controllers/accountsController');

// router object
const router = express.Router();

// Get All Accounts List || GET
router.get('/getall', getAccounts);

// Get Account by ID || GET
router.get('/get/:id', getAccountByID);

// Create Account || POST
router.post('/create', createAccount);

// Update Account || PUT
router.put('/update/:id', updateAccount);

// Delete Account || DELETE
router.delete('/delete/:id', deleteAccount);

router.get('/customer/:customerId', getAccountDetailsForCustomer);


module.exports = router;
