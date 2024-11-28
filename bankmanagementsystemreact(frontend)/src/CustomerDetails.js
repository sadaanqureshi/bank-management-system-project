import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerDetails.css';

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null); // State to store the customer data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const CustomerID = localStorage.getItem('CustomerID'); // Retrieve the logged-in customer's ID

      if (!CustomerID) {
        setError('You need to log in first!');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5010/api/v1/customers/get/${CustomerID}`);
        console.log('Customer details response:', response.data);

        if (response.data.success) {
          setCustomer(response.data.data); // Set the customer data
          // Store the customer data in localStorage
          localStorage.setItem('customerDetails', JSON.stringify(response.data.data)); 
          console.log('Customer details stored in localStorage:', response.data.data); // Logging for debugging
        } else {
          setError('Failed to fetch customer details');
        }
      } catch (error) {
        setError('Error fetching customer details');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCustomerDetails();
  }, []); // Empty dependency array ensures this runs once on component mount

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there was a problem
  }

  if (!customer) {
    return <div>No customer data found!</div>; // Fallback if customer data is not available
  }

  return (
    <div className="customer-details">
      <h2>Account Details</h2>
      <p><strong>Account Number:</strong> {customer.CustomerID}</p>
      <p><strong>Account Type:</strong> {customer.AccountType || 'Not Available'}</p>
      <p><strong>Balance:</strong> ₹{customer.Balance?.toLocaleString() || '0'}</p>
      <p><strong>Email:</strong> {customer.Email}</p>
      <p><strong>Phone:</strong> {customer.Phone}</p>
    </div>
  );
};

export default CustomerDetails;
