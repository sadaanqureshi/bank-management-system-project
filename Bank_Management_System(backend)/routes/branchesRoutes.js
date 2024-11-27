const express = require('express');
const { getBranches, getBranchesbyID, createBranches, updateBranch, deleteBranch } = require('../controllers/BranchesController');

//router object
const router = express.Router();

//Get All Branches List || GET
router.get('/getall',getBranches);

//Get Branches BY ID || GET
router.get('/get/:id',getBranchesbyID);

//Ceate Brancher || POST
router.post('/create',createBranches)


//Update Branches || PUT
router.put('/update/:id',updateBranch)



//Delete Branches || Delete
router.delete('/delete/:id',deleteBranch)

module.exports=router;