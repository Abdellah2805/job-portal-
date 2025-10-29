import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" state={{ from: window.location.pathname }} replace />;
  }

  const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles].filter(Boolean);
  const isAuthorized = allowedRoles.length === 0 || allowedRoles.some(role => userRoles.includes(role));

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;