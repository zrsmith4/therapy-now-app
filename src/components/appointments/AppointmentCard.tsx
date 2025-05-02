
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge-custom"
import { Clock, MapPin, User, Video, Car } from "lucide-react"

interface AppointmentCardProps {
  date: string
  time: string
  location: {
    type: 'mobile' | 'clinic' | 'virtual'
    address?: string
    details?: any
  }
  therapist?: {
    name: string
    specialty: string
    imageUrl?: string
  }
  patient?: {
    name: string
    imageUrl?: string
  }
  status: 'upcoming' | 'completed' | 'cancelled'
  onManage: () => void
  userType: 'patient' | 'therapist'
}

const locationIcons = {
  mobile: <Car className="h-4 w-4" />,
  clinic: <MapPin className="h-4 w-4" />,
  virtual: <Video className="h-4 w-4" />
}

const locationLabels = {
  mobile: 'Mobile Visit',
  clinic: 'Clinic Visit',
  virtual: 'Virtual Visit'
}

const AppointmentCard = ({
  date,
  time,
  location,
  therapist,
  patient,
  status,
  onManage,
  userType
}: AppointmentCardProps) => {
  // Extract address based on location type
  const getLocationAddress = () => {
    if (location.address) return location.address;
    
    if (location.details) {
      if (location.type === 'mobile' && location.details.patient_address) {
        return location.details.patient_address;
      } else if (location.type === 'clinic' && location.details.clinic_address) {
        return location.details.clinic_address;
      } else if (location.type === 'virtual' && location.details.meeting_link) {
        return location.details.meeting_link;
      }
    }
    
    return undefined;
  };

  const locationAddress = getLocationAddress();

  return (
    <Card className={`mb-4 ${status === 'cancelled' ? 'opacity-60' : ''}`}>
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <Badge variant={location.type}>
                <span className="flex items-center gap-1">
                  {locationIcons[location.type]}
                  {locationLabels[location.type]}
                </span>
              </Badge>
              {status === 'cancelled' && (
                <Badge variant="destructive" className="ml-2">Cancelled</Badge>
              )}
              {status === 'completed' && (
                <Badge variant="outline" className="ml-2 bg-medical-lightGray">Completed</Badge>
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-1">{date}</h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{time}</span>
              </div>
              
              {locationAddress && (
                <div className="flex items-center gap-1">
                  {location.type === 'virtual' ? (
                    <Video className="h-3 w-3" />
                  ) : (
                    <MapPin className="h-3 w-3" />
                  )}
                  <span className="truncate max-w-[200px]">{locationAddress}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 flex items-center gap-2">
              <User className="h-4 w-4 text-medical-gray" />
              {userType === 'patient' && therapist ? (
                <span className="text-sm">
                  {therapist.name} - <span className="text-medical-primary">{therapist.specialty}</span>
                </span>
              ) : patient ? (
                <span className="text-sm">{patient.name}</span>
              ) : null}
            </div>
          </div>
          
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={onManage}
              disabled={status === 'cancelled'}
              className="border-medical-primary text-medical-primary hover:bg-medical-light"
            >
              {status === 'upcoming' ? 'Manage' : 'View Details'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AppointmentCard
