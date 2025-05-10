
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import { demoAppointments } from '@/data/demoAppointments';

const AppointmentsTab: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
        <Button variant="outline" size="sm" className="gap-1">
          <Calendar className="h-4 w-4" />
          <span>Calendar View</span>
        </Button>
      </div>
      
      {demoAppointments.map(appointment => (
        <AppointmentCard
          key={appointment.id}
          date={appointment.date}
          time={appointment.time}
          location={appointment.location}
          patient={appointment.patient}
          status={appointment.status}
          onManage={() => {}}
          userType="therapist"
        />
      ))}
    </div>
  );
};

export default AppointmentsTab;
