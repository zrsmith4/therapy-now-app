
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { Check, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge-custom';

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  status: 'read' | 'unread';
  type: string;
}

const Notifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  
  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                        window.location.hostname.includes('lovable.app') || 
                        window.location.hostname === 'localhost';

  const { data: notifications, isLoading, isError, error } = useQuery({
    queryKey: ['notifications-full'],
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
              status: 'unread',
              type: 'appointment_request'
            },
            {
              id: '2',
              title: 'Appointment confirmed',
              message: 'Your appointment with Dr. Smith has been confirmed',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              status: 'read',
              type: 'appointment_confirmed'
            },
            {
              id: '3',
              title: 'Appointment reminder',
              message: 'Your appointment is scheduled for tomorrow at 2:00 PM',
              created_at: new Date(Date.now() - 172800000).toISOString(),
              status: 'read',
              type: 'appointment_reminder'
            },
            {
              id: '4',
              title: 'Message from Dr. Johnson',
              message: 'Please review your updated exercise program before our next session',
              created_at: new Date(Date.now() - 259200000).toISOString(),
              status: 'unread',
              type: 'message'
            }
          ] as Notification[];
        }

        if (!user) return [];
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notifications:', error);
          throw error;
        }

        return data as Notification[];
      } catch (err) {
        console.error('Notification fetch error:', err);
        throw err;
      }
    },
    enabled: !!user || isDevelopment
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
      queryClient.invalidateQueries({ queryKey: ['notifications-full'] });
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

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (isDevelopment) {
        console.log('Mock: Deleting notification:', notificationId);
        return { success: true };
      }

      try {
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', notificationId);

        if (error) throw error;
        return { success: true };
      } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-full'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notification deleted",
        description: "The notification has been removed.",
      });
    },
    onError: (error) => {
      console.error('Error in deleteNotification mutation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete notification",
      });
    }
  });

  const handleMarkAllAsRead = async () => {
    if (!notifications?.some(n => n.status === 'unread')) return;
    
    try {
      setIsMarkingAllRead(true);
      
      if (isDevelopment) {
        console.log('Mock: Marking all notifications as read');
        await new Promise(resolve => setTimeout(resolve, 1000));
        queryClient.invalidateQueries({ queryKey: ['notifications-full'] });
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

      queryClient.invalidateQueries({ queryKey: ['notifications-full'] });
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
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch(type) {
      case 'appointment_request':
        return 'bg-blue-100 text-blue-800';
      case 'appointment_confirmed':
        return 'bg-green-100 text-green-800';
      case 'appointment_declined':
        return 'bg-red-100 text-red-800';
      case 'message':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderNotificationsList = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-5/6 mb-2" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error Loading Notifications</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load notifications'}
            <button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['notifications-full'] })} 
              className="block mt-2 underline"
            >
              Click here to try again
            </button>
          </AlertDescription>
        </Alert>
      );
    }

    if (!notifications || notifications.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">You don't have any notifications.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`bg-white rounded-lg shadow p-4 ${
              notification.status === 'unread' ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{notification.title}</h3>
              <span className="text-xs text-gray-500">
                {format(new Date(notification.created_at), 'MMM d, h:mm a')}
              </span>
            </div>
            <p className="text-gray-600 my-2">{notification.message}</p>
            
            <div className="flex justify-between items-center mt-4">
              <span className={`text-xs px-2 py-1 rounded-full ${getNotificationTypeColor(notification.type)}`}>
                {notification.type.replace('_', ' ')}
              </span>
              
              <div className="flex space-x-2">
                {notification.status === 'unread' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => markAsReadMutation.mutate(notification.id)}
                    disabled={markAsReadMutation.isPending}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark as read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  onClick={() => deleteNotificationMutation.mutate(notification.id)}
                  disabled={deleteNotificationMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const unreadCount = notifications?.filter(n => n.status === 'unread').length ?? 0;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {!isLoading && unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                You have <Badge variant="destructive">{unreadCount}</Badge> unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={isLoading || isMarkingAllRead || !unreadCount}
            className="flex items-center"
          >
            {isMarkingAllRead ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Mark all as read
          </Button>
        </div>
        
        {renderNotificationsList()}
      </div>
    </AppLayout>
  );
};

export default Notifications;
