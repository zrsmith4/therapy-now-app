
import React from 'react';
import { Conversation } from '@/hooks/useConversation';
import { useAuth } from '@/context/AuthContext';

interface ConversationHeaderProps {
  conversation: Conversation | null | undefined;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ conversation }) => {
  const { user } = useAuth();

  const getOtherPersonName = () => {
    if (!conversation || !user) return "Chat";
    
    const isPatient = user.id === conversation.patient_id;
    
    // Check if the therapist/patient is a valid object with the expected properties
    if (isPatient && conversation.therapist && 'first_name' in conversation.therapist && 'last_name' in conversation.therapist) {
      return `${conversation.therapist.first_name} ${conversation.therapist.last_name}`;
    } else if (!isPatient && conversation.patient && 'first_name' in conversation.patient && 'last_name' in conversation.patient) {
      return `${conversation.patient.first_name} ${conversation.patient.last_name}`;
    }
    
    return "Chat";
  };

  return (
    <div className="px-4 py-2 border-b bg-slate-50">
      <h3 className="font-medium">{getOtherPersonName()}</h3>
    </div>
  );
};

export default ConversationHeader;
