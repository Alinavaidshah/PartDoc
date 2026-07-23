import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store'; 

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SyncUser from './components/SyncUser'; 
import ProtectedRoute from './components/ProtectedRoute'; // Yahan tumhara ProtectedRoute import hua hai

// Pages
import Home from './pages/Home'; 
import Appointment from './pages/Appointment'; 
import MobileParts from './pages/MobileParts';
import ProductDetails from './pages/ProductDetails';
import ComputerParts from './pages/ComputerParts';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin Imports
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminAppointment from './pages/Admin/AdminAppointment';
import AdminOrder from './pages/Admin/AdminOrder';
import AdminInventory from './pages/Admin/AdminInventory'; 
import AdminCustomers from './pages/Admin/AdminCustomers';

import './index.css';

function App() {
  return (
    <Provider store={store}>
      <SyncUser /> 

      <Router>
        <Routes>
    
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Routes: Sirf login ke baad access honge */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/appointments" element={
            <ProtectedRoute><AdminAppointment /></ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute><AdminOrder /></ProtectedRoute>
          } />
          <Route path="/admin/inventory" element={
            <ProtectedRoute><AdminInventory /></ProtectedRoute>
          } /> 
          <Route path="/admin/customers" element={
            <ProtectedRoute><AdminCustomers /></ProtectedRoute>
          } />

          {/* Main Website Routes */}
          <Route path="*" element={
            <div className="min-h-screen bg-[#0a0a0f]">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/mobileparts" element={<MobileParts />} />
                <Route path="/computerparts" element={<ComputerParts/>} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
              </Routes>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;