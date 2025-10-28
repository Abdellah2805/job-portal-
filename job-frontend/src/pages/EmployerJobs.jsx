// src/pages/EmployerJobs.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
    
      const response = await axios.get('http://localhost:8000/api/employer/jobs'); 
      setJobs(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/jobs/${jobId}`);
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="loading-state">Chargement de votre espace de gestion...</div>;
  }

  return (
    <div className="container page-content"> 
      <div className="dashboard-header flex justify-between items-center mb-4">
        <h1 className="section-title">Espace Employeur : Mes Offres d'Emploi</h1>
        <Link 
          to="/employer/create" 
          className="btn btn-primary" // Le bouton pour créer une offre
        >
          ➕ Créer une nouvelle offre
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="empty-state-message text-center mt-8">
          Vous n'avez pas encore publié d'offres. Cliquez sur "Créer une nouvelle offre" pour commencer.
        </p>
      ) : (
        <div className="job-management-list">
          <ul className="list-group space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="job-card list-item p-4 border rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-1">
                      {job.title}
                    </h2>
                    <div className="text-sm text-gray-600 mb-1">
                      <span>{job.location}</span>
                      <span className="mx-2">•</span>
                      <span>{job.type}</span>
                      <span className="mx-2">•</span>
                      <span>{job.applications_count || 0} candidature{job.applications_count !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/employer/jobs/${job.id}/applications`}
                      className="btn btn-secondary btn-small"
                    >
                      Voir Candidatures
                    </Link>
                    <Link
                      to={`/employer/jobs/${job.id}/edit`}
                      className="btn btn-link btn-small"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="btn btn-danger btn-small"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmployerJobs;