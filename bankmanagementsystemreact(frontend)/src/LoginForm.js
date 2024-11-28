import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Form.css';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    // Sanitize input data
    const sanitizedData = {
      CustomerID: data.CustomerID.trim(),
      Password: data.Password.trim(),
    };

    setLoading(true);

    try {
      // Send the sanitized data to the auth controller
      const response = await axios.post('http://localhost:5010/api/v1/auth/login', sanitizedData);

      // Check if login is successful
      if (response.data.success) {
        const { CustomerID, token, customerDetails } = response.data; // Destructure backend response
        localStorage.setItem('CustomerID', CustomerID); // Save CustomerID in local storage
        localStorage.setItem('token', token); // Save JWT token in local storage
        console.log('Customer Details:', customerDetails); // Log customer details (optional)
        alert('Login successful!');
        navigate('/customer-dashboard'); // Navigate to the dashboard
      } else {
        // Display error message from backend
        alert(response.data.message || 'Invalid Customer ID or Password.');
      }
    } catch (error) {
      // Handle errors (e.g., server errors, network issues)
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Customer ID:</label>
        <input
          type="text"
          placeholder="Enter your Customer ID"
          {...register('CustomerID', {
            required: 'Customer ID is required',
            pattern: {
              value: /^[0-9]+$/, // Allow only numeric Customer IDs
              message: 'Customer ID must be numeric.',
            },
          })}
        />
        {errors.CustomerID && <p className="error">{errors.CustomerID.message}</p>}

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          {...register('Password', { required: 'Password is required' })}
        />
        {errors.Password && <p className="error">{errors.Password.message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
