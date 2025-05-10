
import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Message } from '@/hooks/useMessages';
import { useAuth } from '@/context/AuthContext';

interface MessageListProps {
  messages: Message[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onReportMessage: (messageId: string) => void;
  refetch: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  error, 
  onReportMessage,
  refetch 
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col">
            <Skeleton className="h-10 w-3/4 mb-2" />
          </div>
        ))}
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
                        onClick={() => onReportMessage(message.id)}
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
  );
};

export default MessageList;
