
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
}

interface UserDetails {
  first_name: string;
  last_name: string;
}

interface Conversation {
  id: string;
  patient_id: string;
  therapist_id: string;
  created_at: string;
  updated_at: string;
  unread_count: number;
  other_user_details: UserDetails;
  last_message?: {
    content: string;
    created_at: string;
  };
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedConversationId
}) => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch conversations
  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!user || !userRole) return;

      const otherUserRole = userRole === 'patient' ? 'therapist' : 'patient';
      const userIdField = userRole === 'patient' ? 'patient_id' : 'therapist_id';
      const otherUserIdField = userRole === 'patient' ? 'therapist_id' : 'patient_id';

      // Get conversations where the user is either the patient or the therapist
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .eq(userIdField, user.id)
        .order('updated_at', { ascending: false });
      
      if (conversationsError) throw conversationsError;
      
      if (!conversationsData || conversationsData.length === 0) {
        setConversations([]);
        setFilteredConversations([]);
        setIsLoading(false);
        return;
      }

      // Fetch additional details for each conversation
      const conversationsWithDetails = await Promise.all(
        conversationsData.map(async (conversation) => {
          // Count unread messages
          const { count: unreadCount, error: countError } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .eq('receiver_id', user.id)
            .is('read_at', null);
          
          if (countError) throw countError;
          
          // Get other user's details (either patient or therapist)
          let otherUserDetails: UserDetails = { first_name: 'Unknown', last_name: 'User' };
          const otherUserId = conversation[otherUserIdField as keyof typeof conversation] as string;
          
          if (otherUserRole === 'patient') {
            const { data: patientData, error: patientError } = await supabase
              .from('patients')
              .select('first_name, last_name')
              .eq('user_id', otherUserId)
              .single();
            
            if (patientError) {
              console.error('Error fetching patient details:', patientError);
            } else if (patientData) {
              otherUserDetails = patientData;
            }
          } else {
            const { data: therapistData, error: therapistError } = await supabase
              .from('therapists')
              .select('first_name, last_name')
              .eq('user_id', otherUserId)
              .single();
            
            if (therapistError) {
              console.error('Error fetching therapist details:', therapistError);
            } else if (therapistData) {
              otherUserDetails = therapistData;
            }
          }

          // Get the last message in this conversation
          const { data: lastMessageData, error: lastMessageError } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (lastMessageError && lastMessageError.code !== 'PGRST116') {
            console.error('Error fetching last message:', lastMessageError);
          }

          return {
            ...conversation,
            unread_count: unreadCount || 0,
            other_user_details: otherUserDetails,
            last_message: lastMessageData || undefined
          };
        })
      );

      setConversations(conversationsWithDetails);
      setFilteredConversations(conversationsWithDetails);
    } catch (err) {
      handleError(err, {
        context: 'fetching conversations',
        toastTitle: "Error", 
        toastDescription: "Failed to load conversations"
      });
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to changes in conversations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversation_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          fetchConversations();
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }

    const filtered = conversations.filter(conversation => {
      const otherUserName = `${conversation.other_user_details.first_name} ${conversation.other_user_details.last_name}`.toLowerCase();
      return otherUserName.includes(searchQuery.toLowerCase());
    });

    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  // Fetch conversations on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, userRole]);

  // Format the preview text for the last message
  const formatMessagePreview = (content: string) => {
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={fetchConversations} 
          variant="outline" 
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-500">No conversations yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Your message threads with therapists will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search conversations..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center p-3 rounded-md cursor-pointer ${
              selectedConversationId === conversation.id 
                ? 'bg-slate-100'
                : 'hover:bg-slate-50'
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {conversation.other_user_details.first_name} {conversation.other_user_details.last_name}
                </h3>
                {conversation.unread_count > 0 && (
                  <span className="bg-medical-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                    {conversation.unread_count}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {conversation.last_message ? (
                  <span>{formatMessagePreview(conversation.last_message.content)}</span>
                ) : (
                  <span>No messages yet</span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {conversation.last_message 
                  ? format(new Date(conversation.last_message.created_at), 'MMM d, h:mm a')
                  : format(new Date(conversation.updated_at), 'MMM d, h:mm a')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
