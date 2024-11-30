import React, { useState } from 'react';
import axios from 'axios';

const AddBranch = () => {
  const [formData, setFormData] = useState({
    BranchID: '',
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
      const response = await axios.post('http://localhost:5010/api/v1/branches/create', formData); // Replace with your actual API endpoint
      setMessage(response.data.message);
      setFormData({ BranchID: '', BranchName: '', Location: '', Phone: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding branch');
    }
  };

  return (
    <div>
      <h1>Add Branch</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="BranchID"
          placeholder="Branch ID"
          value={formData.BranchID}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="BranchName"
          placeholder="Branch Name"
          value={formData.BranchName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Location"
          placeholder="Location"
          value={formData.Location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Phone"
          placeholder="Phone"
          value={formData.Phone}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Branch</button>
      </form>
    </div>
  );
};

export default AddBranch;
