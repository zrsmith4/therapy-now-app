
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const ScheduleTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Your Schedule</h2>
      <Button onClick={() => navigate('/therapist-dashboard/schedule')}>View Full Schedule</Button>
    </div>
  );
};

export default ScheduleTab;
