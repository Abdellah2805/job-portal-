// src/pages/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // La redirection sera gérée par AuthContext
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '3rem 1rem'}}>
      <div style={{maxWidth: '28rem', width: '100%'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h2>Connexion</h2>
          <p>
            Pas de compte ?{' '}
            <Link to="/register" style={{color: '#2563eb', textDecoration: 'none'}}>
              créez un nouveau compte
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{marginTop: '2rem'}}>
          {error && (
            <div className="alert alert-error" style={{marginBottom: '1rem'}}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{width: '100%', marginTop: '1rem'}}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;