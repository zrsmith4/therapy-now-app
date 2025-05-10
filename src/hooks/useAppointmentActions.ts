
import { useToast } from "@/hooks/use-toast";

interface UseAppointmentActionsProps {
  onAccept: () => void;
}

export const useAppointmentActions = ({ onAccept }: UseAppointmentActionsProps) => {
  const { toast } = useToast();
  
  const handleAccept = () => {
    // This would normally call an API to accept the appointment
    toast({
      title: "Appointment accepted",
      description: "An email confirmation has been sent to both you and the patient.",
    });
    
    // For demo/scaffolding purposes, we're just calling onAccept
    // In a real implementation, this would trigger the email service
    onAccept();
  };

  return {
    handleAccept
  };
};
