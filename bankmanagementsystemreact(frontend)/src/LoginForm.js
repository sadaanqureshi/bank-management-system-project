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
    try {
      const response = await axios.post('http://localhost:5010/api/v1/auth/login', data);
      if (response.data.success) {
        const { customerID } = response.data; // Assume backend sends `customerID`
        localStorage.setItem('customerID', customerID); // Store customerID locally
        // const response = await axios.post('http://localhost:5010/api/v1/  /login', data);
        alert('Login successful!');
        navigate('/customer-dashboard');
      } else {
        alert(response.data.message || 'Invalid email or password');
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
        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
