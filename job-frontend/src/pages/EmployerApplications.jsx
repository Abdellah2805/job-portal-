// src/pages/EmployerApplications.jsx

import React from 'react';
import { useParams } from 'react-router-dom';

const EmployerApplications = () => {
  const { jobId } = useParams();
  
  // Ici, tu chargeras la liste des candidatures pour l'offre spécifiée par jobId

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📥 Candidatures pour l'Offre #{jobId}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-500">
          ⚠️ **Statut :** En cours de développement.
        </p>
        <p className="mt-2 text-gray-700">
          Cette page listera toutes les candidatures pour cette offre et permettra de les gérer (Accepter/Refuser).
        </p>
      </div>
      
      {/* Tu inséreras ici la liste des candidatures */}
      
    </div>
  );
};

export default EmployerApplications;