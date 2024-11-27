import React, { useState } from 'react';
import './Form.css';

const ReportProblem = () => {
  const [name, setName] = useState('');
  const [problem, setProblem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Problem Reported by: ${name}, Problem: ${problem}`);
    // Add logic to handle problem reporting here
  };

  return (
    <div className="form-container">
      <h2>Report a Problem</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
        <label>Problem:</label>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe the problem"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ReportProblem;