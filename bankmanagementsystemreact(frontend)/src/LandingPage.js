// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './LandingPage.css';

// const LandingPage = () => {
//   const navigate = useNavigate();

//   const handleUserTypeSelection = (userType) => {
//     switch (userType) {
//       case 'customer':
//         navigate('/signup/customer');
//         break;
//       case 'admin':
//         navigate('/signup/admin');
//         break;
//       case 'manager':
//         navigate('/signup/manager');
//         break;
//       default:
//         console.error('Invalid user type selected');
//     }
//   };

//   return (
//     <div className="landing-page">
//       <h1>Welcome! Select User Type</h1>
//       <div className="user-options">
//         <button onClick={() => handleUserTypeSelection('customer')}>Customer</button>
//         <button onClick={() => handleUserTypeSelection('admin')}>Admin</button>
//         <button onClick={() => handleUserTypeSelection('manager')}>Manager</button>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-header">
        <h1>Welcome to Our Platform</h1>
        <p>Please select your user type to proceed</p>
      </div>
      <div className="landing-buttons">
        <button onClick={() => navigate('/signup/customer')} className="landing-button customer">
          Customer
        </button>
        <button onClick={() => navigate('/login/admin')} className="landing-button admin">
          Admin
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
