import React, { useState } from 'react';
import './Form.css';

const Deposit = () => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Depositing Amount: ₹${amount}`);
    // Add logic to handle deposit here
  };

  return (
    <div className="form-container">
      <h2>Deposit Amount</h2>
      <form onSubmit={handleSubmit}>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
        <button type="submit">Deposit</button>
      </form>
    </div>
  );
};

export default Deposit;
