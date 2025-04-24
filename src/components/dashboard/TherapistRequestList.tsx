import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';

interface AppointmentRequest {
  id: string;
  patient_id: string;
  therapist_id: string;
  requested_time: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  patient_notes?: string;
  created_at: string;
  location_type: string;
  metadata?: any;
  patientName?: string;
}

export default function TherapistRequestList() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['appointment-requests'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // First, get the requests
      const { data, error } = await supabase
        .from('appointment_requests')
        .select(`
          *
        `)
        .eq('therapist_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // For each request, get the patient details
      if (data && data.length > 0) {
        const patientDetails = await Promise.all(
          data.map(async (request) => {
            const { data: patientData, error: patientError } = await supabase
              .from('patients')
              .select('first_name, last_name')
              .eq('user_id', request.patient_id)
              .single();
            
            if (patientError) {
              console.error('Error fetching patient:', patientError);
              return {
                ...request,
                patientName: 'Unknown Patient'
              } as AppointmentRequest;
            }
            
            return {
              ...request,
              patientName: `${patientData.first_name} ${patientData.last_name}`
            } as AppointmentRequest;
          })
        );
        
        return patientDetails as AppointmentRequest[];
      }
      
      return (data || []) as AppointmentRequest[];
    },
  });

  const handleRequestAction = async (requestId: string, status: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('appointment_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: `Request ${status}`,
        description: `You have ${status} the appointment request.`,
      });

      refetch();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        variant: "destructive",
        title: "Error updating request",
        description: "There was a problem updating the request. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Appointment Requests</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pending Appointment Requests</h2>
      
      {requests?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pending requests at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {requests?.map((request) => (
            <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="space-y-2">
                <p>
                  <strong>Patient:</strong> {request.patientName || 'Unknown Patient'}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(request.requested_time).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {new Date(request.requested_time).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Location Type:</strong> {request.location_type}
                </p>
                {request.patient_notes && (
                  <p>
                    <strong>Notes:</strong> {request.patient_notes}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleRequestAction(request.id, 'declined')}
                  variant="outline"
                >
                  Decline
                </Button>
                <Button
                  onClick={() => handleRequestAction(request.id, 'accepted')}
                >
                  Accept
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
