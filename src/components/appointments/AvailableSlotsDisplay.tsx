
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface AvailableSlotsDisplayProps {
  slots: {
    start_time: string;
    end_time: string;
    is_available: boolean;
  }[];
  onSlotSelect: (start_time: string) => void;
  selectedTime?: string;
}

export default function AvailableSlotsDisplay({ 
  slots,
  onSlotSelect,
  selectedTime 
}: AvailableSlotsDisplayProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
      {slots.filter(slot => slot.is_available).map((slot) => (
        <Button
          key={slot.start_time}
          variant={selectedTime === slot.start_time ? "default" : "outline"}
          className="flex items-center gap-2"
          onClick={() => onSlotSelect(slot.start_time)}
        >
          <Clock className="h-4 w-4" />
          {new Date(slot.start_time).toLocaleTimeString([], { 
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Button>
      ))}
    </div>
  );
}
