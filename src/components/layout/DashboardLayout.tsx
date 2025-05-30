
import React from 'react';
import AppHeader from './AppHeader';
import { useAuth } from '@/context/AuthContext';
import { Outlet } from 'react-router-dom';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  isLoading?: boolean;
}

// Widened to accept 'admin'
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, isLoading = false }) => {
  const { user, userRole } = useAuth();

  // Accepts 'patient', 'therapist', or 'admin'
  const headerUserType: 'patient' | 'therapist' | 'admin' =
    userRole === 'therapist' || userRole === 'patient' || userRole === 'admin'
      ? userRole
      : 'therapist';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppHeader
        userType={headerUserType}
        userName={
          user?.email ||
          (userRole === 'patient'
            ? 'Patient'
            : userRole === 'admin'
            ? 'Admin'
            : 'Therapist')
        }
        isLoading={isLoading}
      />
      <main className="container mx-auto px-4 py-8 mt-16 flex-grow">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
