import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Home from './Home';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AdminLogin from './AdminLogin';
import ManagerSignup from './ManagerSignup';
import CustomerHome from './Customer-dashboard';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Loan from './Loan';
import RequestATM from './RequestATM';
import ReportProblem from './ReportProblem';
import DeleteAccount from './deleteAccount';
import Admindashboard from './Admindashboard';
import AddEmployee from './addemp'; // Add Employee Component
import DeleteEmployee from './delemp'; // Delete Employee Component
import UpdateEmployee from './updateemp'; // Update Employee Component
import ShowEmployees from './showemp'; // Show Employees Component

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
        <Route path="/deleteAccount" element={<DeleteAccount />} />

        {/* Admin Routes */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<Admindashboard />} />
        <Route path="/admindashboard/add" element={<AddEmployee />} />
        <Route path="/admindashboard/delete" element={<DeleteEmployee />} />
        <Route path="/admindashboard/update" element={<UpdateEmployee />} />
        <Route path="/admindashboard/show" element={<ShowEmployees />} />

        {/* Manager Routes */}
        <Route path="/signup/manager" element={<ManagerSignup />} />
      </Routes>
    </Router>
  );
}

export default App;
