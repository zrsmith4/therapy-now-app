
import React from 'react';
import TherapistScheduleCalendar from '@/components/therapists/TherapistScheduleCalendar';
import ScheduleOptionsSelector from '@/components/therapists/ScheduleOptionsSelector';
import { Button } from '@/components/ui/button';

const TherapistScheduleView = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Your Schedule</h2>
      
      <ScheduleOptionsSelector />
      
      <div className="mt-6">
        <TherapistScheduleCalendar userId="demo-therapist-id" />
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Location Preferences</h3>
        <p className="text-slate-500 mb-4">
          Where are you willing to provide therapy services?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center bg-medical-light">
            <h4 className="font-medium mb-1">Mobile</h4>
            <p className="text-xs text-slate-500">Visit patients at their location</p>
            <Button size="sm" className="mt-2 bg-medical-secondary hover:bg-medical-secondary/90">Enabled</Button>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <h4 className="font-medium mb-1">Clinic</h4>
            <p className="text-xs text-slate-500">Patients visit your clinic</p>
            <Button size="sm" variant="outline" className="mt-2">Enable</Button>
          </div>
          
          <div className="border rounded-lg p-4 text-center bg-medical-light">
            <h4 className="font-medium mb-1">Virtual</h4>
            <p className="text-xs text-slate-500">Remote video sessions</p>
            <Button size="sm" className="mt-2 bg-medical-tertiary hover:bg-medical-tertiary/90">Enabled</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistScheduleView;
