
import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { useAppointmentActions } from "@/hooks/useAppointmentActions"

interface AppointmentConfirmationProps {
  appointment: {
    id: string
    date: string
    time: string
    patient: {
      name: string
      email?: string
    }
    therapist?: {
      name: string
      email?: string
    }
    location: {
      type: 'clinic' | 'mobile' | 'virtual'
      address?: string
    }
    visitType: string
    price: string
  }
  onAccept: () => void
  onDecline: () => void
}

const AppointmentConfirmation = ({
  appointment,
  onAccept,
  onDecline
}: AppointmentConfirmationProps) => {
  const { handleAccept } = useAppointmentActions({ onAccept });
  
  return (
    <Card className="shadow-lg border-2 border-medical-light">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-medical-primary">New Appointment Request</h2>
          <p className="text-slate-600">Please confirm or decline this appointment</p>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="flex justify-between">
            <span className="font-medium">Patient:</span>
            <span>{appointment.patient.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Date & Time:</span>
            <span>{appointment.date} at {appointment.time}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Visit Type:</span>
            <span>{appointment.visitType}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Location:</span>
            <span>
              {appointment.location.type === 'clinic' && 'In-Clinic Visit'}
              {appointment.location.type === 'mobile' && 'Mobile (In-Home) Visit'}
              {appointment.location.type === 'virtual' && 'Virtual Telehealth Visit'}
            </span>
          </div>
          
          {appointment.location.address && (
            <div className="flex justify-between">
              <span className="font-medium">Address:</span>
              <span>{appointment.location.address}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="font-medium">Price:</span>
            <span className="font-semibold">{appointment.price}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-6 pt-0">
        <Button 
          variant="outline" 
          className="w-[45%] border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={onDecline}
        >
          <X className="mr-2 h-4 w-4" />
          Decline
        </Button>
        <Button 
          className="w-[45%] bg-medical-success hover:bg-medical-success/90"
          onClick={handleAccept}
        >
          <Check className="mr-2 h-4 w-4" />
          Accept
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AppointmentConfirmation
