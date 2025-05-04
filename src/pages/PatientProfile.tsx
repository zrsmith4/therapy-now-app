
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import ProfileSettings from '@/components/patients/PatientProfileSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

const PatientProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any>(null);
  
  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                        window.location.hostname.includes('lovable.app') || 
                        window.location.hostname === 'localhost';

  useEffect(() => {
    const checkSession = async () => {
      try {
        // If in development mode, use mock data
        if (isDevelopment) {
          console.log('Development mode: Using mock patient data');
          setUserId('mock-patient-id');
          setPatientData({
            first_name: 'Demo',
            last_name: 'Patient',
            phone: '555-123-4567',
            date_of_birth: '1990-01-01',
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip_code: '12345',
          });
          setMedicalHistory({
            primary_concern: 'Lower back pain',
            pain_level: 'Moderate',
            injury_location: 'Lumbar spine',
            current_medications: 'None',
            treatment_goal: 'Return to normal activity',
            previous_treatment: 'Physical therapy, 6 months ago'
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
        
        // Get patient data
        const { data: patientInfo, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (patientError) {
          console.error('Patient data error:', patientError);
          throw patientError;
        }
        
        setPatientData(patientInfo);

        // Get medical history
        const { data: medicalInfo, error: medicalError } = await supabase
          .from('patient_medical_history')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (medicalError && medicalError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" which is okay for medical history
          console.error('Medical history error:', medicalError);
          throw medicalError;
        }
        
        setMedicalHistory(medicalInfo);
      } catch (error: any) {
        console.error('Profile load error:', error);
        setError(error?.message || 'Unable to load your profile information');
        toast({
          variant: 'destructive',
          title: 'Error loading profile',
          description: 'Unable to load your profile information. Please refresh the page and try again.',
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
        <AppHeader userType="patient" isLoading={true} />
        
        <main className="container px-4 py-8 mt-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
          
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/4" />
            
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
        <AppHeader userType="patient" userName="Error" />
        
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
        userType="patient"
        userName={patientData ? `${patientData.first_name} ${patientData.last_name}` : 'Patient'}
      />
      
      <main className="container px-4 py-8 mt-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          
          <Tabs defaultValue="personal">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="medical">Medical History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              {userId && patientData && (
                <ProfileSettings 
                  userId={userId}
                  initialData={patientData}
                />
              )}
            </TabsContent>
            
            <TabsContent value="medical">
              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                  {medicalHistory ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Primary Concern</h4>
                        <p className="text-gray-600">{medicalHistory.primary_concern}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Pain Level</h4>
                        <p className="text-gray-600">{medicalHistory.pain_level}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Injury Location</h4>
                        <p className="text-gray-600">{medicalHistory.injury_location}</p>
                      </div>
                      {medicalHistory.treatment_goal && (
                        <div>
                          <h4 className="font-medium">Treatment Goal</h4>
                          <p className="text-gray-600">{medicalHistory.treatment_goal}</p>
                        </div>
                      )}
                      {medicalHistory.previous_treatment && (
                        <div>
                          <h4 className="font-medium">Previous Treatment</h4>
                          <p className="text-gray-600">{medicalHistory.previous_treatment}</p>
                        </div>
                      )}
                      {medicalHistory.current_medications && (
                        <div>
                          <h4 className="font-medium">Current Medications</h4>
                          <p className="text-gray-600">{medicalHistory.current_medications}</p>
                        </div>
                      )}
                      {medicalHistory.surgical_history && (
                        <div>
                          <h4 className="font-medium">Surgical History</h4>
                          <p className="text-gray-600">{medicalHistory.surgical_history}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">No medical history information available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
