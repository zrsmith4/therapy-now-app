
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function TherapistRequestList() {
  const { toast } = useToast();
  
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['appointment-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointment_requests')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
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
    return <div>Loading requests...</div>;
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
                  <strong>Patient:</strong> {request.patients.first_name} {request.patients.last_name}
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
