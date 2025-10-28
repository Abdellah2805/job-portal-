// src/pages/CreateJob.jsx

import React from 'react';

const CreateJob = () => {
  // Ici, tu ajouteras ton état et ta logique de formulaire pour la création

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        ✏️ Publier une Offre d'Emploi
      </h1>
      
      <form className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <p className="text-gray-500">
          ⚠️ **Statut :** En cours de développement. Le formulaire de création sera ici.
        </p>

        {/* Exemple d'un champ de formulaire */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre du poste *
          </label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            placeholder="Ex: Développeur Full Stack"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* ... Autres champs (Description, Localisation, etc.) */}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
          >
            Créer l'offre
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;