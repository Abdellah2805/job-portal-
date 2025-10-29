import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/jobs');
      setJobs(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (jobId) => {
    try {
      await axios.post(`http://localhost:8000/api/applications/job-offers/${jobId}`);
      alert('Candidature envoyée avec succès !');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Erreur lors de la candidature');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesCompany = !companyFilter || job.company.toLowerCase().includes(companyFilter.toLowerCase());

    return matchesSearch && matchesLocation && matchesCompany;
  });

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
        <div style={{marginBottom: '2rem'}}>
          <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>Offres d'emploi</h1>

          {/* Search and Filters */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                  Recherche
                </label>
                <input
                  type="text"
                  placeholder="Titre, mots-clés..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Ville, région..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                  Entreprise
                </label>
                <input
                  type="text"
                  placeholder="Nom de l'entreprise..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div style={{display: 'grid', gap: '1.5rem'}}>
          {filteredJobs.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem'}}>
              <p style={{color: '#6b7280', fontSize: '1.125rem'}}>Aucune offre trouvée</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="card" style={{cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: 1}}>
                    <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
                      {job.title}
                    </h2>
                    <div style={{display: 'flex', alignItems: 'center', color: '#6b7280', marginBottom: '0.75rem'}}>
                      <span style={{fontWeight: '500'}}>{job.company}</span>
                      <span style={{margin: '0 0.5rem'}}>•</span>
                      <span>{job.location}</span>
                      <span style={{margin: '0 0.5rem'}}>•</span>
                      <span>{job.type}</span>
                    </div>
                    <p style={{color: '#374151', marginBottom: '1rem', lineHeight: '1.6'}}>
                      {job.description}
                    </p>
                    <div style={{display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280'}}>
                      <span>Publié le {new Date(job.created_at).toLocaleDateString('fr-FR')}</span>
                      <span style={{margin: '0 0.5rem'}}>•</span>
                      <span>Salaire: {job.salary || 'Non spécifié'}</span>
                    </div>
                  </div>
                  <div style={{marginLeft: '1.5rem'}}>
                    <button
                      onClick={() => applyForJob(job.id)}
                      className="btn btn-primary"
                      style={{padding: '0.5rem 1.5rem'}}
                    >
                      Postuler
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;