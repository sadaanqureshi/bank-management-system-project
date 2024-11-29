import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admindashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
        <button onClick={() => navigate('/admindashboard/add')} style={buttonStyle}>
          Add Employee
        </button>
        <button onClick={() => navigate('/admindashboard/delete')} style={buttonStyle}>
          Delete Employee
        </button>
        <button onClick={() => navigate('/admindashboard/update')} style={buttonStyle}>
          Update Employee
        </button>
        <button onClick={() => navigate('/admindashboard/show')} style={buttonStyle}>
          Show Employees
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#007BFF',
  color: '#FFF',
  width: '200px',
};

export default Admindashboard;
