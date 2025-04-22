
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WelcomeSection from './WelcomeSection';
import QuickActionCard from './QuickActionCard';
import { Filter, Clock, CalendarCheck, User } from "lucide-react";
import { UserType } from '@/components/landing/UserTypeSelection';

interface UserDashboardProps {
  userType: UserType;
}

const UserDashboard = ({ userType }: UserDashboardProps) => {
  const navigate = useNavigate();
  
  const demoAppointment = {
    date: 'Tuesday, May 2',
    time: '10:00 AM',
    with: userType === 'patient' ? 'Dr. Sarah Johnson' : 'John Smith',
    locationType: 'clinic' as const
  };

  return (
    <main className="container px-4 py-8">
      <WelcomeSection
        userName={userType === 'patient' ? 'Alex' : 'Sarah'}
        userType={userType}
        nextAppointment={demoAppointment}
        onActionClick={() => {
          if (userType === 'patient') {
            navigate('/find-therapist');
          } else {
            navigate('/schedule');
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
            <p className="text-slate-500">You have no upcoming appointments scheduled.</p>
            
            <button 
              onClick={() => {
                if (userType === 'patient') {
                  navigate('/find-therapist');
                } else {
                  navigate('/schedule');
                }
              }}
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
              <p className="text-slate-500">You don't have any patients yet.</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </main>
  );
};

export default UserDashboard;
