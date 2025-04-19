
import React from 'react'
import { Button } from "@/components/ui/button"
import { CalendarClock } from "lucide-react"

interface WelcomeSectionProps {
  userName: string
  userType: 'patient' | 'therapist'
  nextAppointment?: {
    date: string
    time: string
    with: string
    locationType: 'mobile' | 'clinic' | 'virtual'
  }
  onActionClick: () => void
}

const WelcomeSection = ({ userName, userType, nextAppointment, onActionClick }: WelcomeSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-medical-light to-blue-50 rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-slate-600 mb-4">
            {userType === 'patient' 
              ? 'Ready to book your next physical therapy session?' 
              : 'Ready to manage your patient schedule?'}
          </p>
          
          {nextAppointment && (
            <div className="flex items-center gap-2 text-sm text-slate-700 mb-4">
              <CalendarClock className="h-4 w-4 text-medical-primary" />
              <span>
                Next appointment: {nextAppointment.date} at {nextAppointment.time} 
                {userType === 'patient' 
                  ? ` with ${nextAppointment.with}` 
                  : ` with a patient`}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={onActionClick}
            className="bg-medical-primary hover:bg-medical-dark"
          >
            {userType === 'patient' 
              ? 'Book an Appointment' 
              : nextAppointment 
                ? 'Manage Schedule' 
                : 'Set Availability'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WelcomeSection
