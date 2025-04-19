
import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

interface AppHeaderProps {
  userType?: 'patient' | 'therapist' | null
  userName?: string
}

const AppHeader = ({ userType, userName }: AppHeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-medical-primary">Heal</span>
            <span className="text-2xl font-bold text-medical-secondary">on</span>
            <span className="text-2xl font-bold text-medical-tertiary">Wheels</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          {userType && (
            <>
              <Link to="/appointments" className="text-sm font-medium text-slate-700 hover:text-medical-primary transition-colors">
                Appointments
              </Link>
              {userType === 'patient' ? (
                <>
                  <Link to="/find-therapist" className="text-sm font-medium text-slate-700 hover:text-medical-primary transition-colors">
                    Find Therapist
                  </Link>
                  <Link to="/my-profile" className="text-sm font-medium text-slate-700 hover:text-medical-primary transition-colors">
                    My Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/schedule" className="text-sm font-medium text-slate-700 hover:text-medical-primary transition-colors">
                    My Schedule
                  </Link>
                  <Link to="/patients" className="text-sm font-medium text-slate-700 hover:text-medical-primary transition-colors">
                    My Patients
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {userType ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full h-8 w-8 p-0">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">{userName || 'User'}</DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/my-profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/" className="w-full">Sign out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppHeader
