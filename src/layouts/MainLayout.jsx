import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/articles': 'Articles',
  '/articles/new': 'New Article',
  '/users': 'User Management',
  '/options': 'Manage Options',
  '/settings': 'Settings',
};

const MainLayout = () => {
  const location = useLocation();

  const getTitle = () => {
    if (pageTitles[location.pathname]) {
      return pageTitles[location.pathname];
    }
    if (location.pathname.includes('/articles/edit/')) {
      return 'Edit Article';
    }
    if (location.pathname.includes('/articles/view/')) {
      return 'Article Details';
    }
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-5">
          <div className="max-w-7xl mx-auto animate-fade-in h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
