
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const datetime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase
        .from('appointment_requests')
        .insert({
          therapist_id: therapistId,
          requested_time: datetime.toISOString(),
          patient_notes: notes,
          location_type: locationType,
        });

      if (error) throw error;

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
            <p><strong>Location:</strong> {locationType}</p>
          </div>

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
