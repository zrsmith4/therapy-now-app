
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckboxGroup, Checkbox } from "@/components/ui/checkbox";
import { Json } from '@/integrations/supabase/types';

interface TimeSlot {
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  day_of_week?: number;
  is_available: boolean;
  location_types: Array<'mobile' | 'clinic' | 'virtual'>;
}

const DEFAULT_TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00"
];

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", 
  "Thursday", "Friday", "Saturday"
];

export const AvailabilityManager = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<Array<'mobile' | 'clinic' | 'virtual'>>(['mobile', 'clinic', 'virtual']);

  const handleLocationTypeChange = (locationType: 'mobile' | 'clinic' | 'virtual') => {
    setSelectedLocationTypes(prev => {
      // If already selected, remove it
      if (prev.includes(locationType)) {
        return prev.filter(type => type !== locationType);
      } 
      // Otherwise add it
      return [...prev, locationType];
    });
  };

  const handleSaveAvailability = async () => {
    try {
      if (!selectedDate && !isRecurring) {
        toast({
          title: "Please select a date",
          variant: "destructive"
        });
        return;
      }

      if (selectedLocationTypes.length === 0) {
        toast({
          title: "Please select at least one location type",
          variant: "destructive"
        });
        return;
      }

      const availabilityData: TimeSlot = {
        start_time: isRecurring 
          ? `2000-01-01T${startTime}:00Z`
          : new Date(selectedDate!.setHours(
              parseInt(startTime.split(':')[0]),
              parseInt(startTime.split(':')[1])
            )).toISOString(),
        end_time: isRecurring
          ? `2000-01-01T${endTime}:00Z`
          : new Date(selectedDate!.setHours(
              parseInt(endTime.split(':')[0]),
              parseInt(endTime.split(':')[1])
            )).toISOString(),
        is_recurring: isRecurring,
        day_of_week: isRecurring ? selectedDay : undefined,
        is_available: true,
        location_types: selectedLocationTypes
      };

      // Convert availabilityData to a JSON-compatible format for Supabase
      const timeSlotData = availabilityData as unknown as Json;

      // Instead of directly using the new table that isn't in TypeScript definitions yet,
      // we'll use a generic approach with any typing
      const { error } = await supabase
        .from('therapist_schedules') // Using existing table that is in the TypeScript definitions
        .insert({
          user_id: 'demo-therapist-id',
          date: isRecurring ? null : selectedDate?.toISOString().split('T')[0],
          time_slots: [timeSlotData], // Store our availability data in the time_slots JSONB column
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Availability saved",
        description: isRecurring 
          ? `Recurring availability set for ${DAYS_OF_WEEK[selectedDay]}`
          : `Availability set for ${selectedDate?.toLocaleDateString()}`
      });
    } catch (error: any) {
      toast({
        title: "Error saving availability",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        <Switch
          id="recurring"
          checked={isRecurring}
          onCheckedChange={setIsRecurring}
        />
        <Label htmlFor="recurring">Set recurring availability</Label>
      </div>

      {isRecurring ? (
        <div>
          <Label>Select day of week</Label>
          <Select 
            value={selectedDay.toString()} 
            onValueChange={(value) => setSelectedDay(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div>
          <Label>Select date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={{ before: new Date() }}
            className="rounded-md border"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Time</Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_TIME_SLOTS.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>End Time</Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_TIME_SLOTS.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="locationTypes">Available for:</Label>
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mobile-type"
              checked={selectedLocationTypes.includes('mobile')}
              onCheckedChange={() => handleLocationTypeChange('mobile')}
            />
            <Label htmlFor="mobile-type">Mobile Visits</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="clinic-type"
              checked={selectedLocationTypes.includes('clinic')}
              onCheckedChange={() => handleLocationTypeChange('clinic')}
            />
            <Label htmlFor="clinic-type">Clinic Visits</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="virtual-type"
              checked={selectedLocationTypes.includes('virtual')}
              onCheckedChange={() => handleLocationTypeChange('virtual')}
            />
            <Label htmlFor="virtual-type">Virtual Visits</Label>
          </div>
        </div>
      </div>

      <Button onClick={handleSaveAvailability} className="w-full">
        Save Availability
      </Button>
    </div>
  );
};

export default AvailabilityManager;
