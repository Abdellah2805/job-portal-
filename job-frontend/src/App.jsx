// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; 
import Header from './components/Header'; 


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import MyApplications from './pages/MyApplications';
import EmployerJobs from './pages/employer/EmployerJobs';
import CreateJob from './pages/employer/CreateJob';
import EmployerApplications from './pages/employer/EmployerApplications';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />

          {/* Routes protégées pour les candidats */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/my-applications" element={<MyApplications />} />
          </Route>

          {/* Routes protégées pour les employeurs */}
          <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
            <Route path="/employer" element={<EmployerDashboard />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/employer/jobs" element={<EmployerJobs />} />
            <Route path="/employer/jobs/create" element={<CreateJob />} />
            <Route path="/employer/jobs/:id/edit" element={<CreateJob />} />
            <Route path="/employer/jobs/:id/applications" element={<EmployerApplications />} />
            <Route path="/employer/applications" element={<EmployerApplications />} />
          </Route>

          {/* Routes protégées pour l'administrateur */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;