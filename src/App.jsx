import React, { useEffect, useState } from 'react';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Admin / Assistant Pages
import AdminDashboard from './pages/AdminDashboard';
import InscriptionList from './pages/InscriptionList';
import CandidatureList from './pages/CandidatureList';
import FormationCreate from './pages/FormationCreate';
import FormationEdit from './pages/FormationEdit';
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
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-secondary-950 dark:text-gray-50">
      <Routes>
        {/* Public Routes with Navbar */}
        <Route element={<><Navbar theme={theme} onToggleTheme={toggleTheme} /><div className="flex-grow"><Outlet /></div><footer className="bg-secondary-900 text-white py-12"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-secondary-400 font-medium">© {new Date().getFullYear()} FormationsGest - Gestion Professionnelle de Formation</p>
          </div></footer></>}>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/formations" element={<FormationList />} />
          <Route path="/formations/:slug" element={<FormationDetail />} />
          <Route path="/inscription/:slug" element={<InscriptionForm />} />
          <Route path="/candidature" element={<CandidatureForm />} />
          <Route path="/evaluation/:formationId/:formateurId" element={<EvaluationForm />} />
        </Route>

        {/* Protected Routes with Sidebar Layout (sans header public après connexion) */}
        <Route path="/" element={<MainLayout theme={theme} onToggleTheme={toggleTheme} />}>
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
            path="admin/formations"
            element={
              <PrivateRoute roles={['ADMIN', 'ASSISTANT']}>
                <FormationList />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/formations/create"
            element={
              <PrivateRoute roles={['ADMIN', 'ASSISTANT']}>
                <FormationCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/formations/edit/:slug"
            element={
              <PrivateRoute roles={['ADMIN', 'ASSISTANT']}>
                <FormationEdit />
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
