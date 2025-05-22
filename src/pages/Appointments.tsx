
import React from 'react'
import AppHeader from '@/components/layout/AppHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppointmentsList from '@/components/appointments/AppointmentsList'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext';

const Appointments = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  if (!user) {
    return null; // or redirect to login
  }

  // Only allow patient or therapist logic here, fallback to patient if for some reason admin reaches
  const pageUserType: 'patient' | 'therapist' =
    userRole === 'therapist' ? 'therapist' : 'patient';

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader
        userType={pageUserType}
        userName={user.email}
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

            {userRole === 'patient' && (
              <Button
                size="sm"
                onClick={() => navigate('/find-therapist')}
                className="bg-medical-primary hover:bg-medical-dark"
              >
                Book New Appointment
              </Button>
            )}
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
              <AppointmentsList userType={pageUserType} statusFilter="scheduled" />
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Completed Appointments</h2>
              <AppointmentsList userType={pageUserType} statusFilter="completed" />
            </div>
          </TabsContent>

          <TabsContent value="cancelled">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Cancelled Appointments</h2>
              <AppointmentsList userType={pageUserType} statusFilter="cancelled" />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Appointments;
