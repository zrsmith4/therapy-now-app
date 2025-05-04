
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                        window.location.hostname.includes('lovable.app') || 
                        window.location.hostname === 'localhost';
  
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // If in development mode, bypass auth check
        if (isDevelopment) {
          console.log('Development mode: Using test patient profile');
          navigate('/patient-profile');
          return;
        }
        
        if (!session) {
          navigate('/auth'); // Changed from '/login' to '/auth'
          return;
        }

        // Check if user is a patient
        const { data: patientData } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (patientData) {
          navigate('/patient-profile');
          return;
        }

        // Check if user is a therapist
        const { data: therapistData } = await supabase
          .from('therapists')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (therapistData) {
          navigate('/therapist-profile');
          return;
        }

        // If neither, redirect to home
        toast({
          variant: "destructive",
          title: "Profile not found",
          description: "Could not determine your user type.",
        });
        navigate('/');
      } catch (error) {
        console.error("Error checking user type:", error);
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: "There was an error determining your profile type.",
        });
        navigate('/');
      }
    };

    checkUserType();
  }, [navigate, toast, isDevelopment]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-gray-600 mb-4">Checking your profile type...</p>
      </div>
    </div>
  );
};

export default Profile;
