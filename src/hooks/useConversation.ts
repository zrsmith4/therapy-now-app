
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { handleError } from '@/utils/errorHandling';

export interface TherapistData {
  first_name: string;
  last_name: string;
}

export interface PatientData {
  first_name: string;
  last_name: string;
}

// Define a type for potential relation errors from Supabase
export type SelectQueryError = {
  error: true;
} & String;

// Update our interface to handle potential relation errors
export interface Conversation {
  id: string;
  patient_id: string;
  therapist_id: string;
  created_at: string;
  updated_at: string;
  // Make the relations optional or potentially errors
  patient?: PatientData | null | SelectQueryError;
  therapist?: TherapistData | null | SelectQueryError;
}

export function useConversation(conversationId: string) {
  const { user } = useAuth();

  return useQuery<Conversation | null>({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      try {
        if (!user || !conversationId) return null;

        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            patient:patient_id(first_name, last_name),
            therapist:therapist_id(first_name, last_name)
          `)
          .eq('id', conversationId)
          .single();

        if (error) throw error;
        return data as Conversation;
      } catch (error) {
        handleError(error, {
          context: 'fetching conversation details',
          toastDescription: 'Could not load conversation details'
        });
        return null;
      }
    },
    enabled: !!user && !!conversationId
  });
}
