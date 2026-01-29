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
        position="bottom-right" // Modern apps mein bottom-right zyada clean lagta hai
        autoClose={4000}
        hideProgressBar={true} // Progress bar aksar UI ko cluttered banati hai
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // Custom class for extra styling control
        toastClassName={() => 
          "relative flex px-5 py-3.5 rounded-2xl justify-between overflow-hidden cursor-pointer bg-white border border-slate-300 mb-3"
        }
        bodyClassName={() => "flex text-sm font-medium text-slate-800 uppercase items-center p-0"}
      />
    </>
  );
}

export default App;
