
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Flag, Send } from 'lucide-react';
import ReportForm from './ReportForm';
import { handleError } from '@/utils/errorHandling';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [isSending, setIsSending] = useState(false);

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
        handleError(error, {
          context: 'fetching conversation details',
          toastDescription: 'Could not load conversation details'
        });
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
        handleError(error, {
          context: 'fetching messages',
          toastDescription: 'Failed to load messages'
        });
        return [];
      }
    },
    enabled: !!user && !!conversationId
  });

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          console.log('New message received:', payload);
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing from messages channel');
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient, user]);

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

          // Refetch to update the UI and also invalidate the ConversationList
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        } catch (error) {
          handleError(error, {
            context: 'marking messages as read',
            silent: true
          });
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
    if (!user || !conversationId || !newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      
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
      
      // Optimistically update the UI by adding the new message locally
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        content: newMessage.trim(),
        sender_id: user.id,
        receiver_id: receiverId,
        created_at: new Date().toISOString(),
        read_at: null
      };
      
      queryClient.setQueryData(['messages', conversationId], (oldMessages: Message[] = []) => {
        return [...oldMessages, optimisticMessage];
      });
      
    } catch (error) {
      handleError(error, {
        context: 'sending message',
        toastTitle: "Error sending message",
        toastDescription: "Please try again"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenReport = (messageId: string) => {
    setReportedMessageId(messageId);
    setIsReportOpen(true);
  };

  const getOtherPersonName = () => {
    if (!conversation) return "";
    
    const isPatient = user?.id === conversation.patient_id;
    if (isPatient && conversation.therapist) {
      return `${conversation.therapist.first_name} ${conversation.therapist.last_name}`;
    } else if (!isPatient && conversation.patient) {
      return `${conversation.patient.first_name} ${conversation.patient.last_name}`;
    }
    return "Chat";
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

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b bg-slate-50">
        <h3 className="font-medium">{getOtherPersonName()}</h3>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4 min-h-[500px]">
          {messages && messages.length > 0 ? (
            messages.map((message) => {
              const isCurrentUser = message.sender_id === user?.id;
              return (
                <div 
                  key={message.id} 
                  className={`group flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`relative max-w-[80%] p-3 rounded-lg ${
                      isCurrentUser 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
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
            })
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No messages yet. Start the conversation!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={isSending}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || isSending}
            className="px-4"
          >
            <Send className="h-4 w-4 mr-2" />
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
