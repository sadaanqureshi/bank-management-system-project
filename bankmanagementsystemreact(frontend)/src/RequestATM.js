import React, { useState } from 'react';
import './Form.css';

const RequestATM = () => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`ATM Card Requested by: ${name}`);
    // Add logic to handle ATM request here
  };

  return (
    <div className="form-container">
      <h2>Request ATM Card</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
        <button type="submit">Request</button>
      </form>
    </div>
  );
};

export default RequestATM;