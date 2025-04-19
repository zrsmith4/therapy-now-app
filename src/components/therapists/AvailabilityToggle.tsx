
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CalendarCheck } from "lucide-react"

interface AvailabilityToggleProps {
  isAvailable: boolean
  onToggle: (value: boolean) => void
}

const AvailabilityToggle = ({ isAvailable, onToggle }: AvailabilityToggleProps) => {
  return (
    <Card className={`transition-all ${isAvailable ? 'border-medical-success' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isAvailable ? 'bg-medical-success/10' : 'bg-slate-100'}`}>
              <CalendarCheck className={`h-6 w-6 ${isAvailable ? 'text-medical-success' : 'text-slate-400'}`} />
            </div>
            <div>
              <h3 className="font-medium text-lg">
                {isAvailable ? 'You are available now' : 'You are currently unavailable'}
              </h3>
              <p className="text-sm text-slate-500">
                {isAvailable 
                  ? 'Patients can book on-demand appointments with you' 
                  : 'Toggle to accept on-demand appointments'}
              </p>
            </div>
          </div>
          
          <Switch
            checked={isAvailable}
            onCheckedChange={onToggle}
            className={isAvailable ? 'bg-medical-success' : ''}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default AvailabilityToggle
