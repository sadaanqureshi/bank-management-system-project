import React from 'react';
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

  const onSubmit = async (data) => {
    const sanitizedData = {
      CustomerID: data.CustomerID,
      Password: data.Password,
    };

    

    try {
      const response = await axios.post('http://localhost:5010/api/v1/auth/login', sanitizedData);
      if (response.data.success) {
        const { CustomerID } = response.data; // Backend sends CustomerID
        localStorage.setItem('CustomerID', CustomerID); // Store CustomerID locally
        console.log('Customer ID:', CustomerID);
        alert('Login successful!');
        navigate('/customer-dashboard');
      } else {
        alert(response.data.message || 'Invalid customer ID or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert(error.response?.data?.message || 'Error logging in');
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
              value: /^[0-9]+$/, // Only allow numeric customer IDs
              message: 'Invalid Customer ID',
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

        <button type="submit">Login</button>
      </form>

    </div>
  );
};

export default LoginForm;
