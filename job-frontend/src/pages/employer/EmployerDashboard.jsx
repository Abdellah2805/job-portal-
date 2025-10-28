import React from 'react';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  return (
    <div>
      {/* Hero Section pour Employeur */}
      <section style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Espace Employeur
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Gérez vos offres d'emploi et vos recrutements en toute simplicité.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/employer/jobs/create" className="btn btn-primary">
              Publier une offre
            </Link>
            <Link to="/employer/jobs" className="btn btn-secondary">
              Mes offres d'emploi
            </Link>
            <Link to="/employer/applications" className="btn" style={{backgroundColor: '#10b981', color: 'white'}}>
              Candidatures reçues
            </Link>
          </div>
        </div>
      </section>

      {/* Actions principales */}
      <section style={{padding: '4rem 0', backgroundColor: 'white'}}>
        <div className="container">
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Actions principales
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
                Publier une offre
              </h3>
              <p style={{color: '#6b7280', marginBottom: '1rem'}}>
                Créez une nouvelle offre d'emploi pour attirer les meilleurs talents.
              </p>
              <Link to="/employer/jobs/create" className="btn btn-primary">
                Créer une offre
              </Link>
            </div>

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
                Gérer mes offres
              </h3>
              <p style={{color: '#6b7280', marginBottom: '1rem'}}>
                Modifiez, supprimez ou consultez vos offres d'emploi existantes.
              </p>
              <Link to="/employer/jobs" className="btn btn-secondary">
                Voir mes offres
              </Link>
            </div>

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
                Candidatures reçues
              </h3>
              <p style={{color: '#6b7280', marginBottom: '1rem'}}>
                Consultez et gérez les candidatures à vos offres d'emploi.
              </p>
              <Link to="/employer/applications" className="btn" style={{backgroundColor: '#10b981', color: 'white'}}>
                Voir candidatures
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques rapides */}
      <section style={{backgroundColor: '#f8f9fa', padding: '4rem 0'}}>
        <div className="container">
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Aperçu de vos recrutements
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card" style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem'}}>
                0
              </div>
              <div style={{color: '#6b7280'}}>Offres actives</div>
            </div>

            <div className="card" style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem'}}>
                0
              </div>
              <div style={{color: '#6b7280'}}>Candidatures reçues</div>
            </div>

            <div className="card" style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem'}}>
                0
              </div>
              <div style={{color: '#6b7280'}}>En cours de recrutement</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmployerDashboard;