
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AppointmentCard from './AppointmentCard';

interface Appointment {
  id: string;
  patient_id: string;
  therapist_id: string;
  start_time: string;
  end_time: string;
  location_type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  patient_notes?: string;
  patients?: {
    first_name: string;
    last_name: string;
  };
}

export default function AppointmentsList({ userType }: { userType: 'patient' | 'therapist' }) {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      // For patient and therapist views, we need different queries
      if (userType === 'patient') {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('start_time', { ascending: true });

        if (error) throw error;
        return data || [];
      } else {
        // For therapists, get the patient information
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patients (
              first_name,
              last_name
            )
          `)
          .order('start_time', { ascending: true });

        if (error) throw error;
        return data || [];
      }
    },
  });

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No appointments scheduled.
        </div>
      ) : (
        appointments.map((appointment: Appointment) => (
          <AppointmentCard
            key={appointment.id}
            date={new Date(appointment.start_time).toLocaleDateString()}
            time={new Date(appointment.start_time).toLocaleTimeString()}
            location={{
              type: appointment.location_type as 'mobile' | 'clinic' | 'virtual'
            }}
            patient={userType === 'therapist' && appointment.patients ? {
              name: `${appointment.patients.first_name} ${appointment.patients.last_name}`
            } : undefined}
            status={mapStatusToAppointmentCardStatus(appointment.status)}
            onManage={() => {}}
            userType={userType}
          />
        ))
      )}
    </div>
  );
}

// Helper function to map database status to component status
function mapStatusToAppointmentCardStatus(status: string): 'upcoming' | 'completed' | 'cancelled' {
  switch (status) {
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    case 'scheduled':
    default:
      return 'upcoming';
  }
}
