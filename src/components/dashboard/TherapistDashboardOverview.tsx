
import React, { useState } from 'react';
import WelcomeSection from './WelcomeSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvailabilityToggle from '@/components/therapists/AvailabilityToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAvailabilityToggle } from '@/hooks/useAvailabilityToggle';
import { nextAppointment } from '@/data/demoAppointments';
import AppointmentsTab from './tabs/AppointmentsTab';
import PatientNotesTab from './tabs/PatientNotesTab';
import ScheduleTab from './tabs/ScheduleTab';
import PayoutsTab from './tabs/PayoutsTab';
import TherapistRequestList from './TherapistRequestList';

export default function TherapistDashboardOverview() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("appointments");
  const { isAvailable, availabilityTimeout, handleAvailabilityToggle } = useAvailabilityToggle();
  
  return (
    <>
      {/* Temporary access to Documentation page */}
      <div className="flex justify-end mb-6">
        <Button
          className="bg-medical-tertiary"
          onClick={() => navigate('/therapist-documentation')}
        >
          Documentation
        </Button>
      </div>
      
      <WelcomeSection
        userName="Sarah"
        userType="therapist"
        nextAppointment={nextAppointment}
        onActionClick={() => setTabValue("schedule")}
      />
      
      <div className="mb-8">
        <AvailabilityToggle
          isAvailable={isAvailable}
          onToggle={handleAvailabilityToggle}
          timeout={availabilityTimeout}
        />
      </div>
      
      <Tabs value={tabValue} onValueChange={setTabValue} defaultValue="appointments">
        <TabsList className="mb-6">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patient Notes</TabsTrigger>
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          <TabsTrigger value="payouts">Payouts & Stats</TabsTrigger>
          <TabsTrigger value="requests">Appointment Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments">
          <AppointmentsTab />
        </TabsContent>
        
        <TabsContent value="patients">
          <PatientNotesTab />
        </TabsContent>
        
        <TabsContent value="schedule">
          <ScheduleTab />
        </TabsContent>
        
        <TabsContent value="payouts">
          <PayoutsTab />
        </TabsContent>
        
        <TabsContent value="requests">
          <TherapistRequestList />
        </TabsContent>
      </Tabs>
    </>
  );
}
