
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon } from "lucide-react";

interface TherapistScheduleCalendarProps {
  userId: string;
}

type TimeSlot = {
  start: string;
  end: string;
  available: boolean;
};

type DaySchedule = {
  date: string;
  timeSlots: TimeSlot[];
};

const defaultTimeSlots = [
  { start: "09:00", end: "10:00", available: true },
  { start: "10:00", end: "11:00", available: true },
  { start: "11:00", end: "12:00", available: true },
  { start: "13:00", end: "14:00", available: true },
  { start: "14:00", end: "15:00", available: true },
  { start: "15:00", end: "16:00", available: true },
  { start: "16:00", end: "17:00", available: true },
];

const TherapistScheduleCalendar = ({ userId }: TherapistScheduleCalendarProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(defaultTimeSlots);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  // In a real implementation, you would fetch the schedule from the database
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setShowTimeSlots(true);
      // Here you would fetch the time slots for this date from the database
      // For now, we'll just use the default time slots
      setTimeSlots(defaultTimeSlots);
    }
  };

  const toggleTimeSlot = (index: number) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots[index].available = !updatedTimeSlots[index].available;
    setTimeSlots(updatedTimeSlots);
  };

  const saveSchedule = async () => {
    if (!date) return;
    
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      
      // This is a simplified version - in a real app, you'd want to handle
      // conflicts and existing schedules differently
      const { error } = await supabase
        .from('therapist_schedules')
        .upsert({
          user_id: userId,
          date: formattedDate,
          time_slots: timeSlots,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id, date' });
        
      if (error) throw error;
      
      toast({
        title: "Schedule saved",
        description: `Your schedule for ${format(date, "MMMM d, yyyy")} has been saved.`,
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast({
        variant: "destructive",
        title: "Error saving schedule",
        description: "There was a problem saving your schedule. Please try again.",
      });
    }
  };

  const handleSetRecurringSchedule = () => {
    // This would open a modal or form to set a recurring schedule
    toast({
      title: "Coming Soon",
      description: "Setting recurring schedules will be available in a future update.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Select a Date</h3>
          <div className="border rounded-md p-4">
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={handleDateSelect}
              className="mx-auto"
              disabled={{ before: new Date() }}
              initialFocus
            />
          </div>
          
          <div className="mt-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSetRecurringSchedule}
            >
              Set Recurring Schedule
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Jump to Date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {showTimeSlots && date && (
          <div>
            <h3 className="text-lg font-medium mb-4">
              Availability for {format(date, "MMMM d, yyyy")}
            </h3>
            <div className="border rounded-md p-4 space-y-4">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{slot.start} - {slot.end}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={slot.available}
                      onCheckedChange={() => toggleTimeSlot(index)}
                      id={`time-slot-${index}`}
                    />
                    <Label htmlFor={`time-slot-${index}`}>
                      {slot.available ? "Available" : "Unavailable"}
                    </Label>
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full mt-4" 
                onClick={saveSchedule}
              >
                Save Availability
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistScheduleCalendar;
