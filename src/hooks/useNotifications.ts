
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  status: 'read' | 'unread';
}

export function useNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                      window.location.hostname.includes('lovable.app') || 
                      window.location.hostname === 'localhost';

  const { 
    data: notifications, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        // In development, use mock data
        if (isDevelopment) {
          console.log('Using mock notification data in development');
          return [
            {
              id: '1',
              title: 'New appointment request',
              message: 'You have a new appointment request from John Doe',
              created_at: new Date().toISOString(),
              status: 'unread'
            },
            {
              id: '2',
              title: 'Appointment confirmed',
              message: 'Your appointment with Dr. Smith has been confirmed',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              status: 'read'
            }
          ] as Notification[];
        }

        if (!user) return [];
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching notifications:', error);
          throw new Error('Failed to load notifications');
        }

        return data as Notification[];
      } catch (err) {
        console.error('Notification fetch error:', err);
        throw err;
      }
    },
    enabled: !!user || isDevelopment,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (isDevelopment) {
        console.log('Mock: Marking notification as read:', notificationId);
        return { success: true };
      }

      try {
        const { error } = await supabase
          .from('notifications')
          .update({ status: 'read' })
          .eq('id', notificationId);

        if (error) throw error;
        return { success: true };
      } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Error in markAsRead mutation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not mark notification as read",
      });
    }
  });

  const handleMarkAllAsRead = async () => {
    if (!notifications?.length) return;
    
    try {
      if (isDevelopment) {
        console.log('Mock: Marking all notifications as read');
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        
        toast({
          title: "Success",
          description: "All notifications marked as read",
        });
        return;
      }

      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('recipient_id', user?.id)
        .eq('status', 'unread');

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not mark notifications as read",
      });
    }
  };

  const unreadCount = notifications?.filter(n => n.status === 'unread').length ?? 0;

  return {
    notifications,
    isLoading,
    isError,
    error,
    markAsReadMutation,
    handleMarkAllAsRead,
    unreadCount,
    isDevelopment
  };
}
