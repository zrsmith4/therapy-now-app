
import React, { useState } from 'react';
import { format } from 'date-fns';
import { BellDot, Bell, Check, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge-custom";
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  status: 'read' | 'unread';
}

export function NotificationsDropdown() {
  // Wrap the entire component in error boundary pattern
  try {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    // Check if we're in development environment
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                        window.location.hostname.includes('lovable.app') || 
                        window.location.hostname === 'localhost';

    const { data: notifications, isLoading, isError, error } = useQuery({
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

    const handleNotificationClick = (notificationId: string) => {
      if (isDevelopment) {
        console.log('Development mode: Mock marking notification as read');
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        return;
      }
      
      markAsReadMutation.mutate(notificationId);
    };

    if (isError && !isDevelopment) {
      console.error('Notification error:', error);
      return (
        <div className="p-2">
          <Bell className="h-6 w-6 text-gray-500" />
        </div>
      );
    }

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="relative">
          {isLoading ? (
            <div className="h-6 w-6 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : unreadCount > 0 ? (
            <>
              <BellDot className="h-6 w-6" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full px-1"
              >
                {unreadCount}
              </Badge>
            </>
          ) : (
            <Bell className="h-6 w-6" />
          )}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="bg-white rounded-md shadow-lg max-h-[400px] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Check className="h-3 w-3" /> Mark all as read
                </button>
              )}
            </div>
            
            {isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : isError && !isDevelopment ? (
              <div className="p-4">
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Unable to load notifications
                  </AlertDescription>
                </Alert>
              </div>
            ) : notifications?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="divide-y">
                {notifications?.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      notification.status === 'unread' ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => notification.status === 'unread' && handleNotificationClick(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  } catch (error) {
    console.error('Error in NotificationsDropdown:', error);
    // Return a minimal fallback UI that won't break the app
    return (
      <div className="p-2">
        <Bell className="h-6 w-6 text-gray-500" />
      </div>
    );
  }
}
