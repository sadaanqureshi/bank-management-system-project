const db = require("../config/db");

//create
const createCard = async (req, res) => {
    const { AccountID, CardType } = req.body;

    if (!AccountID || !CardType) {
        return res.status(400).send({
            success: false,
            message: 'AccountID and CardType are required.',
        });
    }

    try {
        // Check if AccountID exists and get the balance
        const [accountData] = await db.query('SELECT Balance FROM Accounts WHERE AccountID = ?', [AccountID]);

        if (accountData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Account with ID ${AccountID} does not exist.`,
            });
        }

        const accountBalance = accountData[0].Balance;

        // Check if account has sufficient balance to deduct the fee
        if (accountBalance < 1500) {
            return res.status(400).send({
                success: false,
                message: 'Insufficient balance for card creation fee.',
            });
        }

        // Check if the account already has two cards (one debit and one credit)
        const [existingCards] = await db.query(
            'SELECT CardType FROM Account_Cards WHERE AccountID = ?',
            [AccountID]
        );

        const cardTypes = existingCards.map((card) => card.CardType.toLowerCase());

        if (cardTypes.includes(CardType.toLowerCase())) {
            return res.status(400).send({
                success: false,
                message: `Account already has a ${CardType} card.`,
            });
        }

        if (cardTypes.length >= 2) {
            return res.status(400).send({
                success: false,
                message: 'Account can only have one debit card and one credit card.',
            });
        }

        // Deduct the fee from the account balance
        await db.query('UPDATE Accounts SET Balance = Balance - 1500 WHERE AccountID = ?', [AccountID]);

        // Generate random card number (16 digits), CVV (3 digits), and PIN (4 digits)
        const cardNumber = '4000' + Math.floor(Math.random() * 1e12).toString().padStart(12, '0');
        const cvv = Math.floor(Math.random() * 900) + 100; // Random CVV between 100 and 999
        const pin = Math.floor(Math.random() * 9000) + 1000; // Random PIN between 1000 and 9999

        // Set the expiry date to 1 year from today
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        // Insert the new card into the Account_Cards table and retrieve the CardID
        const [result] = await db.query(
            'INSERT INTO Account_Cards (AccountID, CardType, CardNumber, ExpiryDate, CVV, PIN) VALUES (?, ?, ?, ?, ?, ?)',
            [AccountID, CardType, cardNumber, expiryDate, cvv, pin]
        );

        // The inserted CardID is available in result.insertId
        const cardId = result.insertId;

        // Return success message
        res.status(201).send({
            success: true,
            message: 'Card created successfully and fee deducted.',
            cardDetails: {
                CardID: cardId, // Include the CardID in the response
                AccountID,
                CardType,
                CardNumber: cardNumber,
                ExpiryDate: expiryDate.toISOString().split('T')[0],
                CVV: cvv,
                PIN: pin,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in creating card and deducting fee.',
            error: error.message,
        });
    }
};


//get by account id
const getCardByAccID = async (req, res) => {
    const { AccountID, PIN } = req.body;

    // Ensure AccountID and PIN are provided
    if (!AccountID || !PIN) {
        return res.status(400).send({
            success: false,
            message: 'AccountID and PIN are required.',
        });
    }

    try {
        // Query to get the count of cards for the AccountID
        const [cardCountData] = await db.query(
            `SELECT COUNT(*) as cardCount 
             FROM Account_Cards ac
             WHERE ac.AccountID = ?`, 
            [AccountID]
        );

        const cardCount = cardCountData[0].cardCount;

        // Query to get the card details from the Account_Cards table
        const [cardData] = await db.query(
            `SELECT ac.*, a.*, c.* FROM Account_Cards ac
             JOIN Accounts a ON ac.AccountID = a.AccountID
             JOIN Customers c ON a.CustomerID = c.CustomerID
             WHERE ac.AccountID = ?`, 
            [AccountID]
        );

        // Check if card data exists for the given AccountID
        if (cardData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No card found for the given AccountID ${AccountID}.`,
            });
        }

        // Find the card with a matching PIN
        const card = cardData.find(c => c.PIN === PIN);

        if (!card) {
            return res.status(404).send({
                success: false,
                message: `Invalid PIN for AccountID ${AccountID}.`,
            });
        }

        // Return the card details and the count of cards
        res.status(200).send({
            success: true,
            message: 'Card details retrieved successfully.',
            cardDetails: card, // Returning the card that matches the PIN
            cardCount: cardCount,  // Returning the count of cards
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in retrieving card details.',
            error: error.message,
        });
    }
};

// get by card id
const getCardByCardID = async (req, res) => {
    const { CardID, PIN } = req.body;

    // Ensure CardID and PIN are provided
    if (!CardID || !PIN) {
        return res.status(400).send({
            success: false,
            message: 'CardID and PIN are required.',
        });
    }

    try {
        // Query to get the card details from the Account_Cards table
        const [cardData] = await db.query(
            `SELECT ac.*, a.*, c.* FROM Account_Cards ac
             JOIN Accounts a ON ac.AccountID = a.AccountID
             JOIN Customers c ON a.CustomerID = c.CustomerID
             WHERE ac.CardID = ?`, 
            [CardID]
        );

        // Check if card data exists for the given CardID
        if (cardData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No card found for the given CardID ${CardID}.`,
            });
        }

        // Check if the provided PIN matches the card's PIN
        if (PIN !== cardData[0].PIN) {
            return res.status(404).send({
                success: false,
                message: `Invalid PIN for CardID ${CardID}.`,
            });
        }

        // Return the card details
        res.status(200).send({
            success: true,
            message: 'Card details retrieved successfully.',
            cardDetails: cardData[0], // Returning the card that matches the CardID and PIN
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in retrieving card details.',
            error: error.message,
        });
    }
};

//update PIN

const updateCardPIN = async (req, res) => {
    const { AccountID, CardNumber, CardType, NewPIN } = req.body;  // Get AccountID, CardNumber, CardType, and NewPIN from request body
    const { CardID } = req.params;  // Get CardID from route parameter

    // Ensure AccountID, CardNumber, CardType, and NewPIN are provided
    if (!AccountID || !CardNumber || !NewPIN || !CardID) {
        return res.status(400).send({
            success: false,
            message: 'AccountID, CardNumber, NewPIN, and CardID are required.',
        });
    }

    try {
        // Step 1: Check if the card exists for the given AccountID and CardID
        const [accountData] = await db.query(
            `SELECT * FROM Accounts WHERE AccountID = ? `, 
            [AccountID]
        );
        const [cardData] = await db.query(
            `SELECT * FROM Account_Cards WHERE CardID = ? `, 
            [CardID]
        );

        // Check if the card exists for AccountID and CardID
        if (accountData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No Account exist of AccountID ${AccountID} .`,
            });
        }
        if (cardData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Card id ${CardID} does not exist.`,
            });
        }


        // Step 2: Check if the provided CardNumber matches the card in the database
        if (cardData[0].CardNumber.trim() !== CardNumber.trim()) {
            return res.status(404).send({
                success: false,
                message: 'Invalid Card Number.',
            });
        }

        // Step 3: Check if the provided CardType matches the card in the database
        if (cardData[0].CardType.toLowerCase() !== CardType.toLowerCase()) {
            return res.status(404).json({
              success: false,
              message: `Invalid CardType ${CardType}.`,
            });
          }
        // Step 4: Update the PIN of the card
        const updateQuery = `
            UPDATE Account_Cards 
            SET PIN = ? 
            WHERE AccountID = ? AND CardID = ? AND CardNumber = ?`;

        const [updateResult] = await db.query(updateQuery, [NewPIN, AccountID, CardID, CardNumber]);

        // Step 5: Check if the update was successful
        if (updateResult.affectedRows === 0) {
            return res.status(400).send({
                success: false,
                message: 'Failed to update PIN.',
            });
        }

        // Step 6: Return success response
        res.status(200).send({
            success: true,
            message: 'PIN updated successfully.',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating PIN.',
            error: error.message,
        });
    }
};


//delete card

const deleteCard = async (req, res) => {
    const { AccountID, CardNumber, CardType, PIN } = req.body;

    // Ensure AccountID, CardNumber, CardType, and PIN are provided
    if (!AccountID || !CardNumber || !CardType || !PIN) {
        return res.status(400).send({
            success: false,
            message: 'AccountID, CardNumber, CardType, and PIN are required.',
        });
    }

    try {
        // Step 1: Check if the card exists for the given AccountID, CardType, and CardNumber
        const [cardData] = await db.query(
            `SELECT * FROM Account_Cards WHERE AccountID = ? AND CardType = ?`,
            [AccountID, CardType]
        );

        // Check if the card exists
        if (cardData.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No ${CardType} card found for AccountID ${AccountID}.`,
            });
        }
        if (cardData[0].CardNumber.trim() !== CardNumber.trim()) {
            return res.status(404).send({
                success: false,
                message: 'Invalid Card Number.',
            });
        }

        // Step 2: Check if the PIN is correct for the given card
        if (cardData[0].PIN !== PIN) {
            return res.status(400).send({
                success: false,
                message: 'Invalid PIN provided.',
            });
        }

        // Step 3: Delete the card
        const deleteQuery = `
            DELETE FROM Account_Cards 
            WHERE AccountID = ? AND CardNumber = ? AND CardType = ?`;

        const [deleteResult] = await db.query(deleteQuery, [AccountID, CardNumber, CardType]);

        // Step 4: Check if the delete was successful
        if (deleteResult.affectedRows === 0) {
            return res.status(400).send({
                success: false,
                message: 'Failed to delete card.',
            });
        }

        // Step 5: Return success response
        res.status(200).send({
            success: true,
            message: `${CardType} card deleted successfully.`,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting card.',
            error: error.message,
        });
    }
};

//deposite money
const depositMoney = async (req, res) => {
    try {
      const { CustomerID, CardType, PIN, Amount } = req.body;
  
      // Validate input
      if (!CustomerID || !CardType || !PIN || !Amount) {
        return res.status(400).json({
          success: false,
          message: "CustomerID, CardType, PIN, and Amount are required.",
        });
      }
  
      if (Amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than zero.",
        });
      }
  
      // Validate the card details and PIN
      const [cardDetails] = await db.query(
        `SELECT ac.*,c.*,a.* FROM Customers  c
        Left JOIN Accounts a ON c.CustomerID=a.CustomerID
         Left JOIN account_cards ac ON a.AccountID = ac.AccountID WHERE c.CustomerID = ?`,
        [CustomerID]
      );
  
      if (!cardDetails || cardDetails.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Invalid Customer ID ${CustomerID} .`,
        });
      }
  
  
      if (cardDetails[0].AccountID===null) {
        return res.status(404).json({
          success: false,
          message: `Customer with ID ${CustomerID} don't have an account.`,
        });
      }
      if (cardDetails[0].CardType.toLowerCase() !== CardType.toLowerCase()) {
        return res.status(404).json({
          success: false,
          message: `Invalid CardType ${CardType}.`,
        });
      }
      
      if (cardDetails[0].PIN!==PIN) {
        return res.status(404).json({
          success: false,
          message: `Invalid PIN.`,
        });
      }
  
      // Deposit money (update the account balance)
      await db.query(
        "UPDATE Accounts SET Balance = Balance + ? WHERE AccountID = ?",
        [Amount, cardDetails[0].AccountID]
      );
  
      // Retrieve updated account details
      const [updatedAccount] = await db.query(
        `SELECT ac.*,c.*,a.* FROM Account_Cards  ac
        JOIN Accounts a ON ac.AccountID=a.AccountID
         JOIN Customers c ON a.CustomerID = c.CustomerID WHERE ac.AccountID = ?`,
        [cardDetails[0].AccountID]
      );

  
      // Return success response with the updated balance
      return res.status(200).json({
        success: true,
        message: `Successfully deposited ${Amount} to Account ID ${cardDetails[0].AccountID}.`,
        CustomerDetails: updatedAccount[0],
     
      });
    } catch (error) {
      console.error("Error during deposit:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred during deposit.",
        error: error.message || error,
      });
    }
  };
  
//withdrawl money
const withdrawMoney = async (req, res) => {
    try {
      const { CustomerID, CardType, PIN, Amount } = req.body;
  
      // Validate input
      if (!CustomerID || !CardType || !PIN || !Amount) {
        return res.status(400).json({
          success: false,
          message: "CustomerID, CardType, PIN, and Amount are required.",
        });
      }
  
      if (Amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than zero.",
        });
      }
  
      // Validate the card details and PIN
      const [cardDetails] = await db.query(
        `SELECT ac.*, c.*, a.* FROM Customers c
         LEFT JOIN Accounts a ON c.CustomerID = a.CustomerID
         LEFT JOIN account_cards ac ON a.AccountID = ac.AccountID WHERE c.CustomerID = ?`,
        [CustomerID]
      );
  
      if (!cardDetails || cardDetails.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Invalid Customer ID ${CustomerID}.`,
        });
      }
  
      if (cardDetails[0].AccountID === null) {
        return res.status(404).json({
          success: false,
          message: `Customer with ID ${CustomerID} doesn't have an account.`,
        });
      }
  
      if (cardDetails[0].CardType.toLowerCase() !== CardType.toLowerCase()) {
        return res.status(404).json({
          success: false,
          message: `Invalid CardType ${CardType}.`,
        });
      }
  
      if (cardDetails[0].PIN !== PIN) {
        return res.status(404).json({
          success: false,
          message: `Invalid PIN.`,
        });
      }
  
      // Check if the account has sufficient balance for withdrawal
      if (cardDetails[0].Balance < Amount) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance for withdrawal.`,
        });
      }
  
      // Withdraw money (update the account balance)
      await db.query(
        "UPDATE Accounts SET Balance = Balance - ? WHERE AccountID = ?",
        [Amount, cardDetails[0].AccountID]
      );
  
      // Retrieve updated account details
      const [updatedAccount] = await db.query(
        `SELECT ac.*, c.*, a.* FROM Account_Cards ac
         JOIN Accounts a ON ac.AccountID = a.AccountID
         JOIN Customers c ON a.CustomerID = c.CustomerID WHERE ac.AccountID = ?`,
        [cardDetails[0].AccountID]
      );
  
      // Return success response with the updated balance
      return res.status(200).json({
        success: true,
        message: `Successfully withdrew ${Amount} from Account ID ${cardDetails[0].AccountID}.`,
        CustomerDetails: updatedAccount[0],
        Balance: updatedAccount[0].Balance,
      });
    } catch (error) {
      console.error("Error during withdrawal:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred during withdrawal.",
        error: error.message || error,
      });
    }
  };
  
  

  


module.exports = { createCard,getCardByAccID,getCardByCardID,updateCardPIN,deleteCard,depositMoney,withdrawMoney };
