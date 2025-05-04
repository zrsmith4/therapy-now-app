import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import TherapistProfileSettings from '@/components/therapists/TherapistProfileSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TherapistProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
            specialties: ['Back Pain', 'Knee Rehabilitation', 'Sports Injuries']
          });
          setScheduleStats({
            totalSlots: 12
          });
          setLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
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
          
        if (therapistError) throw therapistError;
        
        setTherapistData(therapistInfo);

        // Get schedule statistics
        const { data: scheduleInfo, error: scheduleError } = await supabase
          .from('therapist_schedules')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (scheduleError) throw scheduleError;
        
        setScheduleStats({
          totalSlots: scheduleInfo?.length || 0,
          // Add more stats as needed
        });
      } catch (error) {
        console.error('Profile load error:', error);
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
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader 
        userType="therapist"
        userName={therapistData ? `${therapistData.first_name} ${therapistData.last_name}` : 'Therapist'}
      />
      
      <main className="container px-4 py-8">
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
                        {therapistData.specialties.map((specialty: string, index: number) => (
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
                    {/* Add more schedule statistics as needed */}
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
