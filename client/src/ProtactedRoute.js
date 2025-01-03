import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('token');  

  if (!isAuthenticated) {
    toast.error("You need to log in to access this page.");
    return <Navigate to="/login" />;
  }
  return element;
};

export default ProtectedRoute;
