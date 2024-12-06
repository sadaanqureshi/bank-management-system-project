const express = require('express');
const {
    createPayment,
    
    getPaymentsByCustomerID,
    getAllPayments,
  } = require('../controllers/paymentsController');
  

const router = express.Router();

//router.get('/getall',getAllPayments);

router.get('/getall',getAllPayments)
router.get('/get/:CustomerID', getPaymentsByCustomerID);
router.post('/create',createPayment);

module.exports=router;