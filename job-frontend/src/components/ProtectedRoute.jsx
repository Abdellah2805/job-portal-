import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // ✅ CORRECTION : Le chemin de redirection doit être /connexion
    return <Navigate to="/connexion" replace />;
  }

  // NOTE : J'ai mis à jour cette logique pour simplifier la vérification.
  // Elle gère maintenant correctement les rôles comme 'user' (candidat) vs 'employer'
  const isAuthorized = allowedRoles.length === 0 || allowedRoles.some(role => user.roles?.includes(role));

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;