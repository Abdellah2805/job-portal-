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
      const response = await axios.get('http://localhost:8000/api/jobs');
      // Pour chaque job, récupérer les applications
      const jobsWithApplications = [];
      for (const job of response.data.data || response.data) {
        try {
          const applicationsResponse = await axios.get(`http://localhost:8000/api/jobs/${job.id}/applications`);
          jobsWithApplications.push({
            ...job,
            applications: applicationsResponse.data.data || applicationsResponse.data
          });
        } catch (error) {
          console.error(`Error fetching applications for job ${job.id}:`, error);
        }
      }
      // Aplatir les applications
      const allApplications = jobsWithApplications.flatMap(job =>
        (job.applications || []).map(app => ({ ...app, job }))
      );
      setApplications(allApplications);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Candidatures reçues</h1>
        <p className="text-gray-600 mt-2">Gérez les candidatures à vos offres</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune candidature</h3>
          <p className="mt-1 text-sm text-gray-500">
            Vous n'avez pas encore reçu de candidatures.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {applications.map((application) => (
              <li key={application.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {application.job.title}
                      </h3>
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Candidat: <span className="font-medium">{application.user.name}</span>
                      <span className="mx-2">•</span>
                      <span>{application.user.email}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Postulé le {new Date(application.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'accepted')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Refuser
                        </button>
                      </>
                    )}
                    {application.status === 'accepted' && (
                      <span className="text-green-600 font-medium text-sm">Acceptée</span>
                    )}
                    {application.status === 'rejected' && (
                      <span className="text-red-600 font-medium text-sm">Refusée</span>
                    )}
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

export default EmployerApplications;