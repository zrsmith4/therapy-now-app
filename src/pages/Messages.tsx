
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Messages = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new.conversation_id === selectedConversation?.id) {
            setMessages(prev => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          therapist:therapist_id(first_name, last_name),
          patient:patient_id(first_name, last_name)
        `)
        .or(`patient_id.eq.${session.user.id},therapist_id.eq.${session.user.id}`);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load conversations.',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load messages.',
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('messages')
        .insert({
          content: message,
          conversation_id: selectedConversation.id,
          sender_id: session.user.id,
          receiver_id: selectedConversation.patient_id === session.user.id
            ? selectedConversation.therapist_id
            : selectedConversation.patient_id
        });

      if (error) throw error;
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader userType="patient" />
      <main className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant={selectedConversation?.id === conversation.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedConversation(conversation);
                      loadMessages(conversation.id);
                    }}
                  >
                    {conversation.therapist.first_name} {conversation.therapist.last_name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedConversation 
                  ? `Chat with ${selectedConversation.therapist.first_name} ${selectedConversation.therapist.last_name}`
                  : 'Select a conversation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedConversation ? (
                <div className="space-y-4">
                  <div className="h-[400px] overflow-y-auto space-y-2 p-4 border rounded-lg">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2 rounded-lg ${
                          msg.sender_id === selectedConversation.patient_id
                            ? 'bg-blue-100 ml-auto max-w-[80%]'
                            : 'bg-gray-100 mr-auto max-w-[80%]'
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage}>Send</Button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  Select a conversation to start chatting
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Messages;
