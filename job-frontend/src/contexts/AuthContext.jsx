// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Restaurer l'utilisateur du localStorage
          const parsedUser = JSON.parse(savedUser);

          // Configurer Axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Vérifier la validité du token
          const response = await axios.get('http://localhost:8000/api/user');

          // Mettre à jour l'utilisateur avec les données les plus récentes
          const updatedUser = {
            ...parsedUser,
            ...response.data,
            roles: response.data.roles || parsedUser.roles
          };

          setUser(updatedUser);

          // Ne rediriger QUE si on est sur les pages publiques au chargement initial
          const publicPaths = ['/', '/connexion', '/register', '/jobs'];
          const isOnPublicPage = publicPaths.includes(window.location.pathname);

          if (isOnPublicPage) {
            handleRoleBasedRedirect(updatedUser);
          }
          // Si on est déjà sur une page protégée, ne pas rediriger

        } catch (error) {
          console.error('Error checking auth:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []); // Retirer navigate des dépendances pour éviter les re-renders

  const handleRoleBasedRedirect = (userData) => {
    console.log('Handling redirect for user:', userData); // Pour le débogage

    if (!userData || !userData.roles) {
      console.error('No user data or roles found');
      return;
    }

    // Extraire les noms des rôles (gérer les objets role ou les strings)
    const userRoles = Array.isArray(userData.roles)
      ? userData.roles.map(role => typeof role === 'object' ? role.name : role).filter(Boolean)
      : [userData.roles].filter(Boolean);

    console.log('User roles for redirect:', userRoles); // Pour le débogage

    try {
      if (userRoles.includes('admin')) {
        console.log('Redirecting to admin dashboard');
        navigate('/admin', { replace: true });
      } else if (userRoles.includes('employer')) {
        console.log('Redirecting to employer dashboard');
        navigate('/employer', { replace: true });
      } else {
        console.log('Redirecting to user applications');
        navigate('/my-applications', { replace: true });
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response.data); // Pour le débogage

      const { access_token, user: userData, roles } = response.data;

      if (!access_token || !userData) {
        throw new Error('Réponse invalide du serveur');
      }

      // Assurons-nous que nous avons les rôles correctement formatés
      const userWithRoles = {
        ...userData,
        roles: roles || userData.roles || []
      };

      // Stockage du token
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userWithRoles));

      // Configuration d'Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Mise à jour de l'état utilisateur
      setUser(userWithRoles);

      console.log('User set with roles:', userWithRoles); // Pour le débogage

      // Redirection selon le rôle UNIQUEMENT après connexion réussie
      handleRoleBasedRedirect(userWithRoles);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Échec de la connexion'
      };
    }
  };

  const register = async (name, email, password, password_confirmation, role) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', {
        name,
        email,
        password,
        password_confirmation,
        role,
      });

      const { user: userData, access_token, roles } = response.data;

      // Assurons-nous que nous avons les rôles correctement formatés
      const userWithRoles = {
        ...userData,
        roles: roles || userData.roles || []
      };

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userWithRoles));
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(userWithRoles);

      handleRoleBasedRedirect(userWithRoles);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Échec de l\'inscription'
      };
    }
  };

  const logout = () => {
    // Nettoyer immédiatement le localStorage et l'état
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);

    // Faire la requête de logout en arrière-plan (sans bloquer)
    axios.post('http://localhost:8000/api/auth/logout').catch(error => {
      console.error('Logout error:', error);
    });

    // Rediriger immédiatement
    navigate('/', { replace: true });
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('http://localhost:8000/api/user');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};