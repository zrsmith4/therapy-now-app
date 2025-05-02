
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import LocationTypeSelector from './LocationTypeSelector';

interface AppointmentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapistId: string;
  therapistName: string;
  selectedDate: Date;
  selectedTime: string;
  locationType: 'mobile' | 'clinic' | 'virtual';
}

export default function AppointmentRequestModal({
  isOpen,
  onClose,
  therapistId,
  therapistName,
  selectedDate,
  selectedTime,
  locationType,
}: AppointmentRequestModalProps) {
  const [notes, setNotes] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [patientAddress, setPatientAddress] = useState('');
  const [currentLocationType, setCurrentLocationType] = useState<'mobile' | 'clinic' | 'virtual'>(locationType);
  const [therapistLocationDetails, setTherapistLocationDetails] = useState<{
    clinic_address?: string;
    available_types?: Array<'mobile' | 'clinic' | 'virtual'>;
  }>({});
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch therapist's location details on component mount
  useEffect(() => {
    if (therapistId) {
      fetchTherapistDetails();
    }
  }, [therapistId]);

  const fetchTherapistDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('address, city, state, zip_code, service_options')
        .eq('user_id', therapistId)
        .single();

      if (error) throw error;

      if (data) {
        // Format clinic address
        const clinic_address = data.address ? 
          `${data.address}, ${data.city}, ${data.state} ${data.zip_code}` : 
          undefined;

        // Get available service types
        const available_types = Array.isArray(data.service_options) ? 
          data.service_options as Array<'mobile' | 'clinic' | 'virtual'> : 
          ['mobile', 'clinic', 'virtual'];

        setTherapistLocationDetails({ 
          clinic_address,
          available_types
        });

        // Default to the first available type if current selection is not available
        if (available_types.length > 0 && !available_types.includes(currentLocationType)) {
          setCurrentLocationType(available_types[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching therapist details:', error);
    }
  };

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

  const handleSubmit = async () => {
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
      if (currentLocationType === 'mobile' && !patientAddress.trim()) {
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
      
      if (currentLocationType === 'mobile') {
        locationDetails.patient_address = patientAddress;
      } else if (currentLocationType === 'clinic') {
        locationDetails.clinic_address = therapistLocationDetails.clinic_address;
      } else if (currentLocationType === 'virtual') {
        locationDetails.meeting_link = "To be provided before appointment";
      }

      // Add the user ID to the request
      const { error } = await supabase
        .from('appointment_requests')
        .insert({
          therapist_id: therapistId,
          patient_id: user.id, // Add the patient_id from auth context
          requested_time: datetime.toISOString(),
          patient_notes: notes,
          location_type: currentLocationType,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p><strong>Therapist:</strong> {therapistName}</p>
            <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
          </div>

          <LocationTypeSelector
            value={currentLocationType}
            onChange={setCurrentLocationType}
            availableTypes={therapistLocationDetails.available_types}
            therapistLocationDetails={therapistLocationDetails}
          />
          
          {currentLocationType === 'mobile' && (
            <div className="space-y-2">
              <Label htmlFor="patientAddress">Your Address</Label>
              <Input
                id="patientAddress"
                placeholder="Enter your address for the mobile visit"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Additional Notes (optional)
            </label>
            <Textarea
              id="notes"
              placeholder="Any specific concerns or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
