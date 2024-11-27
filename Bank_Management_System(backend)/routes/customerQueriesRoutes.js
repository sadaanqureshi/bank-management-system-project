const express = require('express');
const { createCustomerQuery, getAllCustomerQueries, getQueriesByCustomerID, updateCustomerQuery } = require('../controllers/customerQueriesController');

// router object
const router = express.Router();


router.post('/create', createCustomerQuery);
router.get('/getall', getAllCustomerQueries);
router.get('/getbycid/:CustomerID', getQueriesByCustomerID);
router.put('/updatequery/:QueryID', updateCustomerQuery);






module.exports = router;
