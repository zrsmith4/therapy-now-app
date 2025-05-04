
import React, { useState, useEffect } from 'react';
import AppHeader from './AppHeader';
import { useAuth } from '@/context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, isLoading = false }) => {
  const { user, userRole } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppHeader 
        userType={userRole || 'patient'} 
        userName={user?.email || 'Guest'} 
        isLoading={isLoading}
      />
      <main className="container px-4 py-8 mt-16 flex-grow">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
