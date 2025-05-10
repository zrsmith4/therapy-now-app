
import React, { useState, useEffect } from 'react';
import { useConversation } from '@/hooks/useConversation';
import { useMessages } from '@/hooks/useMessages';
import { useMessageSubscription } from '@/hooks/useMessageSubscription';
import { Button } from '@/components/ui/button';
import ConversationHeader from './ConversationHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ReportForm from './ReportForm';

interface MessageViewProps {
  conversationId: string;
}

const MessageView: React.FC<MessageViewProps> = ({ conversationId }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportedMessageId, setReportedMessageId] = useState<string | null>(null);
  
  // Fetch conversation details
  const { data: conversation } = useConversation(conversationId);
  
  // Fetch and manage messages
  const { 
    messages, 
    isLoading, 
    error, 
    refetch, 
    newMessage, 
    setNewMessage,
    isSending,
    sendMessage,
    markMessagesAsRead
  } = useMessages(conversationId, conversation);
  
  // Subscribe to real-time updates
  useMessageSubscription(conversationId);
  
  // Mark messages as read when viewed
  useEffect(() => {
    markMessagesAsRead();
  }, [messages]);
  
  const handleOpenReport = (messageId: string) => {
    setReportedMessageId(messageId);
    setIsReportOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader conversation={conversation} />
      
      <MessageList 
        messages={messages}
        isLoading={isLoading}
        error={error}
        onReportMessage={handleOpenReport}
        refetch={refetch}
      />

      <MessageInput 
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={sendMessage}
        isSending={isSending}
      />

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
