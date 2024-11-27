import React, { useState } from 'react';
import './Form.css';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [accountType, setAccountType] = useState('Savings');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Withdrawing Amount: ₹${amount}, Account Type: ${accountType}`);
    // Add logic to handle withdrawal here
  };

  return (
    <div className="form-container">
      <h2>Withdraw Amount</h2>
      <form onSubmit={handleSubmit}>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
        <label>Account Type:</label>
        <select value={accountType} onChange={(e) => setAccountType(e.target.value)} required>
          <option value="Savings">Savings</option>
          <option value="Current">Current</option>
        </select>
        <button type="submit">Withdraw</button>
      </form>
    </div>
  );
};

export default Withdraw;