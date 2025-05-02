
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface ConversationProps {
  id: string;
  patient_id: string;
  therapist_id: string;
  updated_at: string;
  patient?: {
    first_name: string;
    last_name: string;
  };
  therapist?: {
    first_name: string;
    last_name: string;
  };
  onSelect: (id: string) => void;
  selectedId?: string;
}

export const Conversation: React.FC<ConversationProps> = ({
  id,
  patient,
  therapist,
  updated_at,
  onSelect,
  selectedId,
  patient_id,
  therapist_id
}) => {
  const { user, userRole } = useAuth();
  const isSelected = id === selectedId;
  
  // Determine whose name to display based on the current user
  const displayName = userRole === 'patient'
    ? therapist ? `${therapist.first_name} ${therapist.last_name}` : 'Therapist'
    : patient ? `${patient.first_name} ${patient.last_name}` : 'Patient';
  
  return (
    <Button
      variant={isSelected ? 'default' : 'ghost'}
      className={`w-full justify-start p-4 ${isSelected ? '' : 'hover:bg-gray-100'}`}
      onClick={() => onSelect(id)}
    >
      <div className="flex flex-col items-start">
        <div className="font-medium">{displayName}</div>
        <div className="text-xs text-gray-500">
          Last updated: {format(new Date(updated_at), 'MMM d, h:mm a')}
        </div>
      </div>
    </Button>
  );
};

interface ConversationListProps {
  onSelectConversation: (id: string) => void;
  selectedConversationId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedConversationId
}) => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const { data: conversations, isLoading, error, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      try {
        if (!user) throw new Error('User not authenticated');

        let query = supabase
          .from('conversations')
          .select(`
            *,
            patient:patient_id(first_name, last_name),
            therapist:therapist_id(first_name, last_name)
          `);

        // Filter based on user role
        if (userRole === 'patient') {
          query = query.eq('patient_id', user.id);
        } else if (userRole === 'therapist') {
          query = query.eq('therapist_id', user.id);
        }

        const { data, error } = await query.order('updated_at', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching conversations:', error);
        throw new Error('Failed to load conversations');
      }
    },
    enabled: !!user && !!userRole
  });

  useEffect(() => {
    // Subscribe to conversation updates
    const channel = supabase
      .channel('conversations')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'conversations' },
        (payload) => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded">
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Failed to load conversations</p>
        <Button variant="outline" className="mt-2" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <Conversation
          key={conversation.id}
          id={conversation.id}
          patient={conversation.patient}
          therapist={conversation.therapist}
          patient_id={conversation.patient_id}
          therapist_id={conversation.therapist_id}
          updated_at={conversation.updated_at}
          onSelect={onSelectConversation}
          selectedId={selectedConversationId}
        />
      ))}
    </div>
  );
};

export default ConversationList;
