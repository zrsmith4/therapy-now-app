
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AppointmentCard from './AppointmentCard';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Define the types for the different Supabase query responses
interface AppointmentBase {
  id: string;
  patient_id: string;
  therapist_id: string;
  start_time: string;
  end_time: string;
  location_type: string;
  status: string; 
  patient_notes?: string;
}

// For therapist view with patient details
interface AppointmentWithPatient extends AppointmentBase {
  patients: {
    first_name: string;
    last_name: string;
  };
}

// For patient view with therapist details
interface AppointmentWithTherapist extends AppointmentBase {
  therapists: {
    first_name: string;
    last_name: string;
  };
}

type AppointmentWithDetails = AppointmentWithPatient | AppointmentWithTherapist;

// Define a type guard to check if an appointment has patient data
function hasPatientData(appointment: AppointmentWithDetails): appointment is AppointmentWithPatient {
  return 'patients' in appointment && appointment.patients !== null;
}

export default function AppointmentsList({ userType }: { userType: 'patient' | 'therapist' }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['appointments', userType],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // For patient and therapist views, we need different queries
      const idField = userType === 'patient' ? 'patient_id' : 'therapist_id';
      const detailsTable = userType === 'patient' ? 'therapists' : 'patients';
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          ${detailsTable}(
            first_name,
            last_name
          )
        `)
        .eq(idField, user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const handleMarkAsCompleted = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment marked as completed",
        description: "The appointment has been successfully updated.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error marking appointment as completed:', error);
      toast({
        variant: "destructive",
        title: "Error updating appointment",
        description: "There was a problem marking the appointment as completed.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No appointments scheduled.
        </div>
      ) : (
        appointments?.map((appointment: AppointmentWithDetails) => (
          <AppointmentCard
            key={appointment.id}
            date={new Date(appointment.start_time).toLocaleDateString()}
            time={new Date(appointment.start_time).toLocaleTimeString()}
            location={{
              type: appointment.location_type as 'mobile' | 'clinic' | 'virtual'
            }}
            patient={userType === 'therapist' && hasPatientData(appointment) ? {
              name: `${appointment.patients.first_name} ${appointment.patients.last_name}`
            } : undefined}
            therapist={userType === 'patient' ? {
              name: `${(appointment as AppointmentWithTherapist).therapists.first_name} ${(appointment as AppointmentWithTherapist).therapists.last_name}`,
              specialty: 'Physical Therapist'
            } : undefined}
            status={mapStatusToAppointmentCardStatus(appointment.status)}
            onManage={() => {
              if (userType === 'therapist' && appointment.status === 'scheduled') {
                handleMarkAsCompleted(appointment.id);
              }
            }}
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
