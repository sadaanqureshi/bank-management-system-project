const express = require('express');
const {
    getLoans,
    getLoansByCustomerID,
    createLoan

  } = require('../controllers/loansController');
  

const router = express.Router();

router.get('/getall',getLoans);
router.get('/getbycustomer/:customerid',getLoansByCustomerID);
router.post('/create',createLoan);
module.exports=router;