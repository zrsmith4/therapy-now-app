
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MaintenanceStatusPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Maintenance Status</h1>
        
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h2 className="font-semibold text-yellow-700 mb-2">Currently in Progress</h2>
          <p className="text-sm text-gray-600">
            Our team is working on platform improvements. Expected completion time: 2 hours.
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/maintenance')}
          className="w-full"
        >
          Return to Main Page
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceStatusPage;
