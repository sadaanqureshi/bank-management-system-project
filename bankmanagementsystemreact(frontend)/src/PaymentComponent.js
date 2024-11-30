import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const PaymentComponent = () => {
  const { register, handleSubmit, reset } = useForm();
  const [allPayments, setAllPayments] = useState([]);
  const [paymentsByCustomer, setPaymentsByCustomer] = useState([]);
  const [customerID, setCustomerID] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all payments
  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5010/api/v1/payments/getall'); // Update with your backend route
      setAllPayments(response.data.payments || []);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setMessage(error.response?.data?.message || 'Error fetching payments.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch payments by Customer ID
  const fetchPaymentsByCustomer = async () => {
    if (!customerID) {
      alert('Please enter a valid Customer ID.');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5010/api/v1/payments/get/${customerID}`); // Update with your backend route
      setPaymentsByCustomer(response.data.payments || []);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error fetching payments by Customer ID:', error);
      setMessage(error.response?.data?.message || 'Error fetching payments.');
    } finally {
      setLoading(false);
    }
  };

  // Handle payment creation
  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5010/api/v1/payments/create', data);
      setMessage(response.data.message);
      reset();
      fetchAllPayments();
    } catch (error) {
      console.error('Error creating payment:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Error creating payment.');
    } finally {
      setLoading(false);
    }
  };
  

  // Initial fetch of all payments
  useEffect(() => {
    fetchAllPayments();
  }, []);

  return (
    <div className="payment-container">
      <h1>Payment Management</h1>

      {/* Form to Create a Payment */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Create a Payment</h2>
        <div>
          <label>Loan ID:</label>
          <input type="text" {...register('LoanID', { required: true })} />
        </div>
        <div>
          <label>Amount:</label>
          <input type="number" {...register('Amount', { required: true, min: 1 })} />
        </div>
        <div>
          <label>Payment Method:</label>
          <select {...register('PaymentMethod', { required: true })}>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </form>

      {/* Form to Fetch Payments by Customer ID */}
      <div>
        <h2>Fetch Payments by Customer ID</h2>
        <input
          type="text"
          placeholder="Enter Customer ID"
          value={customerID}
          onChange={(e) => setCustomerID(e.target.value)}
        />
        <button onClick={fetchPaymentsByCustomer} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Payments'}
        </button>
      </div>

      {/* Display Payments */}
      <div>
        <h2>All Payments</h2>
        {allPayments.length > 0 ? (
          <ul>
            {allPayments.map((payment) => (
              <li key={payment.PaymentID}>
                PaymentID: {payment.PaymentID}, LoanID: {payment.LoanID}, Amount: {payment.PaymentAmount}, Date: {payment.PaymentDate}
              </li>
            ))}
          </ul>
        ) : (
          <p>No payments found.</p>
        )}
      </div>

      <div>
        <h2>Payments by Customer</h2>
        {paymentsByCustomer.length > 0 ? (
          <ul>
            {paymentsByCustomer.map((payment) => (
              <li key={payment.PaymentID}>
                PaymentID: {payment.PaymentID}, LoanID: {payment.LoanID}, Amount: {payment.PaymentAmount}, Date: {payment.PaymentDate}
              </li>
            ))}
          </ul>
        ) : (
          <p>No payments found for Customer ID {customerID}.</p>
        )}
      </div>

      {/* Message Display */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentComponent;
