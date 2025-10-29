import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateJob = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/jobs/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Erreur lors du chargement de l\'offre');
    }
  };

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
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/jobs/${id}`, formData);
      } else {
        await axios.post('http://localhost:8000/api/jobs', formData);
      }
      // Redirection vers la page des offres employeur
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      setError(isEditing ? 'Erreur lors de la modification de l\'offre' : 'Erreur lors de la création de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f8f9fa'}}>
      <div className="container" style={{padding: '2rem 0', maxWidth: '48rem', margin: '0 auto'}}>
        <div style={{marginBottom: '2rem'}}>
          <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#111827'}}>
            {isEditing ? 'Modifier l\'offre d\'emploi' : 'Créer une offre d\'emploi'}
          </h1>
          <p style={{color: '#6b7280', marginTop: '0.5rem'}}>
            {isEditing ? 'Modifiez les informations de votre offre' : 'Remplissez les informations de votre offre'}
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{display: 'grid', gap: '1.5rem'}}>
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                Titre du poste *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
                placeholder="Ex: Développeur Full Stack"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="company" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                Entreprise *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
                placeholder="Nom de votre entreprise"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                Localisation *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
                placeholder="Ville, Pays"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="type" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                Type de contrat *
              </label>
              <select
                id="type"
                name="type"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
                value={formData.type}
                onChange={handleChange}
              >
                <option value="full-time">Temps plein</option>
                <option value="part-time">Temps partiel</option>
                <option value="contract">CDD</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="salary" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                Salaire
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
                placeholder="Ex: 35 000€ - 45 000€ par an"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                Description du poste *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  resize: 'vertical'
                }}
                placeholder="Décrivez le poste, les missions, les compétences requises..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'}}>
              <button
                type="button"
                onClick={() => navigate('/employer/jobs')}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{opacity: loading ? 0.5 : 1}}
              >
                {loading ? (isEditing ? 'Modification...' : 'Création...') : (isEditing ? 'Modifier l\'offre' : 'Créer l\'offre')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;