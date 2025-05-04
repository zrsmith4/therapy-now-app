
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ConversationList from '@/components/messaging/ConversationList';
import MessageView from '@/components/messaging/MessageView';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/components/layout/AppLayout';
import { handleError } from '@/utils/errorHandling';

const Messages = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                        window.location.hostname.includes('lovable.app') || 
                        window.location.hostname === 'localhost';

  // If user is not authenticated and we're not in development mode, redirect to login
  useEffect(() => {
    if (!user && !isDevelopment) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to access messages",
      });
      navigate('/auth');
    }
    setIsLoading(false);
  }, [user, navigate, toast, isDevelopment]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  // Show loading state
  if (isLoading) {
    return (
      <AppLayout isLoading={true}>
        <div className="flex justify-center items-center h-64">
          <Skeleton className="h-12 w-64" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
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
          <CardHeader className="pb-2">
            <CardTitle>
              {selectedConversation ? 'Messages' : 'Select a conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-0">
            {selectedConversation ? (
              <MessageView conversationId={selectedConversation} />
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500 p-4">
                Select a conversation to view messages
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Messages;
