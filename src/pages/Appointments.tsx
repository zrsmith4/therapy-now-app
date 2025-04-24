
import React, { useState } from 'react'
import AppHeader from '@/components/layout/AppHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppointmentsList from '@/components/appointments/AppointmentsList'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Appointments = () => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState<'patient' | 'therapist'>('patient')
  
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
              <AppointmentsList userType={userType} />
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Completed Appointments</h2>
              <div className="text-center py-4">
                <p className="text-slate-500">You don't have any completed appointments</p>
              </div>
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
  );
};

export default Appointments;
