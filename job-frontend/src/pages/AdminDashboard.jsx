// src/pages/AdminDashboard.jsx

import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-8">
        👑 Tableau de Bord Administrateur
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte 1: Gestion des Utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Gestion Utilisateurs</h2>
          <p className="text-gray-500">
            Voir et modérer tous les comptes (Candidats et Employeurs).
          </p>
          <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">Accéder →</button>
        </div>

        {/* Carte 2: Gestion des Offres */}
        <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Gestion des Offres</h2>
          <p className="text-gray-500">
            Modérer ou supprimer n'importe quelle offre d'emploi.
          </p>
          <button className="mt-4 text-green-600 hover:text-green-800 font-medium">Accéder →</button>
        </div>
        
        {/* Carte 3: Gestion des Candidatures */}
        <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Statistiques & Modération</h2>
          <p className="text-gray-500">
            Aperçu global de l'activité de la plateforme.
          </p>
          <button className="mt-4 text-yellow-600 hover:text-yellow-800 font-medium">Accéder →</button>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;