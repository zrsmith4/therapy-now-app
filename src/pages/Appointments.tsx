
import React, { useState } from 'react'
import AppHeader from '@/components/layout/AppHeader'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'

// Demo appointment data for patients
const demoPatientAppointments = [
  {
    id: '1',
    date: 'Tuesday, May 2, 2023',
    time: '10:00 AM',
    location: {
      type: 'clinic' as const,
      address: '123 Therapy Center, Suite 200'
    },
    therapist: {
      name: 'Dr. Sarah Johnson',
      specialty: 'Sports Rehabilitation'
    },
    status: 'upcoming' as const
  },
  {
    id: '2',
    date: 'Friday, May 12, 2023',
    time: '2:30 PM',
    location: {
      type: 'mobile' as const,
      address: 'Your Home'
    },
    therapist: {
      name: 'Dr. Michael Chen',
      specialty: 'Orthopedic Therapy'
    },
    status: 'upcoming' as const
  },
  {
    id: '3',
    date: 'Monday, April 24, 2023',
    time: '11:15 AM',
    location: {
      type: 'virtual' as const
    },
    therapist: {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Neurological Rehabilitation'
    },
    status: 'completed' as const
  }
]

// Demo appointment data for therapists
const demoTherapistAppointments = [
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

const Appointments = () => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState<'patient' | 'therapist'>('patient')
  
  const appointments = userType === 'patient' ? demoPatientAppointments : demoTherapistAppointments
  
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader 
        userType={userType} 
        userName={userType === 'patient' ? 'Alex Smith' : 'Dr. Sarah Johnson'} 
      />
      
      <main className="container px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Appointments</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar View</span>
            </Button>
            
            {/* For demo purposes: toggle between patient/therapist view */}
            <Button
              size="sm"
              onClick={() => setUserType(userType === 'patient' ? 'therapist' : 'patient')}
              className="bg-medical-primary hover:bg-medical-dark"
            >
              Toggle to {userType === 'patient' ? 'Therapist' : 'Patient'} View
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
              
              {appointments
                .filter(apt => apt.status === 'upcoming')
                .map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    date={appointment.date}
                    time={appointment.time}
                    location={appointment.location}
                    therapist={'therapist' in appointment ? appointment.therapist : undefined}
                    patient={'patient' in appointment ? appointment.patient : undefined}
                    status={appointment.status}
                    onManage={() => {}}
                    userType={userType}
                  />
                ))}
              
              {appointments.filter(apt => apt.status === 'upcoming').length === 0 && (
                <div className="text-center py-4">
                  <p className="text-slate-500 mb-4">You have no upcoming appointments</p>
                  {userType === 'patient' && (
                    <Button onClick={() => navigate('/find-therapist')}>
                      Find a Therapist
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Completed Appointments</h2>
              
              {appointments
                .filter(apt => apt.status === 'completed')
                .map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    date={appointment.date}
                    time={appointment.time}
                    location={appointment.location}
                    therapist={'therapist' in appointment ? appointment.therapist : undefined}
                    patient={'patient' in appointment ? appointment.patient : undefined}
                    status={appointment.status}
                    onManage={() => {}}
                    userType={userType}
                  />
                ))}
              
              {appointments.filter(apt => apt.status === 'completed').length === 0 && (
                <div className="text-center py-4">
                  <p className="text-slate-500">You don't have any completed appointments</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="cancelled">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Cancelled Appointments</h2>
              
              <div className="text-center py-4">
                <p className="text-slate-500">You don't have any cancelled appointments</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default Appointments
