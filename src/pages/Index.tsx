
import React, { useState } from 'react'
import AppHeader from '@/components/layout/AppHeader'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarCheck, User, Filter, Clock } from "lucide-react"
import QuickActionCard from '@/components/dashboard/QuickActionCard'
import { useNavigate } from 'react-router-dom'

// Demo user choice for preview
const Index = () => {
  const [userType, setUserType] = useState<'patient' | 'therapist' | null>(null)
  const navigate = useNavigate()
  
  if (!userType) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader />
        
        <main className="container px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 text-medical-primary">
              Heal<span className="text-medical-secondary">on</span><span className="text-medical-tertiary">Wheels</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12">
              On-demand physical therapy when and where you need it
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div 
                className="rounded-lg p-8 bg-white shadow-md border-2 border-transparent hover:border-medical-primary cursor-pointer transition-all"
                onClick={() => setUserType('patient')}
              >
                <User className="w-12 h-12 text-medical-primary mb-4 mx-auto" />
                <h2 className="text-xl font-bold mb-2">I'm a Patient</h2>
                <p className="text-slate-500">
                  Find and book appointments with qualified physical therapists when and where you need them.
                </p>
              </div>
              
              <div 
                className="rounded-lg p-8 bg-white shadow-md border-2 border-transparent hover:border-medical-tertiary cursor-pointer transition-all"
                onClick={() => setUserType('therapist')}
              >
                <User className="w-12 h-12 text-medical-tertiary mb-4 mx-auto" />
                <h2 className="text-xl font-bold mb-2">I'm a Therapist</h2>
                <p className="text-slate-500">
                  Manage your schedule, set your availability, and connect with patients who need your expertise.
                </p>
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">How It Works</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-medical-light rounded-full flex items-center justify-center text-medical-primary font-bold text-xl mb-4 mx-auto">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Book Your Appointment</h3>
                  <p className="text-sm text-slate-500">
                    Choose a therapist and schedule an appointment at your convenience
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-medical-light rounded-full flex items-center justify-center text-medical-primary font-bold text-xl mb-4 mx-auto">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Choose Your Location</h3>
                  <p className="text-sm text-slate-500">
                    Decide if you want the therapist to come to you, visit their clinic, or have a virtual session
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-medical-light rounded-full flex items-center justify-center text-medical-primary font-bold text-xl mb-4 mx-auto">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Receive Expert Care</h3>
                  <p className="text-sm text-slate-500">
                    Get the physical therapy you need from qualified professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
  
  // Demo data
  const demoAppointment = {
    date: 'Tuesday, May 2',
    time: '10:00 AM',
    with: userType === 'patient' ? 'Dr. Sarah Johnson' : 'John Smith',
    locationType: 'clinic' as const
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader 
        userType={userType} 
        userName={userType === 'patient' ? 'Alex Smith' : 'Dr. Sarah Johnson'} 
      />
      
      <main className="container px-4 py-8">
        <WelcomeSection
          userName={userType === 'patient' ? 'Alex' : 'Sarah'}
          userType={userType}
          nextAppointment={demoAppointment}
          onActionClick={() => {
            if (userType === 'patient') {
              navigate('/find-therapist')
            } else {
              navigate('/schedule')
            }
          }}
        />
        
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            {userType === 'therapist' && (
              <TabsTrigger value="patients">Patients</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-3 gap-6">
              {userType === 'patient' ? (
                <>
                  <QuickActionCard
                    title="Find a Therapist"
                    description="Browse and filter therapists based on your needs"
                    icon={Filter}
                    buttonText="Find Therapist"
                    onClick={() => navigate('/find-therapist')}
                  />
                  <QuickActionCard
                    title="Book On-Demand"
                    description="Need therapy right now? Book an available therapist"
                    icon={Clock}
                    buttonText="View Available Now"
                    onClick={() => navigate('/find-therapist')}
                  />
                  <QuickActionCard
                    title="My Appointments"
                    description="View and manage your upcoming appointments"
                    icon={CalendarCheck}
                    buttonText="View Appointments"
                    onClick={() => navigate('/appointments')}
                  />
                </>
              ) : (
                <>
                  <QuickActionCard
                    title="Set Availability"
                    description="Update your schedule and availability for bookings"
                    icon={CalendarCheck}
                    buttonText="Manage Schedule"
                    onClick={() => navigate('/schedule')}
                  />
                  <QuickActionCard
                    title="Patient Records"
                    description="Access and update your patient records"
                    icon={User}
                    buttonText="View Patients"
                    onClick={() => navigate('/patients')}
                  />
                  <QuickActionCard
                    title="Today's Appointments"
                    description="View your appointments for today"
                    icon={Clock}
                    buttonText="View Today"
                    onClick={() => navigate('/appointments')}
                  />
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="appointments">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Your Upcoming Appointments</h2>
              {/* Appointment content would go here */}
              <p className="text-slate-500">You have no upcoming appointments scheduled.</p>
              
              <button 
                onClick={() => userType === 'patient' ? navigate('/find-therapist') : navigate('/schedule')}
                className="mt-4 text-medical-primary font-medium hover:underline"
              >
                {userType === 'patient' ? 'Find a therapist' : 'Set your availability'}
              </button>
            </div>
          </TabsContent>
          
          {userType === 'therapist' && (
            <TabsContent value="patients">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Your Patients</h2>
                {/* Patient list would go here */}
                <p className="text-slate-500">You don't have any patients yet.</p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}

export default Index
