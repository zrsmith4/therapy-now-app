
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ConversationList from '@/components/messaging/ConversationList';
import MessageView from '@/components/messaging/MessageView';
import { Skeleton } from '@/components/ui/skeleton';

const Messages = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // If user is not authenticated, redirect to login
  useEffect(() => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to access messages",
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader />
        <main className="container px-4 py-8 pt-16">
          <div className="flex justify-center items-center h-64">
            <Skeleton className="h-12 w-64" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader 
        userType={userRole as 'patient' | 'therapist' | null} 
        userName={user?.email} 
      />
      <main className="container px-4 py-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <ConversationList 
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation || undefined}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 min-h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>
                {selectedConversation ? 'Messages' : 'Select a conversation'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              {selectedConversation ? (
                <MessageView conversationId={selectedConversation} />
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  Select a conversation to view messages
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Messages;
