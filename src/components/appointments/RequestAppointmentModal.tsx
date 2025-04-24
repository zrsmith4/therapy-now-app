import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LocationTypeSelector from './LocationTypeSelector';
import { PaymentForm } from './PaymentForm';

interface RequestAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapistId: string;
  therapistName: string;
  selectedDate: Date;
  selectedTime: string;
  locationType: 'mobile' | 'clinic' | 'virtual';
  onLocationTypeChange: (type: 'mobile' | 'clinic' | 'virtual') => void;
}

export default function RequestAppointmentModal({
  isOpen,
  onClose,
  therapistId,
  therapistName,
  selectedDate,
  selectedTime,
  locationType,
  onLocationTypeChange,
}: RequestAppointmentModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [appointmentRequest, setAppointmentRequest] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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
      
      setIsSubmitting(true);

      const datetime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { data: requestData, error } = await supabase
        .from('appointment_requests')
        .insert({
          therapist_id: therapistId,
          patient_id: user.id,
          requested_time: datetime.toISOString(),
          patient_notes: notes,
          location_type: locationType,
        })
        .select()
        .single();

      if (error) throw error;

      setAppointmentRequest(requestData);
      setShowPayment(true);
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

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment successful",
      description: "Your appointment request has been sent.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {showPayment ? "Complete Payment" : "Request Appointment"}
          </DialogTitle>
        </DialogHeader>
        
        {!showPayment ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p><strong>Therapist:</strong> {therapistName}</p>
              <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
            </div>

            <LocationTypeSelector
              value={locationType}
              onChange={onLocationTypeChange}
            />

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

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Proceed to Payment"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <PaymentForm
            appointmentRequest={appointmentRequest}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
