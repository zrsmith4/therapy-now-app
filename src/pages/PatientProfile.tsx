
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import PatientProfileSettings from '@/components/patients/PatientProfileSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PatientProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!data.session) {
          // No active session, redirect to login
          navigate('/login');
          return;
        }
        
        setUserId(data.session.user.id);
        
        // Get patient data
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('first_name, last_name')
          .eq('user_id', data.session.user.id)
          .single();
          
        if (patientError && patientError.code !== 'PGRST116') {
          throw patientError;
        }
        
        if (patientData) {
          setPatientName(`${patientData.first_name} ${patientData.last_name}`);
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          variant: 'destructive',
          title: 'Authentication error',
          description: 'Please log in to access your profile.',
        });
        navigate('/login');
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
        userName={patientName || 'Patient'}
      />
      
      <main className="container px-4 py-8">
        {userId && <PatientProfileSettings userId={userId} />}
      </main>
    </div>
  );
};

export default PatientProfile;
