
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CalendarCheck, Clock } from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select"

interface AvailabilityToggleProps {
  isAvailable: boolean
  onToggle: (value: boolean, timeout?: string) => void
  timeout: string | null
}

const AvailabilityToggle = ({ isAvailable, onToggle, timeout }: AvailabilityToggleProps) => {
  const [showTimeoutOptions, setShowTimeoutOptions] = useState(false);
  
  const handleToggleChange = (checked: boolean) => {
    if (checked) {
      // When turning on, show the timeout options
      setShowTimeoutOptions(true);
      // Initially toggle without a timeout
      onToggle(true);
    } else {
      // When turning off, hide the timeout options and clear any timeout
      setShowTimeoutOptions(false);
      onToggle(false);
    }
  };
  
  const handleTimeoutChange = (value: string) => {
    // Update with the selected timeout
    onToggle(true, value);
  };
  
  const getTimeoutText = () => {
    if (!timeout) return null;
    
    const timeoutLabels: Record<string, string> = {
      '30min': '30 minutes',
      '1hour': '1 hour',
      '2hours': '2 hours',
      '4hours': '4 hours',
    };
    
    return timeoutLabels[timeout] || timeout;
  };
  
  return (
    <Card className={`transition-all ${isAvailable ? 'border-medical-success' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
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
                  ? timeout 
                    ? `Available for ${getTimeoutText()} or until matched` 
                    : 'Patients can book on-demand appointments with you'
                  : 'Toggle to accept on-demand appointments'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isAvailable && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <Select onValueChange={handleTimeoutChange} value={timeout || 'none'}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Set timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No timeout</SelectItem>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="2hours">2 hours</SelectItem>
                    <SelectItem value="4hours">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Switch
              checked={isAvailable}
              onCheckedChange={handleToggleChange}
              className={isAvailable ? 'bg-medical-success' : ''}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AvailabilityToggle
