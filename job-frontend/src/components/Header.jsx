// src/components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const getDashboardLink = () => {
    if (!user?.roles) return '/';
    
    const userRoles = Array.isArray(user.roles) 
      ? user.roles 
      : [user.roles].filter(Boolean);

    if (userRoles.includes('employer')) {
      return '/employer/dashboard';
    }
    if (userRoles.includes('admin')) {
      return '/admin/dashboard';
    }
    
    return '/my-applications';
  };

  return (
    <header className="header">
      <div className="container flex justify-between items-center">
        {/* Logo/Nom de l'application */}
        <Link to="/" className="logo">
          JobPortal
        </Link>

        <nav className="nav-links">
          {/* Lien "Offres d'Emploi" visible pour tous */}
          <Link to="/jobs" className="nav-item">
            Offres d'Emploi
          </Link>

          {!user ? (
            // --- Utilisateur Déconnecté ---
            <div className="btn-group"> 
              <Link to="/connexion" className="btn btn-secondary"> 
                Se connecter
              </Link>
              <Link to="/register" className="btn btn-primary">
                S'inscrire
              </Link>
            </div>
          ) : (
            // --- Utilisateur Connecté ---
            <div className="flex items-center space-x-4">
              <span style={{color: '#6b7280', whiteSpace: 'nowrap'}}>Bonjour, {user.name}</span>

              {/* ✅ Le lien "Mon Espace" utilise la fonction corrigée */}
              <Link to={getDashboardLink()} className="btn btn-secondary">
                Mon Espace
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                Déconnexion
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;