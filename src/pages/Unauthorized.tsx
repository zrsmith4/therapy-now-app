
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { userRole, signOut } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-red-600">Unauthorized Access</h1>
        <p className="text-gray-600">
          You don't have permission to access this page. This area is restricted based on user roles.
        </p>

        <div className="space-y-3">
          <Button onClick={handleGoBack} variant="outline" className="w-full">
            Go Back
          </Button>
          <Button onClick={handleGoHome} className="w-full">
            Go to Home
          </Button>
          {userRole === 'patient' && (
            <p className="text-sm text-gray-500">
              This area is for therapists only. If you're a therapist, please contact support.
            </p>
          )}
          {userRole === 'therapist' && (
            <p className="text-sm text-gray-500">
              This area is for patients only. If you're a patient, please contact support.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
