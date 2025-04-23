
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import AppointmentRequestModal from '@/components/appointments/AppointmentRequestModal';

interface TherapistCardProps {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  availableNow: boolean;
  availableLocations: string[];
  onViewProfile: () => void;
}

export default function TherapistCard({
  id,
  name,
  specialty,
  rating,
  reviewCount,
  availableNow,
  availableLocations,
  onViewProfile,
}: TherapistCardProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={`https://ui-avatars.com/api/?name=${name}`} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">{specialty}</p>
          <div className="flex items-center space-x-1">
            <span className="text-xs">{rating}</span>
            <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
          </div>
        </div>
      </div>
      
      <div>
        {availableNow && (
          <Badge>Available Now</Badge>
        )}
        <div className="flex space-x-2 mt-2">
          {availableLocations.map((location) => (
            <Badge key={location} variant="secondary">{location}</Badge>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={onViewProfile} variant="outline">View Profile</Button>
        <Button onClick={() => setShowRequestModal(true)}>Request Appointment</Button>
      </div>

      <AppointmentRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        therapistId={id}
        therapistName={name}
        selectedDate={new Date()}
        selectedTime="09:00"
        locationType="virtual"
      />
    </div>
  );
}
