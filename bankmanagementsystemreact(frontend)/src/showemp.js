import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const ShowEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm();

//   Fetch all employees
  const fetchAllEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5010/api/v1/employees/getall');
      setEmployees(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching employees.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employee by ID
  const fetchEmployeeByID = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5010/api/v1/employees//getbyeid/${data.searchValue}`);
      setEmployees([response.data.data]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching employee by ID.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees by BranchID
  const fetchEmployeesByBranchID = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5010/api/v1/employees/getbybid/${data.searchValue}`);
      setEmployees(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching employees by BranchID.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const onSubmit = async (data) => {
    reset(); // Clear form after submission
    if (data.searchType === 'all') {
      fetchAllEmployees();
    } else if (data.searchType === 'employee') {
      fetchEmployeeByID(data);
    } else if (data.searchType === 'branch') {
      fetchEmployeesByBranchID(data);
    }
  };

  return (
    <div>
      <h1>Employee Management</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Search Type:</label>
          <select {...register('searchType')} defaultValue="all">
            <option value="all">All Employees</option>
            <option value="employee">Employee by ID</option>
            <option value="branch">Employees by BranchID</option>
          </select>
        </div>
        <div>
          <label>Search Value:</label>
          <input type="text" {...register('searchValue')} placeholder="Enter ID or BranchID" />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {employees.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Hire Date</th>
              <th>Branch ID</th>
              <th>Branch Name</th>
              <th>Branch Location</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.EmployeeID}>
                <td>{employee.EmployeeID}</td>
                <td>{employee.FirstName}</td>
                <td>{employee.LastName}</td>
                <td>{employee.Position}</td>
                <td>{employee.Salary}</td>
                <td>{employee.HireDate}</td>
                <td>{employee.BranchID}</td>
                <td>{employee.BranchName}</td>
                <td>{employee.BranchLocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees found.</p>
      )}
    </div>
  );
};

export default ShowEmployees;
