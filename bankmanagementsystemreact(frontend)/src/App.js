import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Home from './Home';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AdminSignup from './AdminSignup';
import ManagerSignup from './ManagerSignup';
import CustomerHome from './Customer-dashboard';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Loan from './Loan';
import RequestATM from './RequestATM';
import ReportProblem from './ReportProblem';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Customer Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup/customer" element={<SignupForm />} />
        <Route path="/customer-dashboard" element={<CustomerHome />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/loan" element={<Loan />} />
        <Route path="/request-atm" element={<RequestATM />} />
        <Route path="/report-problem" element={<ReportProblem />} />

        {/* Admin Routes */}
        <Route path="/signup/admin" element={<AdminSignup />} />

        {/* Manager Routes */}
        <Route path="/signup/manager" element={<ManagerSignup />} />
      </Routes>
    </Router>
  );
}

export default App;

//neww
