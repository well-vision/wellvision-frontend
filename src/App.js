import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import SendVerifyOtp from './components/SendVerifyOtp';
import VerifyOtp from './components/VerifyEmail';

import DashboardRoutes from './DashboardRoutes';

import AdminLayout from './admin_scenes/layout'; // ✅ Use this only
import AdminDashboard from './admin_scenes/dashboard';
import Products from './admin_scenes/products';
import Customers from './admin_scenes/customers';
import Transactions from './admin_scenes/transactions';
import Geography from './admin_scenes/geography';
import Overview from './admin_scenes/overview';
import Daily from './admin_scenes/daily';
import Monthly from './admin_scenes/monthly';
import Breakdown from './admin_scenes/breakdown';
import Admins from './admin_scenes/admin';
import Performance from './admin_scenes/performance';

import { AuthContext } from './context/AuthContext';

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/send-verify-otp" element={<SendVerifyOtp />} />
        <Route path="/verify-email" element={<VerifyOtp />} />

        {/* Admin Routes */}
        {user?.email === 'admin@example.com' && (
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/transactions" element={<Transactions />} />
            <Route path="/admin/geography" element={<Geography />} />
            <Route path="/admin/overview" element={<Overview />} />
            <Route path="/admin/daily" element={<Daily />} />
            <Route path="/admin/monthly" element={<Monthly />} />
            <Route path="/admin/breakdown" element={<Breakdown />} />
            <Route path="/admin/admins" element={<Admins />} />
            <Route path="/admin/performance" element={<Performance />} />
          </Route>
        )}

        {/* Normal User Routes */}
        <Route path="/*" element={<DashboardRoutes />} />
      </Routes>
    </Router>
  );
}
