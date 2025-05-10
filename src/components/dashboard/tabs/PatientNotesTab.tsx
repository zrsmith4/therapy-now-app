
import React from 'react';
import { Button } from "@/components/ui/button";
import PatientNoteCard from '@/components/emr/PatientNoteCard';
import { demoPatientNotes } from '@/data/demoAppointments';

const PatientNotesTab: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recent Patient Notes</h2>
      
      {demoPatientNotes.map(note => (
        <PatientNoteCard
          key={note.id}
          patientName={note.patientName}
          appointmentDate={note.appointmentDate}
          locationType={note.locationType}
          treatmentType={note.treatmentType}
          notes={note.notes}
          onEdit={() => {}}
          onViewComplete={() => {}}
        />
      ))}
      
      <div className="mt-4 text-center">
        <p className="text-slate-500 mb-2">View and manage all your patient records</p>
        <Button>View All Patient Records</Button>
      </div>
    </div>
  );
};

export default PatientNotesTab;
