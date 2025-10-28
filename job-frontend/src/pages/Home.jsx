// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // On a besoin du hook pour vérifier si l'utilisateur est connecté

const Home = () => {
  const { user } = useAuth(); // Récupère l'utilisateur connecté

  return (
    <div className="home-page"> {/* J'ai changé le div principal pour une classe globale si besoin */}
      {/* Hero Section - Utilise tes classes CSS : hero, container, h1, p */}
      <section className="hero">
        <div className="container">
          <h1>
            Trouvez votre prochain <span style={{color: '#2563eb'}}>emploi</span>
          </h1>
          <p>
            La plateforme qui connecte les talents aux meilleures opportunités d'emploi.
            Découvrez des milliers d'offres et postulez en quelques clics.
          </p>

          {/* Utilise ta classe CSS : btn-group */}
          <div className="btn-group">
            {/* Si l'utilisateur n'est PAS connecté */}
            {!user ? (
              <>
                {/* 1. L'utilisateur cherche un emploi (va sur /jobs) ou passe par /register */}
                <Link to="/jobs" className="btn btn-primary">
                  Je cherche un emploi
                </Link>
                
                {/* 2. L'utilisateur veut poster une offre (va sur /register pour s'identifier comme employeur) */}
                <Link to="/register" className="btn btn-secondary">
                  Je publie une offre
                </Link>
              </>
            ) : (
              // Si l'utilisateur EST connecté, on lui montre les options selon son rôle
              <>
                {/* OPTIONS POUR CANDIDAT (ou 'user' par défaut) */}
                {(user.roles?.includes('candidate') || user.roles?.includes('user')) && (
                  <>
                    <Link to="/jobs" className="btn btn-primary">
                      Voir les offres d'emploi
                    </Link>
                    <Link to="/my-applications" className="btn btn-secondary">
                      Mes candidatures
                    </Link>
                  </>
                )}
                
                {/* OPTIONS POUR EMPLOYEUR */}
                {user.roles?.includes('employeur') && (
                  <>
                    <Link to="/employer/jobs" className="btn btn-primary">
                      Gérer mes offres
                    </Link>
                    <Link to="/employer/create" className="btn btn-secondary">
                      Publier une offre
                    </Link>
                  </>
                )}
                
                {/* OPTIONS POUR ADMINISTRATEUR */}
                {user.roles?.includes('admin') && (
                  <Link to="/admin/dashboard" className="btn btn-primary">
                    Tableau de Bord Admin
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Reste du contenu de la page d'accueil (section features, etc.) */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Pourquoi nous choisir ?</h2>
          <div className="features-grid">
            {/* Feature Card 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                {/* Utilise l'icône SVG pour un look cohérent */}
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-1.076-8.777-3.245M19 19L5 5M5 19l14-14" />
                </svg>
              </div>
              <h3>Simplicité</h3>
              <p>Une interface utilisateur intuitive pour une expérience de recherche d'emploi et de recrutement fluide.</p>
            </div>
            
            {/* Feature Card 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>Rapidité</h3>
              <p>Postulez ou publiez une offre en quelques minutes seulement. Gagnez du temps précieux.</p>
            </div>
            
            {/* Feature Card 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3>Réseau étendu</h3>
              <p>Accédez à un large réseau d'entreprises et de candidats qualifiés.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;