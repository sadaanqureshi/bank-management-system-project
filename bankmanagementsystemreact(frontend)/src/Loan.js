import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const Loan = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    const { CustomerID, LoanType } = data;
//fixed
    try {
      setLoading(true);
      // Sending a POST request to create a loan
      const response = await axios.post('http://localhost:5010/api/v1/loans/create', {
        CustomerID,
        LoanType,
      });

      if (response.data.success) {
        setMessage('Loan created successfully!');
        reset(); // Reset form fields
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error creating loan. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-form">
      <h2>Create a Loan</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="customerID">Customer ID:</label>
          <input
            type="text"
            id="customerID"
            {...register('CustomerID', { required: 'Customer ID is required' })}
          />
          {errors.CustomerID && <p>{errors.CustomerID.message}</p>}
        </div>

        <div>
          <label htmlFor="loanType">Loan Type:</label>
          <input
            type="text"
            id="loanType"
            {...register('LoanType', { required: 'Loan Type is required' })}
          />
          {errors.LoanType && <p>{errors.LoanType.message}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Create Loan'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Loan;