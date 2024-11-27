import React from 'react';
import './CustomerDetails.css';

const CustomerDetails = ({ customer }) => {
  return (
    <div className="customer-details">
      <h2>Account Details</h2>
      <p><strong>Account Number:</strong> {customer.accountNumber}</p>
      <p><strong>Account Type:</strong> {customer.accountType}</p>
      <p><strong>Balance:</strong> ₹{customer.balance}</p>
    </div>
  );
};

export default CustomerDetails;
