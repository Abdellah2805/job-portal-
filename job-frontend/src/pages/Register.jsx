import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'candidate',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
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

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.password_confirmation,
      formData.role
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '3rem 1rem'}}>
      <div style={{maxWidth: '28rem', width: '100%'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h2 style={{fontSize: '1.875rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem'}}>
            Créer un compte
          </h2>
          <p style={{color: '#6b7280', fontSize: '0.875rem'}}>
            Ou{' '}
            {/* ✅ CORRECTION : Le chemin de connexion doit être /connexion */}
            <Link to="/connexion" style={{color: '#2563eb', textDecoration: 'none'}}>
              connectez-vous à votre compte existant
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
            <label htmlFor="name">Nom complet</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Nom complet"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              required
              placeholder="Confirmer le mot de passe"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rôle</label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
            >
              {/* J'ai corrigé 'candidate' par 'user' et 'employer' pour correspondre à la logique de rôle de Laravel/API si 'user' est le candidat par défaut */}
              <option value="user">Candidat</option> 
              <option value="employer">Employeur</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{width: '100%', marginTop: '1rem'}}
          >
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;