import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages (à créer prochainement)
import Home from './pages/Home';
import Login from './pages/Login';
import FormationList from './pages/FormationList';
import FormationDetail from './pages/FormationDetail';
import InscriptionForm from './pages/InscriptionForm';
import CandidatureForm from './pages/CandidatureForm';

// Admin / Assistant Pages
import AdminDashboard from './pages/AdminDashboard';
import InscriptionList from './pages/InscriptionList';
import CandidatureList from './pages/CandidatureList';
import FormationCreate from './pages/FormationCreate';
import EntrepriseList from './pages/EntrepriseList';
import PlanningList from './pages/PlanningList';
import EvaluationForm from './pages/EvaluationForm';
import FormateurList from './pages/FormateurList';
import UserList from './pages/UserList';
import EvaluationList from './pages/EvaluationList';
import EntrepriseCreate from './pages/EntrepriseCreate';
import PlanningCreate from './pages/PlanningCreate';
import FormateurDashboard from './pages/FormateurDashboard';
import AssistantDashboard from './pages/AssistantDashboard';
import UserCreate from './pages/UserCreate';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

import MainLayout from './components/MainLayout';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Routes>
        {/* Public Routes with Navbar */}
        <Route element={<><Navbar /><div className="flex-grow"><Outlet /></div><footer className="bg-secondary-900 text-white py-12"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><p className="text-secondary-400 font-medium">© 2025 FormationsGest - Gestion Professionnelle de Formation</p></div></footer></>}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/formations" element={<FormationList />} />
          <Route path="/formations/:id" element={<FormationDetail />} />
          <Route path="/inscription/:id" element={<InscriptionForm />} />
          <Route path="/candidature" element={<CandidatureForm />} />
          <Route path="/evaluation/:formationId/:formateurId" element={<EvaluationForm />} />
        </Route>

        {/* Protected Routes with Sidebar Layout */}
        <Route path="/" element={<MainLayout />}>
          {/* Dashboard Hub */}
          <Route
            path="admin/dashboard"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="assistant/dashboard"
            element={
              <PrivateRoute roles={['ASSISTANT']}>
                <AssistantDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="formateur/dashboard"
            element={
              <PrivateRoute roles={['FORMATEUR']}>
                <FormateurDashboard />
              </PrivateRoute>
            }
          />

          {/* Resources Management */}
          <Route
            path="admin/inscriptions"
            element={
              <PrivateRoute roles={['ADMIN', 'ASSISTANT']}>
                <InscriptionList />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/candidatures"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <CandidatureList />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/formations/create"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <FormationCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/entreprises"
            element={
              <PrivateRoute roles={['ADMIN', 'ASSISTANT']}>
                <EntrepriseList />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/entreprises/create"
            element={
              <PrivateRoute roles={['ADMIN', 'ASSISTANT']}>
                <EntrepriseCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/plannings"
            element={
              <PrivateRoute roles={['ADMIN', 'ASSISTANT']}>
                <PlanningList />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/plannings/create"
            element={
              <PrivateRoute roles={['ADMIN', 'ASSISTANT']}>
                <PlanningCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/formateurs"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <FormateurList />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <UserList />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/users/create"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <UserCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/evaluations"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <EvaluationList />
              </PrivateRoute>
            }
          />
          <Route
            path="profil"
            element={
              <PrivateRoute roles={['ADMIN', 'ASSISTANT', 'FORMATEUR']}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="mot-de-passe"
            element={
              <PrivateRoute roles={['ADMIN', 'ASSISTANT', 'FORMATEUR']}>
                <ChangePassword />
              </PrivateRoute>
            }
          />
          <Route
            path="formateur/sessions"
            element={
              <PrivateRoute roles={['FORMATEUR']}>
                <PlanningList />
              </PrivateRoute>
            }
          />
          <Route
            path="formateur/evaluations"
            element={
              <PrivateRoute roles={['FORMATEUR']}>
                <EvaluationList />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
