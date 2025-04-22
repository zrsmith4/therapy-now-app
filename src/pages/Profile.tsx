
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUserType = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
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
      navigate('/');
    };

    checkUserType();
  }, [navigate]);

  return null;
};

export default Profile;
