
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReportFormProps {
  messageId?: string;
  conversationId: string;
  onClose: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  messageId,
  conversationId,
  onClose
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to report content",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a reason for your report",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const reportData = {
        reporter_id: user.id,
        reason: reason.trim(),
        status: 'pending'
      };

      // Add either messageId or conversationId, depending on what's being reported
      if (messageId) {
        Object.assign(reportData, { reported_message_id: messageId });
      } else {
        Object.assign(reportData, { reported_conversation_id: conversationId });
      }

      const { error } = await supabase
        .from('reports')
        .insert(reportData);

      if (error) throw error;

      toast({
        title: "Report submitted",
        description: "Thank you for your report. Our team will review it shortly.",
      });

      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        variant: "destructive",
        title: "Error submitting report",
        description: "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Report {messageId ? 'Message' : 'Conversation'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium">
                Please describe why you're reporting this {messageId ? 'message' : 'conversation'}:
              </label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 min-h-[100px]"
                placeholder="Please provide details about why you are reporting this content..."
                required
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportForm;
