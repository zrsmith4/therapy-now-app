
import React from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge-custom"
import { Star, MapPin, Video, Car, Calendar, CalendarCheck } from "lucide-react"

interface TherapistCardProps {
  id: string
  name: string
  specialty: string
  rating: number
  reviewCount: number
  imageUrl?: string
  availableNow: boolean
  availableLocations: ('mobile' | 'clinic' | 'virtual')[]
  onBook: (therapistId: string) => void
  onViewProfile: (therapistId: string) => void
}

const locationIcons = {
  mobile: <Car className="h-3 w-3" />,
  clinic: <MapPin className="h-3 w-3" />,
  virtual: <Video className="h-3 w-3" />
}

const locationLabels = {
  mobile: 'Mobile',
  clinic: 'Clinic',
  virtual: 'Virtual'
}

const TherapistCard = ({
  id,
  name,
  specialty,
  rating,
  reviewCount,
  imageUrl,
  availableNow,
  availableLocations,
  onBook,
  onViewProfile
}: TherapistCardProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-medical-light flex items-center justify-center text-medical-primary font-bold text-xl overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-medical-primary">{specialty}</p>
            </div>
          </div>
          {availableNow && (
            <Badge variant="mobile" className="bg-medical-success">
              Available Now
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1 mb-4">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-slate-500 text-sm">({reviewCount} reviews)</span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Available for:</p>
          <div className="flex flex-wrap gap-2">
            {availableLocations.map(location => (
              <Badge key={location} variant="subtle" className="flex items-center gap-1">
                {locationIcons[location]}
                {locationLabels[location]}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile(id)}
          className="flex-1 border-medical-primary text-medical-primary hover:bg-medical-light"
        >
          View Profile
        </Button>
        <Button
          size="sm"
          onClick={() => onBook(id)}
          className="flex-1 gap-1 bg-medical-primary hover:bg-medical-dark"
        >
          {availableNow ? (
            <>
              <CalendarCheck className="h-4 w-4" />
              Book Now
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4" />
              Schedule
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default TherapistCard
