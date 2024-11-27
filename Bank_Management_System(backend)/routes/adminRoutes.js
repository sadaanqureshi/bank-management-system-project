const express = require('express');
const { createAdmin, loginAdmin, resetPassword } = require('../controllers/adminController');

// router object
const router = express.Router();


// Create Account || POST
router.post('/create', createAdmin);

router.post('/login', loginAdmin);

router.post('/resetpassword', resetPassword);

module.exports = router;
