import React, { useState } from 'react';
import './Form.css';

const Loan = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanReason, setLoanReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Applying for Loan: ₹${loanAmount}, Reason: ${loanReason}`);
    // Add logic to handle loan application here
  };

  return (
    <div className="form-container">
      <h2>Apply for Loan</h2>
      <form onSubmit={handleSubmit}>
        <label>Loan Amount:</label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="Enter loan amount"
          required
        />
        <label>Reason:</label>
        <textarea
          value={loanReason}
          onChange={(e) => setLoanReason(e.target.value)}
          placeholder="Enter reason for loan"
          required
        />
        <button type="submit">Apply</button>
      </form>
    </div>
  );
};

export default Loan;