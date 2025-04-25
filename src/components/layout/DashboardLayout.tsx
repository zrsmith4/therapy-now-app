
import React from 'react';
import AppHeader from './AppHeader';
import { useAuth } from '@/context/AuthContext';
import { Outlet } from 'react-router-dom';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, userRole } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader 
        userType="therapist" 
        userName={user?.email || 'Therapist'} 
      />
      <main className="container px-4 py-8 pt-16">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
