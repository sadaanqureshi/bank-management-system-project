import React, { useState } from 'react';
import axios from 'axios';

const UpdateBranch = () => {
  const [branchID, setBranchID] = useState('');
  const [formData, setFormData] = useState({
    BranchName: '',
    Location: '',
    Phone: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5010/api/v1/branches/update/${branchID}`, formData); // Replace with your actual API endpoint
      setMessage(response.data.message);
      setBranchID('');
      setFormData({ BranchName: '', Location: '', Phone: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating branch');
    }
  };

  return (
    <div>
      <h1>Update Branch</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Branch ID"
          value={branchID}
          onChange={(e) => setBranchID(e.target.value)}
          required
        />
        <input
          type="text"
          name="BranchName"
          placeholder="Branch Name"
          value={formData.BranchName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Location"
          placeholder="Location"
          value={formData.Location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Phone"
          placeholder="Phone"
          value={formData.Phone}
          onChange={handleChange}
        />
        <button type="submit">Update Branch</button>
      </form>
    </div>
  );
};

export default UpdateBranch;
