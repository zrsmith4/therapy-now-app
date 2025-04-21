
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarClock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const ScheduleOptionsSelector = () => {
  const { toast } = useToast();
  const [scheduleType, setScheduleType] = useState<'one-time' | 'recurring'>('one-time');
  
  const [recurringDays, setRecurringDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  
  const handleDayToggle = (day: keyof typeof recurringDays) => {
    setRecurringDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  const handleSaveRecurring = () => {
    const selectedDays = Object.entries(recurringDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day);
    
    if (selectedDays.length === 0) {
      toast({
        title: "No days selected",
        description: "Please select at least one day for your recurring schedule.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Recurring schedule saved",
      description: `Your schedule has been set for ${selectedDays.join(', ')}.`,
    });
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="one-time" onValueChange={(value) => setScheduleType(value as 'one-time' | 'recurring')}>
          <TabsList className="mb-4">
            <TabsTrigger value="one-time" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>One-time Availability</span>
            </TabsTrigger>
            <TabsTrigger value="recurring" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span>Recurring Schedule</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="one-time">
            <p className="text-slate-600 mb-4">
              Set your availability for specific dates. This is useful for adding extra hours or blocking off time.
            </p>
            <p className="text-sm text-slate-500 mb-2">
              Select a date on the calendar below to set your availability.
            </p>
          </TabsContent>
          
          <TabsContent value="recurring">
            <p className="text-slate-600 mb-4">
              Set up your regular weekly schedule. Patients will be able to book appointments during these times.
            </p>
            
            <div className="grid grid-cols-7 gap-2 mb-6">
              {Object.entries(recurringDays).map(([day, isSelected]) => (
                <div key={day} className="flex flex-col items-center">
                  <button
                    onClick={() => handleDayToggle(day as keyof typeof recurringDays)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                              ${isSelected ? 'bg-medical-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {day.charAt(0).toUpperCase()}
                  </button>
                  <span className="text-xs text-slate-500">
                    {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="start-time">Default Start Time</Label>
                <Select defaultValue="09:00">
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="end-time">Default End Time</Label>
                <Select defaultValue="17:00">
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                    <SelectItem value="19:00">7:00 PM</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-6">
              <Switch id="auto-lunch" />
              <Label htmlFor="auto-lunch">Automatically block lunch hour (12-1 PM)</Label>
            </div>
            
            <Button onClick={handleSaveRecurring}>Save Recurring Schedule</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ScheduleOptionsSelector
