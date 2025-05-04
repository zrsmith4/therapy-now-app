
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                        window.location.hostname.includes('lovable.app') || 
                        window.location.hostname === 'localhost';
  
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // If in development mode, bypass auth check
        if (isDevelopment) {
          console.log('Development mode: Using test patient profile');
          navigate('/patient-profile');
          return;
        }
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          navigate('/auth');
          return;
        }

        // Check if user is a patient
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (patientError) {
          console.error('Patient check error:', patientError);
          // Continue checking for therapist role
        }

        if (patientData) {
          navigate('/patient-profile');
          return;
        }

        // Check if user is a therapist
        const { data: therapistData, error: therapistError } = await supabase
          .from('therapists')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (therapistError) {
          console.error('Therapist check error:', therapistError);
          throw therapistError;
        }

        if (therapistData) {
          navigate('/therapist-profile');
          return;
        }

        // If neither, redirect to home with error message
        setError("Could not determine your user type");
        toast({
          variant: "destructive",
          title: "Profile not found",
          description: "Could not determine your user type.",
        });
        navigate('/');
      } catch (error: any) {
        console.error("Error checking user type:", error);
        setError(error?.message || "There was an error determining your profile type.");
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: "There was an error determining your profile type.",
        });
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserType();
  }, [navigate, toast, isDevelopment]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md w-full mb-4">
          <AlertTitle>Profile Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <p className="text-gray-600">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-xl text-gray-600">Checking your profile type...</p>
      </div>
      
      {isLoading && (
        <div className="mt-6 flex flex-col items-center">
          <div className="w-12 h-1 bg-blue-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
