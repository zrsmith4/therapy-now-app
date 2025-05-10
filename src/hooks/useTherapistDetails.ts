
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TherapistLocationDetails {
  clinic_address?: string;
  available_types?: Array<'mobile' | 'clinic' | 'virtual'>;
}

export const useTherapistDetails = (therapistId: string) => {
  const [therapistLocationDetails, setTherapistLocationDetails] = useState<TherapistLocationDetails>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (therapistId) {
      fetchTherapistDetails();
    }
  }, [therapistId]);

  const fetchTherapistDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('therapists')
        .select('address, city, state, zip_code, service_options')
        .eq('user_id', therapistId)
        .single();

      if (error) throw error;

      if (data) {
        // Format clinic address
        const clinic_address = data.address ? 
          `${data.address}, ${data.city}, ${data.state} ${data.zip_code}` : 
          undefined;

        // Get available service types
        const available_types: Array<'mobile' | 'clinic' | 'virtual'> = 
          Array.isArray(data.service_options) ? 
            data.service_options.filter((option): option is 'mobile' | 'clinic' | 'virtual' => {
              return option === 'mobile' || option === 'clinic' || option === 'virtual';
            }) : 
            ['mobile', 'clinic', 'virtual'];

        setTherapistLocationDetails({ 
          clinic_address,
          available_types
        });
      }
    } catch (error) {
      console.error('Error fetching therapist details:', error);
      setError(error instanceof Error ? error : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    therapistLocationDetails,
    isLoading,
    error
  };
};
