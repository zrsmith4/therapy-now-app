
import React from 'react';
import AppHeader from './AppHeader';
import { useAuth } from '@/context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, userRole } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader 
        userType={userRole || 'patient'} 
        userName={user?.email || 'Guest'} 
      />
      <main className="container px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
