import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface UseAppointmentSubmissionProps {
  therapistId: string;
  therapistName: string;
  onClose: () => void;
}

interface AppointmentFormData {
  selectedDate: Date;
  selectedTime: string;
  locationType: 'mobile' | 'clinic' | 'virtual';
  patientAddress: string;
  notes: string;
}

export const useAppointmentSubmission = ({
  therapistId,
  therapistName,
  onClose
}: UseAppointmentSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Create or find a conversation between patient and therapist
  const ensureConversationExists = async (patientId: string, therapistId: string) => {
    try {
      // Check if conversation already exists
      const { data: existingConversation, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('patient_id', patientId)
        .eq('therapist_id', therapistId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // If conversation exists, return its ID
      if (existingConversation) {
        return existingConversation.id;
      }

      // Otherwise create a new conversation
      const { data: newConversation, error: insertError } = await supabase
        .from('conversations')
        .insert({
          patient_id: patientId,
          therapist_id: therapistId
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      return newConversation.id;
    } catch (error) {
      console.error('Error ensuring conversation exists:', error);
      return null;
    }
  };

  const handleSubmit = async (formData: AppointmentFormData) => {
    const { selectedDate, selectedTime, locationType, patientAddress, notes } = formData;
    
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to request an appointment.",
        });
        return;
      }
      
      // Validate location details
      if (locationType === 'mobile' && !patientAddress.trim()) {
        toast({
          variant: "destructive",
          title: "Address required",
          description: "Please provide your address for mobile visits.",
        });
        return;
      }
      
      setIsSubmitting(true);

      const datetime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Prepare location details based on location type
      let locationDetails: any = {};
      
      if (locationType === 'mobile') {
        locationDetails.patient_address = patientAddress;
      } else if (locationType === 'clinic') {
        // The clinic address will be retrieved from the therapist's profile when displaying
        locationDetails.clinic_address = undefined;
      } else if (locationType === 'virtual') {
        locationDetails.meeting_link = "To be provided before appointment";
      }

      // Add the user ID to the request
      const { error } = await supabase
        .from('appointment_requests')
        .insert({
          therapist_id: therapistId,
          patient_id: user.id,
          requested_time: datetime.toISOString(),
          patient_notes: notes,
          location_type: locationType,
          location_details: locationDetails
        });

      if (error) throw error;

      // Ensure conversation exists between patient and therapist
      await ensureConversationExists(user.id, therapistId);

      toast({
        title: "Request sent successfully",
        description: `Your appointment request has been sent to ${therapistName}`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting appointment request:', error);
      toast({
        variant: "destructive",
        title: "Error sending request",
        description: "There was a problem sending your appointment request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
