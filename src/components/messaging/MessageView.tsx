
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Flag } from 'lucide-react';
import ReportForm from './ReportForm';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read_at: string | null;
}

interface MessageViewProps {
  conversationId: string;
}

const MessageView: React.FC<MessageViewProps> = ({ conversationId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportedMessageId, setReportedMessageId] = useState<string | null>(null);

  // Fetch conversation details
  const { data: conversation } = useQuery({
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
        return data;
      } catch (error) {
        console.error('Error fetching conversation details:', error);
        return null;
      }
    },
    enabled: !!user && !!conversationId
  });

  // Fetch messages for the conversation
  const { data: messages, isLoading, error, refetch } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      try {
        if (!user || !conversationId) return [];

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        return data as Message[];
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Failed to load messages');
      }
    },
    enabled: !!user && !!conversationId
  });

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, refetch]);

  // Mark messages as read
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!user || !messages || messages.length === 0) return;

      const unreadMessages = messages
        .filter(msg => msg.receiver_id === user.id && !msg.read_at);

      if (unreadMessages.length > 0) {
        try {
          const updates = unreadMessages.map(msg => ({
            id: msg.id,
            read_at: new Date().toISOString()
          }));

          for (const update of updates) {
            await supabase
              .from('messages')
              .update({ read_at: update.read_at })
              .eq('id', update.id);
          }

          // Refetch to update the UI
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };

    markMessagesAsRead();
  }, [messages, user, conversationId, queryClient]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!user || !conversationId || !newMessage.trim()) return;

    try {
      // Determine the receiver_id based on conversation
      const receiverId = conversation?.patient_id === user.id 
        ? conversation.therapist_id 
        : conversation.patient_id;

      if (!receiverId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not determine message recipient",
        });
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          receiver_id: receiverId,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "Please try again",
      });
    }
  };

  const handleOpenReport = (messageId: string) => {
    setReportedMessageId(messageId);
    setIsReportOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="h-10 w-3/4 mb-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Failed to load messages</p>
        <Button variant="outline" className="mt-2" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!messages) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No messages in this conversation yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.sender_id === user?.id;
          return (
            <div 
              key={message.id} 
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`relative max-w-[80%] p-3 rounded-lg ${
                  isCurrentUser 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {format(new Date(message.created_at), 'h:mm a')}
                  </span>
                  {!isCurrentUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100"
                      onClick={() => handleOpenReport(message.id)}
                    >
                      <Flag className="h-3 w-3" />
                      <span className="sr-only">Report message</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      </div>

      {isReportOpen && reportedMessageId && (
        <ReportForm 
          messageId={reportedMessageId}
          conversationId={conversationId}
          onClose={() => {
            setIsReportOpen(false);
            setReportedMessageId(null);
          }}
        />
      )}
    </div>
  );
};

export default MessageView;
