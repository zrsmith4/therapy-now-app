
import React, { useState } from 'react'
import AppHeader from '@/components/layout/AppHeader'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AvailabilityToggle from '@/components/therapists/AvailabilityToggle'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import PatientNoteCard from '@/components/emr/PatientNoteCard'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Demo appointment data
const demoAppointments = [
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
]

// Demo patient notes
const demoPatientNotes = [
  {
    id: '1',
    patientName: 'Michael Brown',
    appointmentDate: 'May 1, 2023 at 11:15 AM',
    locationType: 'virtual' as const,
    treatmentType: 'Post-Surgery Rehabilitation',
    notes: 'Patient reports decreased pain levels (3/10) compared to previous session (5/10). ROM improved by approximately 15 degrees in flexion. Exercises tolerated well with minimal compensatory movements. Progressed to resistance band exercises. Patient to continue home exercise program 2x daily.'
  }
]

const TherapistDashboard = () => {
  const navigate = useNavigate()
  const [isAvailable, setIsAvailable] = useState(false)
  
  const demoAppointment = {
    date: 'Tuesday, May 2',
    time: '10:00 AM',
    with: 'John Smith',
    locationType: 'clinic' as const
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader 
        userType="therapist" 
        userName="Dr. Sarah Johnson" 
      />
      
      <main className="container px-4 py-8">
        <WelcomeSection
          userName="Sarah"
          userType="therapist"
          nextAppointment={demoAppointment}
          onActionClick={() => navigate('/schedule')}
        />
        
        <div className="mb-8">
          <AvailabilityToggle
            isAvailable={isAvailable}
            onToggle={setIsAvailable}
          />
        </div>
        
        <Tabs defaultValue="appointments">
          <TabsList className="mb-6">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patient Notes</TabsTrigger>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Calendar View</span>
                </Button>
              </div>
              
              {demoAppointments.map(appointment => (
                <AppointmentCard
                  key={appointment.id}
                  date={appointment.date}
                  time={appointment.time}
                  location={appointment.location}
                  patient={appointment.patient}
                  status={appointment.status}
                  onManage={() => {}}
                  userType="therapist"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="patients">
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
          </TabsContent>
          
          <TabsContent value="schedule">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Your Schedule</h2>
              <p className="text-slate-500 mb-4">
                Set your regular availability and schedule for advance booking
              </p>
              
              <div className="p-8 border rounded-lg bg-slate-50 text-center">
                <p className="mb-4">Schedule calendar would be displayed here</p>
                <Button>Set Regular Hours</Button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Location Preferences</h3>
                <p className="text-slate-500 mb-4">
                  Where are you willing to provide therapy services?
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 text-center bg-medical-light">
                    <h4 className="font-medium mb-1">Mobile</h4>
                    <p className="text-xs text-slate-500">Visit patients at their location</p>
                    <Button size="sm" className="mt-2 bg-medical-secondary hover:bg-medical-secondary/90">Enabled</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <h4 className="font-medium mb-1">Clinic</h4>
                    <p className="text-xs text-slate-500">Patients visit your clinic</p>
                    <Button size="sm" variant="outline" className="mt-2">Enable</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center bg-medical-light">
                    <h4 className="font-medium mb-1">Virtual</h4>
                    <p className="text-xs text-slate-500">Remote video sessions</p>
                    <Button size="sm" className="mt-2 bg-medical-tertiary hover:bg-medical-tertiary/90">Enabled</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default TherapistDashboard
