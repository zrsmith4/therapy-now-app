
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import TherapistProfileSettings from '@/components/therapists/TherapistProfileSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

const TherapistProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [therapistData, setTherapistData] = useState<any>(null);
  const [scheduleStats, setScheduleStats] = useState<any>(null);

  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                        window.location.hostname.includes('lovable.app') || 
                        window.location.hostname === 'localhost';

  useEffect(() => {
    const checkSession = async () => {
      try {
        // If in development mode, use mock data
        if (isDevelopment) {
          console.log('Development mode: Using mock therapist data');
          setUserId('mock-therapist-id');
          setTherapistData({
            first_name: 'Demo',
            last_name: 'Therapist',
            years_of_experience: 5,
            education: 'Sample University, PT Degree',
            specialties: ['Back Pain', 'Knee Rehabilitation', 'Sports Injuries'],
            phone: '555-987-6543',
            address: '456 Clinic Ave',
            city: 'Medical City',
            state: 'CA',
            zip_code: '54321',
            license_number: 'PT12345',
            license_state: 'CA',
            bio: 'Experienced physical therapist with a focus on sports rehabilitation and injury prevention.',
            service_options: ['In-Clinic', 'Mobile', 'Telehealth'],
            has_mobile_equipment: true,
            travel_distance: 20
          });
          setScheduleStats({
            totalSlots: 12,
            upcomingAppointments: 3,
            availableSlots: 9
          });
          setLoading(false);
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          navigate('/auth');
          return;
        }
        
        setUserId(session.user.id);
        
        // Get therapist data
        const { data: therapistInfo, error: therapistError } = await supabase
          .from('therapists')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (therapistError) {
          console.error('Therapist data error:', therapistError);
          throw therapistError;
        }
        
        setTherapistData(therapistInfo);

        // Get schedule statistics
        const { data: scheduleInfo, error: scheduleError } = await supabase
          .from('therapist_schedules')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (scheduleError) {
          console.error('Schedule data error:', scheduleError);
          throw scheduleError;
        }
        
        // Get upcoming appointments count
        const { count: appointmentCount, error: appointmentError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('therapist_id', session.user.id)
          .gt('start_time', new Date().toISOString());
          
        if (appointmentError) {
          console.error('Appointment count error:', appointmentError);
          // Non-critical, continue
        }
        
        setScheduleStats({
          totalSlots: scheduleInfo?.length || 0,
          upcomingAppointments: appointmentCount || 0,
          availableSlots: (scheduleInfo?.length || 0) - (appointmentCount || 0)
        });
      } catch (error: any) {
        console.error('Profile load error:', error);
        setError(error?.message || 'Unable to load your profile information');
        toast({
          variant: 'destructive',
          title: 'Error loading profile',
          description: 'Unable to load your profile information.',
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, [navigate, toast, isDevelopment]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader userType="therapist" isLoading={true} />
        
        <main className="container px-4 py-8 mt-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
          
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/4" />
            
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            
            <div className="border rounded-md p-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !isDevelopment) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader userType="therapist" userName="Error" />
        
        <main className="container px-4 py-8 mt-16">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error Loading Profile</AlertTitle>
            <AlertDescription>
              {error}
              <button 
                onClick={() => window.location.reload()} 
                className="block mt-2 underline"
              >
                Click here to try again
              </button>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader 
        userType="therapist"
        userName={therapistData ? `${therapistData.first_name} ${therapistData.last_name}` : 'Therapist'}
      />
      
      <main className="container px-4 py-8 mt-16">
        {userId && therapistData && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile Settings</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Specialties</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {therapistData.specialties?.map((specialty: string, index: number) => (
                          <span 
                            key={index}
                            className="bg-medical-light text-medical-primary px-2 py-1 rounded-full text-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Experience</h4>
                      <p className="text-gray-600">{therapistData.years_of_experience} years</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Education</h4>
                      <p className="text-gray-600">{therapistData.education}</p>
                    </div>
                    {therapistData.bio && (
                      <div>
                        <h4 className="font-medium">Bio</h4>
                        <p className="text-gray-600">{therapistData.bio}</p>
                      </div>
                    )}
                    {therapistData.service_options?.length > 0 && (
                      <div>
                        <h4 className="font-medium">Service Types</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {therapistData.service_options.map((option: string, index: number) => (
                            <span 
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      You have {scheduleStats?.totalSlots || 0} upcoming available time slots.
                    </p>
                    {scheduleStats?.upcomingAppointments !== undefined && (
                      <p className="text-gray-600">
                        <span className="font-medium">{scheduleStats.upcomingAppointments}</span> scheduled appointments
                      </p>
                    )}
                    {scheduleStats?.availableSlots !== undefined && (
                      <p className="text-gray-600">
                        <span className="font-medium">{scheduleStats.availableSlots}</span> available slots
                      </p>
                    )}
                    <div className="pt-2">
                      <a 
                        href="/therapist-dashboard/schedule" 
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Manage your schedule →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <TherapistProfileSettings 
              userId={userId}
              initialData={therapistData}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default TherapistProfile;
