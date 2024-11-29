import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowEmployees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5010/api/v1/employees/getall');
        setEmployees(response.data.data);
      } catch (error) {
        alert(error.response?.data?.message || 'Error fetching employees');
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <h1>All Employees</h1>
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
