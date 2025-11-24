import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const location = useLocation();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Get active page from pathname
  const getActivePage = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    return path === '' ? 'dashboard' : path;
  };

  return (
    <div className="App">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar activePage={getActivePage()} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

