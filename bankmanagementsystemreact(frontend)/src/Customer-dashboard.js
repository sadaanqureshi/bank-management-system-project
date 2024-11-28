import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios to make API calls
import './Customer-dashboard.css'; // Ensure proper styling
import CustomerDetails from './CustomerDetails'; // Import the CustomerDetails component
import Login from './LoginForm'; // Import the CustomerDetails component
import MenuCard from './MenuCard';

const CustomerDashboard = () => {
  const [customer, setCustomer] = useState(null); // State to store customer data
  const navigate = useNavigate();
  // const CustomerID = localStorage.getItem('CustomerID'); // Retrieve the logged-in customer's ID
  const CustomerID = localStorage.getItem('CustomerID'); // Retrieve CustomerID from local storage

  console.log('Customer ID:', CustomerID);
  useEffect(() => {
    if (!CustomerID) {
      alert('You need to log in first!');
      navigate('/login');
      return;
    }
    console.log('Customer ID:', CustomerID);
    // Fetch customer details using the API endpoint
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`http://localhost:5010/api/v1/customers/get/${CustomerID}`);
        console.log('Customer details response:', response.data);
        if (response.data.success) {
          setCustomer(response.data.data); // Set the customer data from the API response
        } else {
          alert('No customer details found! Please log in again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching customer details:', error);
        alert('Error fetching customer details');
        navigate('/login');
      }
    };

    fetchCustomerData();
  }, [CustomerID, navigate]);

  const navigateToService = (service) => {
    navigate(`/${service}`);
  };

  if (!customer) {
    return <div>Loading...</div>; // Show a loading state while setting customer data
  }

  return (
    <div className="customer-dashboard-container">
      <header className="customer-dashboard-header">
        <h1>Welcome, {customer.FirstName} {customer.LastName}</h1>
        <p>Your personalized dashboard</p>
      </header>

      <div className="content-container">
        {/* Customer Details Component */}
        <CustomerDetails customer={customer} />

        {/* Action Buttons */}
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

export default CustomerDashboard;
