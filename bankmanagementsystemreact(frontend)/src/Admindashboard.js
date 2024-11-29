import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AdminDashboard = () => {
  const { register, handleSubmit, reset } = useForm();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch all employees
  const fetchAllEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data.data);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching employees');
    }
  };

  // Fetch employee by ID
  const fetchEmployeeByID = async (id) => {
    try {
      const response = await axios.get(`/api/employees/${id}`);
      setSelectedEmployee(response.data.data);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching employee');
    }
  };

  // Add a new employee
  const addEmployee = async (data) => {
    try {
      const response = await axios.post('/api/employees', data);
      setMessage(response.data.message);
      fetchAllEmployees();
      reset();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding employee');
    }
  };

  // Update an employee
  const updateEmployee = async (data) => {
    try {
      const response = await axios.put(`/api/employees/${data.EmployeeID}`, data);
      setMessage(response.data.message);
      fetchAllEmployees();
      reset();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating employee');
    }
  };

  // Delete an employee
  const deleteEmployee = async (id) => {
    try {
      const response = await axios.delete(`/api/employees/${id}`);
      setMessage(response.data.message);
      fetchAllEmployees();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting employee');
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Add or Update Employee</h2>
      <form onSubmit={handleSubmit(addEmployee)}>
        <input {...register('EmployeeID')} placeholder="Employee ID" required />
        <input {...register('FirstName')} placeholder="First Name" required />
        <input {...register('LastName')} placeholder="Last Name" required />
        <input {...register('Position')} placeholder="Position" required />
        <input {...register('Salary')} placeholder="Salary" required type="number" />
        <input {...register('HireDate')} placeholder="Hire Date" required type="date" />
        <input {...register('BranchID')} placeholder="Branch ID" required />
        <button type="submit">Add Employee</button>
        <button type="button" onClick={handleSubmit(updateEmployee)}>
          Update Employee
        </button>
      </form>

      <h2>Employee List</h2>
      <button onClick={fetchAllEmployees}>Show All Employees</button>
      {employees.length > 0 && (
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
              <th>Actions</th>
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
                <td>
                  <button onClick={() => fetchEmployeeByID(employee.EmployeeID)}>
                    View
                  </button>
                  <button onClick={() => deleteEmployee(employee.EmployeeID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedEmployee && (
        <div>
          <h3>Selected Employee Details</h3>
          <p>ID: {selectedEmployee.EmployeeID}</p>
          <p>Name: {selectedEmployee.FirstName} {selectedEmployee.LastName}</p>
          <p>Position: {selectedEmployee.Position}</p>
          <p>Salary: {selectedEmployee.Salary}</p>
          <p>Hire Date: {selectedEmployee.HireDate}</p>
          <p>Branch ID: {selectedEmployee.BranchID}</p>
        </div>
      )}

      <p>{message}</p>
    </div>
  );
};

export default AdminDashboard;
