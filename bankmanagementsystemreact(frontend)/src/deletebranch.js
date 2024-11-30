import React, { useState } from 'react';
import axios from 'axios';

const DeleteBranch = () => {
  const [branchID, setBranchID] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5010/api/v1/branches/delete/${branchID}`); // Replace with your actual API endpoint
      setMessage(response.data.message);
      setBranchID('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error deleting branch');
    }
  };

  return (
    <div>
      <h1>Delete Branch</h1>
      {message && <p>{message}</p>}
      <input
        type="text"
        placeholder="Branch ID"
        value={branchID}
        onChange={(e) => setBranchID(e.target.value)}
        required
      />
      <button onClick={handleDelete}>Delete Branch</button>
    </div>
  );
};

export default DeleteBranch;
