import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ element }) => {
  const [redirect, setRedirect] = useState(false);
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You need to log in to access this page.");
        setRedirect(true);
    }
  }, [isAuthenticated]);

  if (redirect) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;