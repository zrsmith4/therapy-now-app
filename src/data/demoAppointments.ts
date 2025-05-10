
export const demoAppointments = [
  {
    id: '1',
    date: 'Tuesday, May 2, 2023',
    time: '10:00 AM',
    location: {
      type: 'clinic' as const,
      address: '123 Therapy Center, Suite 200'
    },
    patient: {
      name: 'John Smith'
    },
    status: 'upcoming' as const
  },
  {
    id: '2',
    date: 'Wednesday, May 3, 2023',
    time: '2:30 PM',
    location: {
      type: 'mobile' as const,
      address: '456 Patient Home Ave'
    },
    patient: {
      name: 'Emma Johnson'
    },
    status: 'upcoming' as const
  },
  {
    id: '3',
    date: 'Monday, May 1, 2023',
    time: '11:15 AM',
    location: {
      type: 'virtual' as const
    },
    patient: {
      name: 'Michael Brown'
    },
    status: 'completed' as const
  }
];

export const demoPatientNotes = [
  {
    id: '1',
    patientName: 'Michael Brown',
    appointmentDate: 'May 1, 2023 at 11:15 AM',
    locationType: 'virtual' as const,
    treatmentType: 'Post-Surgery Rehabilitation',
    notes: 'Patient reports decreased pain levels (3/10) compared to previous session (5/10). ROM improved by approximately 15 degrees in flexion. Exercises tolerated well with minimal compensatory movements. Progressed to resistance band exercises. Patient to continue home exercise program 2x daily.'
  }
];

export const nextAppointment = {
  date: 'Tuesday, May 2',
  time: '10:00 AM',
  with: 'John Smith',
  locationType: 'clinic' as const
};
