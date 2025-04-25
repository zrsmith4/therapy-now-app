
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import ProfileSettings from '@/components/patients/PatientProfileSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PatientProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        setUserId(session.user.id);
        
        // Get patient data
        const { data: patientInfo, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (patientError) throw patientError;
        
        setPatientData(patientInfo);

        // Get medical history
        const { data: medicalInfo, error: medicalError } = await supabase
          .from('patient_medical_history')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (medicalError && medicalError.code !== 'PGRST116') {
          throw medicalError;
        }
        
        setMedicalHistory(medicalInfo);
      } catch (error) {
        console.error('Profile load error:', error);
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
  }, [navigate, toast]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader 
        userType="patient"
        userName={patientData ? `${patientData.first_name} ${patientData.last_name}` : 'Patient'}
      />
      
      <main className="container px-4 py-8">
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
                      {medicalHistory.current_medications && (
                        <div>
                          <h4 className="font-medium">Current Medications</h4>
                          <p className="text-gray-600">{medicalHistory.current_medications}</p>
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
