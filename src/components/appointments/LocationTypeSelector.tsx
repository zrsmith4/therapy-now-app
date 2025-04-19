
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MapPin, Video, Car } from "lucide-react"

interface LocationTypeSelectorProps {
  value: 'mobile' | 'clinic' | 'virtual'
  onChange: (value: 'mobile' | 'clinic' | 'virtual') => void
}

const LocationTypeSelector = ({ value, onChange }: LocationTypeSelectorProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Location Type</h3>
        
        <RadioGroup
          value={value}
          onValueChange={(val) => onChange(val as 'mobile' | 'clinic' | 'virtual')}
          className="grid gap-4"
        >
          <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-all ${value === 'mobile' ? 'border-medical-primary bg-medical-light' : 'hover:border-medical-light'}`}>
            <RadioGroupItem value="mobile" id="mobile" className="text-medical-primary" />
            <Label htmlFor="mobile" className="flex items-center cursor-pointer">
              <Car className="mr-2 h-5 w-5 text-medical-secondary" />
              <div>
                <div className="font-medium">Mobile Visit</div>
                <div className="text-sm text-muted-foreground">Therapist comes to your location</div>
              </div>
            </Label>
          </div>
          
          <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-all ${value === 'clinic' ? 'border-medical-primary bg-medical-light' : 'hover:border-medical-light'}`}>
            <RadioGroupItem value="clinic" id="clinic" className="text-medical-primary" />
            <Label htmlFor="clinic" className="flex items-center cursor-pointer">
              <MapPin className="mr-2 h-5 w-5 text-medical-tertiary" />
              <div>
                <div className="font-medium">Clinic Visit</div>
                <div className="text-sm text-muted-foreground">Visit therapist at their clinic</div>
              </div>
            </Label>
          </div>
          
          <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-all ${value === 'virtual' ? 'border-medical-primary bg-medical-light' : 'hover:border-medical-light'}`}>
            <RadioGroupItem value="virtual" id="virtual" className="text-medical-primary" />
            <Label htmlFor="virtual" className="flex items-center cursor-pointer">
              <Video className="mr-2 h-5 w-5 text-medical-primary" />
              <div>
                <div className="font-medium">Virtual Visit</div>
                <div className="text-sm text-muted-foreground">Remote appointment via video call</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

export default LocationTypeSelector
