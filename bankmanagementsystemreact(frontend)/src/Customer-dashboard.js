import React from 'react';
import { useNavigate } from 'react-router-dom';
// import CustomerDetails from './CustomerDetails';
import MenuCard from './MenuCard';
import './Customer-dashboard.css';

const CustomerHome = () => {
  // Example customer data
  const customer = {
    accountNumber: '1234567890',
    accountType: 'Savings',
    balance: 25000,
  };

  const navigate = useNavigate();

  const navigateToService = (service) => {
    navigate(`/${service}`);
  };

  return (
    <div className="customer-dashboard-container">
      {/* Header Section */}
      <header className="customer-dashboard-header">
        <h1>Welcome, [Customer Name]</h1>
        <p>Your personalized dashboard</p>
      </header>

      {/* Main Content */}
      <div className="content-container">
        {/* Account Details Section */}
        <div className="account-details-card">
          <h3>Account Details</h3>
          <p><strong>Account Number:</strong> {customer.accountNumber}</p>
          <p><strong>Account Type:</strong> {customer.accountType}</p>
          <p><strong>Balance:</strong> ${customer.balance.toLocaleString()}</p>
        </div>

        {/* Services Menu Section */}
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
