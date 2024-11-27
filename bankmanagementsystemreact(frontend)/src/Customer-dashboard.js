import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Customer-dashboard.css';
import MenuCard from './MenuCard';

const CustomerHome = () => {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const customerID = localStorage.getItem('customerID'); // Retrieve the logged-in customer's ID
      if (!customerID) {
        alert('You need to log in first!');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5010/api/v1/customers/${customerID}`);
        if (response.data.success) {
          setCustomer(response.data.data); // Set customer data
        } else {
          alert('Failed to fetch customer details');
        }
      } catch (error) {
        console.error('Error fetching customer details:', error);
        alert('Error fetching customer details');
      }
    };

    fetchCustomerDetails();
  }, [navigate]);

  const navigateToService = (service) => {
    navigate(`/${service}`);
  };

  if (!customer) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="customer-dashboard-container">
      <header className="customer-dashboard-header">
        <h1>Welcome, {customer.FirstName} {customer.LastName}</h1>
        <p>Your personalized dashboard</p>
      </header>

      <div className="content-container">
        <div className="account-details-card">
          <h3>Account Details</h3>
          <p><strong>Account Number:</strong> {customer.CustomerID}</p>
          <p><strong>Account Type:</strong> {customer.AccountType || 'Not Available'}</p>
          <p><strong>Balance:</strong> ₹{customer.Balance?.toLocaleString() || '0'}</p>
          <p><strong>Email:</strong> {customer.Email}</p>
          <p><strong>Phone:</strong> {customer.Phone}</p>
        </div>

        <div className="buttons-card">
          <h3>Actions</h3>
          <div className="menu-card-grid">
            <MenuCard title="Deposit Amount" onClick={() => navigateToService('deposit')} />
            <MenuCard title="Withdraw Amount" onClick={() => navigateToService('withdraw')} />
            <MenuCard title="Apply for Loan" onClick={() => navigateToService('loan')} />
            <MenuCard title="Request ATM Card" onClick={() => navigateToService('request-atm')} />
            <MenuCard title="Report a Problem" onClick={() => navigateToService('report-problem')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;

//newst