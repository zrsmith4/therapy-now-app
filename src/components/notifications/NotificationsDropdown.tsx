
import React, { useState } from 'react';
import { format } from 'date-fns';
import { BellDot, Bell, Check, Loader2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge-custom";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    isLoading, 
    isError, 
    unreadCount, 
    markAsReadMutation, 
    handleMarkAllAsRead,
    isDevelopment
  } = useNotifications();

  const handleNotificationClick = (notificationId: string) => {
    if (isDevelopment) {
      console.log('Development mode: Mock marking notification as read');
      return;
    }
    
    markAsReadMutation.mutate(notificationId);
  };

  // Fallback UI for error state
  if (isError && !isDevelopment) {
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
}
