
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from "lucide-react";

interface AppHeaderProps {
  userType?: 'patient' | 'therapist' | null;
  userName?: string;
}

export default function AppHeader({ userType, userName }: AppHeaderProps) {
  const { signOut } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    if (userType === 'therapist') {
      const fetchNotifications = async () => {
        const { data, error } = await supabase
          .from('notifications')
          .select('id')
          .eq('status', 'unread');
          
        if (!error && data) {
          setNotificationCount(data.length);
        }
      };
      
      fetchNotifications();
      
      // Subscribe to new notifications
      const channel = supabase
        .channel('db-changes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          () => fetchNotifications()
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userType]);

  return (
    <header className="bg-white border-b fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold">
            Medical Mobile
          </Link>
          
          <div className="flex items-center space-x-4">
            {userName && (
              <span className="text-gray-700">
                Welcome, {userName}!
              </span>
            )}
            
            {userType === 'therapist' && (
              <div className="relative">
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </div>
            )}

            <Button variant="outline" size="sm" onClick={signOut}>
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
