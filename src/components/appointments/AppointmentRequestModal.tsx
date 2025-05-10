
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LocationTypeSelector from './LocationTypeSelector';
import { useTherapistDetails } from '@/hooks/useTherapistDetails';
import { useAppointmentSubmission } from '@/hooks/useAppointmentSubmission';

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
  const [patientAddress, setPatientAddress] = useState('');
  const [currentLocationType, setCurrentLocationType] = useState<'mobile' | 'clinic' | 'virtual'>(locationType);
  
  const { therapistLocationDetails } = useTherapistDetails(therapistId);
  const { isSubmitting, handleSubmit } = useAppointmentSubmission({
    therapistId,
    therapistName,
    onClose
  });

  const onSubmit = () => {
    handleSubmit({
      selectedDate,
      selectedTime,
      locationType: currentLocationType,
      patientAddress,
      notes
    });
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
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
