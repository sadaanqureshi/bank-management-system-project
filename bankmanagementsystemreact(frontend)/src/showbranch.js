import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowBranch = () => {
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://localhost:5010/api/v1/branches/getall'); // Replace with your actual API endpoint
        setBranches(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching branches');
      }
    };

    fetchBranches();
  }, []);

  return (
    <div>
      <h1>Branches List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {branches.map((branch) => (
          <li key={branch.BranchID}>
            <h3>{branch.BranchName}</h3>
            <p>Location: {branch.Location}</p>
            <p>Phone: {branch.Phone}</p>
            <p>Total Employees: {branch.TotalEmployees}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowBranch;
