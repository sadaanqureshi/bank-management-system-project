const express = require('express');
const {
    getAllTransactions,
    getTransactionsByAccountID,createTransaction
    
} = require('../controllers/transactionsController');

// router object
const router = express.Router();

// Get All Transactions || GET
router.get('/getall', getAllTransactions);

// Get Transactions by AccountID || GET
router.get('/getbyaccount/:accountID', getTransactionsByAccountID);

//Create Transaction
router.post('/create',createTransaction);


module.exports = router;
