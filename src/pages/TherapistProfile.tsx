
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import TherapistProfileSettings from '@/components/therapists/TherapistProfileSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TherapistProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [therapistName, setTherapistName] = useState('');

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
        
        // Get therapist data
        const { data: therapistData, error: therapistError } = await supabase
          .from('therapists')
          .select('first_name, last_name')
          .eq('user_id', data.session.user.id)
          .single();
          
        if (therapistError && therapistError.code !== 'PGRST116') {
          throw therapistError;
        }
        
        if (therapistData) {
          setTherapistName(`${therapistData.first_name} ${therapistData.last_name}`);
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
        userType="therapist" 
        userName={therapistName || 'Therapist'}
      />
      
      <main className="container px-4 py-8">
        {userId && <TherapistProfileSettings userId={userId} />}
      </main>
    </div>
  );
};

export default TherapistProfile;
