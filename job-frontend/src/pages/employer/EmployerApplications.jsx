import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/applications/employer');
      setApplications(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(`http://localhost:8000/api/applications/${applicationId}/status`, {
        status,
      });
      setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Refusée';
      default:
        return status;
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
        <div style={{marginBottom: '2rem'}}>
          <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#111827'}}>Candidatures reçues</h1>
          <p style={{color: '#6b7280', marginTop: '0.5rem'}}>Gérez les candidatures à vos offres</p>
        </div>

        {applications.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem'}}>
            <svg style={{width: '3rem', height: '3rem', color: '#9ca3af', margin: '0 auto'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 style={{marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>Aucune candidature</h3>
            <p style={{marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280'}}>
              Vous n'avez pas encore reçu de candidatures.
            </p>
          </div>
        ) : (
          <div className="card">
            <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
              {applications.map((application) => (
                <li key={application.id} style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <h3 style={{fontSize: '1.125rem', fontWeight: '500', color: '#111827'}}>
                          {application.job?.title || 'Offre inconnue'}
                        </h3>
                        <span style={{
                          marginLeft: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.125rem 0.625rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          ...getStatusColor(application.status)
                        }}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                      <div style={{marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        Candidat: <span style={{fontWeight: '500'}}>{application.user?.name || 'N/A'}</span>
                        <span style={{margin: '0 0.5rem'}}>•</span>
                        <span>{application.user?.email || 'N/A'}</span>
                      </div>
                      <div style={{marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        Postulé le {new Date(application.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'accepted')}
                            className="btn btn-success"
                            style={{padding: '0.25rem 0.75rem', fontSize: '0.875rem'}}
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                            className="btn btn-danger"
                            style={{padding: '0.25rem 0.75rem', fontSize: '0.875rem'}}
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      {application.status === 'accepted' && (
                        <span style={{color: '#16a34a', fontWeight: '500', fontSize: '0.875rem'}}>Acceptée</span>
                      )}
                      {application.status === 'rejected' && (
                        <span style={{color: '#dc2626', fontWeight: '500', fontSize: '0.875rem'}}>Refusée</span>
                      )}
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

export default EmployerApplications;