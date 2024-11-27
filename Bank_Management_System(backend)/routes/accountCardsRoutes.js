const express = require('express');
const { createCard, getCardByAccID, getCardByCardID, updateCardPIN, deleteCard, depositMoney, withdrawMoney } = require('../controllers/accountCardsController');

// router object
const router = express.Router();


router.post('/create', createCard);
router.post('/getbyaccount',getCardByAccID)
router.post('/getbycard',getCardByCardID)
router.put('/updatepin/:CardID',updateCardPIN)
router.delete('/delete',deleteCard)
router.post('/deposit',depositMoney)
router.post('/withdrawl',withdrawMoney)
//////////////////////////////////////

module.exports = router;
