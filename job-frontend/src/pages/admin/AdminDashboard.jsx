import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      
      const [usersResponse, jobsResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/admin/users'),
        axios.get('http://localhost:8000/api/jobs'),
      ]);

      const users = usersResponse.data.data || usersResponse.data;
      const jobs = jobsResponse.data.data || jobsResponse.data;

      
      setStats({
        users: users.length,
        jobs: jobs.length,
        applications: jobs.reduce((total, job) => total + (job.applications_count || 0), 0),
      });

      setUsers(users);
      setJobs(jobs);
      setApplications([]); 
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erreur lors de la suppression');
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
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem'}}>
        <div style={{animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', borderBottom: '2px solid #2563eb'}}></div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f8f9fa'}}>
      {/* Hero Section pour Admin */}
      <section style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#92400e',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            👑 Espace Administrateur
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#78350f',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Gérez la plateforme JobPortal : utilisateurs, offres d'emploi et candidatures.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button className="btn btn-primary">
              Voir tous les utilisateurs
            </button>
            <button className="btn btn-secondary">
              Gérer les offres
            </button>
            <button className="btn btn-danger">
              Modérer la plateforme
            </button>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section style={{padding: '4rem 0', backgroundColor: 'white'}}>
        <div className="container">
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Statistiques de la plateforme
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card" style={{textAlign: 'center'}}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#eff6ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg style={{width: '2rem', height: '2rem', color: '#2563eb'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
                Utilisateurs inscrits
              </h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#2563eb'}}>
                {stats.users}
              </p>
            </div>

            <div className="card" style={{textAlign: 'center'}}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg style={{width: '2rem', height: '2rem', color: '#16a34a'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4" />
                </svg>
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
                Offres d'emploi
              </h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#16a34a'}}>
                {stats.jobs}
              </p>
            </div>

            <div className="card" style={{textAlign: 'center'}}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#faf5ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg style={{width: '2rem', height: '2rem', color: '#9333ea'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
                Candidatures totales
              </h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#9333ea'}}>
                {stats.applications}
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section style={{padding: '4rem 0', backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Gestion des utilisateurs
          </h2>

          <div className="card">
            <div style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827'}}>
                Utilisateurs ({users.length})
              </h3>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table style={{minWidth: '100%', borderCollapse: 'collapse'}}>
                <thead style={{backgroundColor: '#f9fafb'}}>
                  <tr>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                      Nom
                    </th>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                      Email
                    </th>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                      Rôle
                    </th>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{backgroundColor: 'white'}}>
                  {users.map((user) => (
                    <tr key={user.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                      <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>
                        {user.name}
                      </td>
                      <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        {user.email}
                      </td>
                      <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        {Array.isArray(user.roles) ? user.roles.map(role => typeof role === 'object' ? role.name : role).join(', ') : (user.roles || 'N/A')}
                      </td>
                      <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        <button
                          onClick={() => deleteUser(user.id)}
                          style={{color: '#dc2626', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer'}}
                          onMouseEnter={(e) => e.target.style.color = '#b91c1c'}
                          onMouseLeave={(e) => e.target.style.color = '#dc2626'}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Gestion des offres */}
      <section style={{padding: '4rem 0', backgroundColor: 'white'}}>
        <div className="container">
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Gestion des offres d'emploi
          </h2>

          <div className="card">
            <div style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827'}}>
                Offres d'emploi ({jobs.length})
              </h3>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table style={{minWidth: '100%', borderCollapse: 'collapse'}}>
                <thead style={{backgroundColor: '#f9fafb'}}>
                  <tr>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                      Titre
                    </th>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                      Entreprise
                    </th>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                      Candidatures
                    </th>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{backgroundColor: 'white'}}>
                  {jobs.map((job) => (
                    <tr key={job.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                      <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>
                        {job.title}
                      </td>
                      <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        {job.company}
                      </td>
                      <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        {job.applications_count || 0}
                      </td>
                      <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        <button
                          onClick={() => deleteJob(job.id)}
                          style={{color: '#dc2626', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer'}}
                          onMouseEnter={(e) => e.target.style.color = '#b91c1c'}
                          onMouseLeave={(e) => e.target.style.color = '#dc2626'}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;