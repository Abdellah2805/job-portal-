import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  // Rafraîchir les données quand on revient sur la page (après création/modification)
  useEffect(() => {
    const handleFocus = () => {
      fetchJobs();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/jobs/mine');
      setJobs(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f8f9fa'}}>
      <div className="container" style={{padding: '2rem 0'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <div>
            <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#111827'}}>Mes offres d'emploi</h1>
            <p style={{color: '#6b7280', marginTop: '0.5rem'}}>Gérez vos offres d'emploi</p>
          </div>
          <Link
            to="/employer/jobs/create"
            className="btn btn-primary"
          >
            Nouvelle offre
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem'}}>
            <svg style={{width: '3rem', height: '3rem', color: '#9ca3af', margin: '0 auto'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 style={{marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>Aucune offre</h3>
            <p style={{marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280'}}>
              Créez votre première offre d'emploi.
            </p>
          </div>
        ) : (
          <div className="card">
            <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
              {jobs.map((job) => (
                <li key={job.id} style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{flex: 1}}>
                      <h3 style={{fontSize: '1.125rem', fontWeight: '500', color: '#111827'}}>
                        {job.title}
                      </h3>
                      <div style={{marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        <span>{job.location}</span>
                        <span style={{margin: '0 0.5rem'}}>•</span>
                        <span>{job.type}</span>
                        <span style={{margin: '0 0.5rem'}}>•</span>
                        <span>{job.applications_count || 0} candidature{job.applications_count !== 1 ? 's' : ''}</span>
                      </div>
                      <div style={{marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        Créée le {new Date(job.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <Link
                        to={`/employer/jobs/${job.id}/edit`}
                        style={{color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500'}}
                        onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                        onMouseLeave={(e) => e.target.style.color = '#2563eb'}
                      >
                        Modifier
                      </Link>
                      <Link
                        to={`/employer/jobs/${job.id}/applications`}
                        style={{color: '#16a34a', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500'}}
                        onMouseEnter={(e) => e.target.style.color = '#15803d'}
                        onMouseLeave={(e) => e.target.style.color = '#16a34a'}
                      >
                        Candidatures
                      </Link>
                      <button
                        onClick={() => deleteJob(job.id)}
                        style={{color: '#dc2626', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer'}}
                        onMouseEnter={(e) => e.target.style.color = '#b91c1c'}
                        onMouseLeave={(e) => e.target.style.color = '#dc2626'}
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
    </div>
  );
};

export default EmployerJobs;