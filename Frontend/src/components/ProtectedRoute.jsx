import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const adminInfoStr = localStorage.getItem('adminInfo');
  let isAuthenticated = false;

  if (adminInfoStr) {
    try {
      const adminInfo = JSON.parse(adminInfoStr);
      if (adminInfo && adminInfo.token) {
        isAuthenticated = true;
      }
    } catch (e) {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;