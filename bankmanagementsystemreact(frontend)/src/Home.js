import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="home-container">
      <header className="bank-name">Bank Management System</header>
      <div className="card-container">
        <h2>Welcome</h2>
        <p>Please choose an option to continue:</p>
        <div className="button-group">
          <Button text="Login" onClick={handleLogin} />
          <Button text="Signup" onClick={handleSignup} />
        </div>
      </div>
    </div>
  );
};

export default Home;
