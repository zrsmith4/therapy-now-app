
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TherapistPatientsList = () => {
  const navigate = useNavigate();
  
  // Demo patients data
  const demoPatients = [
    { id: '1', name: 'John Smith', condition: 'Knee Rehabilitation', lastVisit: '2023-05-01' },
    { id: '2', name: 'Emma Johnson', condition: 'Shoulder Pain', lastVisit: '2023-04-28' },
    { id: '3', name: 'Michael Brown', condition: 'Post-Surgery Rehabilitation', lastVisit: '2023-05-03' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Your Patients</h2>
      
      <div className="grid gap-4">
        {demoPatients.map(patient => (
          <div key={patient.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{patient.name}</h3>
              <p className="text-sm text-gray-600">{patient.condition}</p>
              <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
            </div>
            <div className="space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/therapist-documentation')}
              >
                View Notes
              </Button>
              <Button 
                size="sm"
              >
                Schedule
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {demoPatients.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have any patients yet.</p>
        </div>
      )}
    </div>
  );
};

export default TherapistPatientsList;
