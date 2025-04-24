
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
}

export default function AppointmentsList({ userType }: { userType: 'patient' | 'therapist' }) {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients!appointments_patient_id_fkey (
            first_name,
            last_name
          )
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;

      return data || [];
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
        appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            date={new Date(appointment.start_time).toLocaleDateString()}
            time={new Date(appointment.start_time).toLocaleTimeString()}
            location={appointment.location_type}
            patient={userType === 'therapist' ? {
              name: `${appointment.patients.first_name} ${appointment.patients.last_name}`
            } : undefined}
            status={appointment.status}
            onManage={() => {}}
            userType={userType}
          />
        ))
      )}
    </div>
  );
}
