import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current location is the landing page
  const isLandingPage = location.pathname === '/';

  const buttonStyles = {
    padding: '10px 20px',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        zIndex: 1000,
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        disabled={isLandingPage} // Disable the button on the landing page
        style={{
          ...buttonStyles,
          backgroundColor: isLandingPage ? '#ccc' : '#007bff',
          cursor: isLandingPage ? 'not-allowed' : 'pointer',
        }}
      >
        Back
      </button>

      {/* Home Button */}
      <button
        onClick={() => navigate('/')} // Navigate to the landing page
        style={{
          ...buttonStyles,
          backgroundColor: '#28a745',
        }}
      >
        Home
      </button>
    </div>
  );
};

export default NavigationButtons;
