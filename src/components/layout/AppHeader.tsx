
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { NotificationsDropdown } from '@/components/notifications/NotificationsDropdown';
import { Skeleton } from '@/components/ui/skeleton';

interface AppHeaderProps {
  userType?: 'patient' | 'therapist' | null;
  userName?: string;
  isLoading?: boolean;
}

export default function AppHeader({ userType, userName, isLoading = false }: AppHeaderProps) {
  const { signOut } = useAuth();

  return (
    <header className="bg-white border-b fixed top-0 left-0 right-0 z-20 w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold">
            Medical Mobile
          </Link>
          
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-9 w-16" />
              </>
            ) : (
              <>
                {userName && (
                  <span className="text-gray-700 hidden sm:inline">
                    Welcome, {userName}!
                  </span>
                )}

                {userType && <NotificationsDropdown />}

                <Button variant="outline" size="sm" onClick={signOut}>
                  Log Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
