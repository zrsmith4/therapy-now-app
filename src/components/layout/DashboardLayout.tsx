
import React from 'react';
import AppHeader from './AppHeader';
import { useAuth } from '@/context/AuthContext';
import { Outlet } from 'react-router-dom';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  isLoading?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, isLoading = false }) => {
  const { user, userRole } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppHeader 
        userType={userRole || "therapist"} 
        userName={user?.email || 'Therapist'} 
        isLoading={isLoading}
      />
      <main className="container mx-auto px-4 py-8 mt-16 flex-grow">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
