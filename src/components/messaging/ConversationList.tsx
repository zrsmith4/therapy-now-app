
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedConversationId
}) => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
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
        .eq(userIdField, user.id);
      
      if (conversationsError) throw conversationsError;
      
      if (!conversationsData || conversationsData.length === 0) {
        setConversations([]);
        setFilteredConversations([]);
        setIsLoading(false);
        return;
      }

      // Fetch unread count for each conversation
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

          return {
            ...conversation,
            unread_count: unreadCount || 0,
            other_user_details: otherUserDetails
          };
        })
      );

      // Sort conversations by updated_at date (most recent first)
      const sortedConversations = conversationsWithDetails.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      setConversations(sortedConversations);
      setFilteredConversations(sortedConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
      toast({ 
        title: "Error", 
        description: "Failed to load conversations", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <p className="text-gray-500">No conversations yet</p>
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
      
      <div className="space-y-2">
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
              <p className="text-sm text-gray-500 truncate">
                {new Date(conversation.updated_at).toLocaleDateString()} {new Date(conversation.updated_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
