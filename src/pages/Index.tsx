import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import HeroSection from '@/components/landing/HeroSection';
import UserTypeSelection from '@/components/landing/UserTypeSelection';
import HowItWorks from '@/components/landing/HowItWorks';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { UserType } from '@/components/landing/UserTypeSelection';

const Index = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();
  
  if (userType === 'therapist') {
    navigate('/auth', { state: { userType: 'therapist' } });
    return null;
  }
  
  if (!userType) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader />
        <main className="container px-4 py-16">
          <HeroSection />
          <UserTypeSelection onSelectUserType={setUserType} />
          <HowItWorks />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader 
        userType={userType} 
        userName={userType === 'patient' ? 'Alex Smith' : 'Dr. Sarah Johnson'} 
      />
      <UserDashboard userType={userType} />
    </div>
  );
};

export default Index;
