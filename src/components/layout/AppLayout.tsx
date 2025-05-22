
import React from 'react';
import AppHeader from './AppHeader';
import { useAuth } from '@/context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}
const AppLayout: React.FC<AppLayoutProps> = ({ children, isLoading = false }) => {
  const { user, userRole } = useAuth();

  // Allow 'patient', 'therapist', or 'admin'
  const headerUserType: 'patient' | 'therapist' | 'admin' =
    userRole === 'patient' || userRole === 'therapist' || userRole === 'admin'
      ? userRole
      : 'patient';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppHeader
        userType={headerUserType}
        userName={user?.email || 'Guest'}
        isLoading={isLoading}
      />
      <main className="container mx-auto px-4 py-8 mt-16 flex-grow">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
