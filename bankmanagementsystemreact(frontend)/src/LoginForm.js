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
    const sanitizedData = {
      CustomerID: data.CustomerID.trim(),
      Password: data.Password.trim(),
    };
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5010/api/v1/auth/login', sanitizedData);
      console.log('Login response:', response.data);
  
      if (response.data.success) {
        const { token, customer } = response.data; // Destructure `customer` object from response
        const CustomerID = customer.id; // Extract `CustomerID` from `customer.id`
        
        // Save data to local storage
        localStorage.setItem('CustomerID', CustomerID);
        localStorage.setItem('token', token);
        
        // Log the extracted values
        console.log('Customer ID:', CustomerID);
        console.log('Customer Details:', customer);
  
        alert('Login successful!');
        navigate('/customer-dashboard'); // Navigate to dashboard
      } else {
        alert(response.data.message || 'Invalid Customer ID or Password.');
      }
    } catch (error) {
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
