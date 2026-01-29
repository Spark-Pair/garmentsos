import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './context/AuthContext';
import { useConfig } from './context/ConfigContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { ArticleList, ArticleForm, ArticleView } from './pages/articles';
import Users from './pages/Users';
import Options from './pages/Options';
import Settings from './pages/Settings';
import SubscriptionExpired from './pages/SubscriptionExpired';
import { PageLoader } from './components/ui/Loader';

// Protected Route
const ProtectedRoute = ({ children, requireDeveloper = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireDeveloper && user.role !== 'developer') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { isExpired, loading: configLoading } = useConfig();

  if (configLoading) return <PageLoader />;
  if (isExpired) return <SubscriptionExpired />;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/new" element={<ArticleForm />} />
          <Route path="articles/edit/:id" element={<ArticleForm />} />
          <Route path="articles/view/:id" element={<ArticleView />} />
          <Route path="options" element={<Options />} />
          <Route path="users" element={
            <ProtectedRoute requireDeveloper>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '12px',
        }}
      />
    </>
  );
}

export default App;
