
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';
import { Conversation } from './useConversation';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read_at: string | null;
}

export function useMessages(conversationId: string, conversation?: Conversation | null) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

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

  // Handle marking messages as read
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

  // Send a new message
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

  return {
    messages,
    isLoading,
    error,
    refetch,
    newMessage,
    setNewMessage,
    isSending,
    sendMessage,
    markMessagesAsRead
  };
}
