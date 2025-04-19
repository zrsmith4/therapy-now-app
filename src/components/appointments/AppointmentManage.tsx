
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, ClipboardCheck, Clock, Send, Book } from "lucide-react";

interface AppointmentManageProps {
  open: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    date: string;
    time: string;
    patient: {
      name: string;
      email: string;
    };
    therapist: {
      name: string;
      specialty: string;
    };
    status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
    location: {
      type: 'mobile' | 'clinic' | 'virtual';
      address?: string;
    };
    treatmentType: string;
  };
  userType: 'patient' | 'therapist';
}

const AppointmentManage = ({ open, onClose, appointment, userType }: AppointmentManageProps) => {
  const { toast } = useToast();
  const [sessionNotes, setSessionNotes] = React.useState('');
  const [defaultTab, setDefaultTab] = React.useState('details');

  React.useEffect(() => {
    // Set the appropriate default tab based on appointment status
    if (appointment.status === 'upcoming') {
      setDefaultTab('details');
    } else if (appointment.status === 'in-progress') {
      setDefaultTab('note');
    } else if (appointment.status === 'completed') {
      setDefaultTab('history');
    }
  }, [appointment.status]);

  const handleCheckIn = () => {
    // Here you would update the appointment status to 'in-progress'
    toast({
      title: "Visit Started",
      description: "You have successfully checked in to this appointment.",
    });
    setDefaultTab('note');
  };

  const handleSaveNote = () => {
    if (!sessionNotes.trim()) {
      toast({
        variant: "destructive",
        title: "Note Required",
        description: "Please enter session notes before saving.",
      });
      return;
    }

    // Here you would save the note to the database
    toast({
      title: "Note Saved",
      description: "Your session notes have been saved successfully.",
    });
  };

  const handleCompleteVisit = () => {
    if (!sessionNotes.trim()) {
      toast({
        variant: "destructive",
        title: "Note Required",
        description: "Please complete session notes before wrapping up the visit.",
      });
      return;
    }

    // Here you would update the appointment status to 'completed'
    // and send the confirmation email to the patient
    toast({
      title: "Visit Completed",
      description: "The visit has been completed and a summary has been sent to the patient.",
    });

    onClose();
  };

  // Only show the therapist-specific actions if the user is a therapist
  const showTherapistActions = userType === 'therapist';

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>Appointment Details</SheetTitle>
          <SheetDescription>
            {appointment.date} at {appointment.time}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              {showTherapistActions && (
                <>
                  <TabsTrigger value="note">Session Note</TabsTrigger>
                  <TabsTrigger value="history">Patient History</TabsTrigger>
                </>
              )}
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appointment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-slate-500">Patient</h4>
                    <p>{appointment.patient.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-slate-500">Therapist</h4>
                    <p>{appointment.therapist.name} - {appointment.therapist.specialty}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-slate-500">Date & Time</h4>
                    <p>{appointment.date} at {appointment.time}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-slate-500">Location</h4>
                    <p>
                      {appointment.location.type === 'mobile' && 'Mobile Visit'}
                      {appointment.location.type === 'clinic' && 'Clinic Visit'}
                      {appointment.location.type === 'virtual' && 'Virtual Visit'}
                      {appointment.location.address && ` - ${appointment.location.address}`}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-slate-500">Treatment Type</h4>
                    <p>{appointment.treatmentType}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-slate-500">Status</h4>
                    <p className="capitalize">{appointment.status.replace('-', ' ')}</p>
                  </div>
                  
                  {showTherapistActions && appointment.status === 'upcoming' && (
                    <Button onClick={handleCheckIn} className="w-full mt-4 bg-medical-primary hover:bg-medical-dark">
                      <Clock className="mr-2 h-4 w-4" /> Check In / Start Visit
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {showTherapistActions && (
              <TabsContent value="note" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Session Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea 
                      placeholder="Enter detailed session notes here..."
                      className="min-h-[200px]"
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                    />
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleSaveNote}
                      >
                        <FileText className="mr-2 h-4 w-4" /> Save Note
                      </Button>
                      <Button 
                        className="flex-1 bg-medical-primary hover:bg-medical-dark"
                        onClick={handleCompleteVisit}
                      >
                        <ClipboardCheck className="mr-2 h-4 w-4" /> Complete Visit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {showTherapistActions && (
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Patient History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Book className="h-4 w-4 mr-2" /> Medical History
                      </h4>
                      <div className="text-sm space-y-2">
                        <p><span className="font-medium">Primary Concern:</span> Lower back pain, radiating to left leg</p>
                        <p><span className="font-medium">Pain Level:</span> 7/10</p>
                        <p><span className="font-medium">Previous Treatment:</span> Chiropractic care, 6 sessions</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2" /> Previous Visit Notes
                      </h4>
                      <div className="space-y-3">
                        <div className="text-sm border-l-2 border-medical-light pl-3 py-1">
                          <p className="font-medium">04/10/2025 - Dr. Smith</p>
                          <p>Patient reports improvement in pain levels after last session. Completed full ROM exercises. Recommended continued home exercise program with emphasis on core stabilization.</p>
                        </div>
                        <div className="text-sm border-l-2 border-medical-light pl-3 py-1">
                          <p className="font-medium">04/03/2025 - Dr. Smith</p>
                          <p>Initial evaluation. Patient presents with lower back pain radiating to left leg. Positive straight leg raise. Limited lumbar flexion. Treatment included manual therapy and patient education.</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Send className="mr-2 h-4 w-4" /> Send Evaluation to Physician
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppointmentManage;
