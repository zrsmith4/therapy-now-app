
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { NotificationsDropdown } from '@/components/notifications/NotificationsDropdown';

interface AppHeaderProps {
  userType?: 'patient' | 'therapist' | null;
  userName?: string;
}

export default function AppHeader({ userType, userName }: AppHeaderProps) {
  const { signOut } = useAuth();

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

            {userType && <NotificationsDropdown />}

            <Button variant="outline" size="sm" onClick={signOut}>
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
