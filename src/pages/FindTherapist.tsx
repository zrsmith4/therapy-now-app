
import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import TherapistFilterBar from '@/components/therapists/TherapistFilterBar';
import TherapistCard from '@/components/therapists/TherapistCard';
import LocationTypeSelector from '@/components/appointments/LocationTypeSelector';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import AvailableSlotsDisplay from '@/components/appointments/AvailableSlotsDisplay';
import RequestAppointmentModal from '@/components/appointments/RequestAppointmentModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Json } from '@/integrations/supabase/types';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00"
];

interface TimeSlot {
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  day_of_week?: number | null;
  is_available: boolean;
  therapist_id?: string;
  location_types?: Array<'mobile' | 'clinic' | 'virtual'>;
}

interface RawTherapistSchedule {
  user_id: string;
  time_slots: Json;
}

const FindTherapist = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [locationPreference, setLocationPreference] = useState<'mobile' | 'clinic' | 'virtual'>('mobile');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [filters, setFilters] = useState({
    specialties: [] as string[],
    locations: ['mobile', 'clinic', 'virtual'] as Array<'mobile' | 'clinic' | 'virtual'>,
    availableNow: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [therapists, setTherapists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const searchTherapists = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    setIsLoading(true);
    try {
      const datetime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Get all therapist schedules
      const { data: therapistSchedules, error } = await supabase
        .from('therapist_schedules')
        .select('user_id, time_slots');
        
      if (error) throw error;
      
      // Filter therapists by location preference
      const availableTherapistIds = (therapistSchedules || [])
        .filter((schedule: RawTherapistSchedule) => {
          const timeSlotsData = schedule.time_slots;
          
          if (!Array.isArray(timeSlotsData)) {
            return false;
          }
          
          return timeSlotsData.some((slotData) => {
            if (
              typeof slotData !== 'object' || 
              slotData === null || 
              !('start_time' in slotData) || 
              !('end_time' in slotData) || 
              !('is_recurring' in slotData) || 
              !('is_available' in slotData)
            ) {
              return false;
            }
            
            const slot = slotData as unknown as TimeSlot;
            
            // Check if slot is available and supports the selected location type
            if (!slot.start_time || !slot.end_time || !slot.is_available) {
              return false;
            }
            
            // Check if the slot supports the selected location type
            if (slot.location_types && !slot.location_types.includes(locationPreference)) {
              return false;
            }
            
            const slotStartTime = new Date(slot.start_time);
            const slotEndTime = new Date(slot.end_time);
            return datetime >= slotStartTime && datetime < slotEndTime;
          });
        })
        .map(schedule => schedule.user_id);

      if (availableTherapistIds.length > 0) {
        const { data: therapistDetails, error: therapistsError } = await supabase
          .from('therapists')
          .select('*')
          .in('user_id', availableTherapistIds)
          // Filter by service options (location types)
          .contains('service_options', [locationPreference]);

        if (therapistsError) throw therapistsError;
        
        // Apply specialty filter if selected
        let filteredTherapists = therapistDetails || [];
        if (filters.specialties.length > 0) {
          filteredTherapists = filteredTherapists.filter(therapist => 
            filters.specialties.some(specialty => 
              therapist.specialties && therapist.specialties.includes(specialty)
            )
          );
        }
        
        setTherapists(filteredTherapists);
      } else {
        setTherapists([]);
      }
    } catch (error) {
      console.error('Error searching therapists:', error);
    }
    setIsLoading(false);
  };

  const handleRequestAppointment = (therapist: { id: string; first_name: string; last_name: string }) => {
    setSelectedTherapist({
      id: therapist.id,
      name: `${therapist.first_name} ${therapist.last_name}`
    });
    setShowRequestModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader userType={userRole || 'patient'} userName={user?.email || ''} />
      
      <main className="container px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="md:w-1/3 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-4">Select Appointment Time</h2>
            
            <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
              <div>
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={{ before: new Date() }}
                  className="rounded-md border"
                />
              </div>

              <div>
                <Label>Preferred Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
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

              <LocationTypeSelector 
                value={locationPreference}
                onChange={setLocationPreference}
              />
            </div>

            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full mt-4"
            >
              Back to Dashboard
            </Button>
          </div>
          
          {/* Main content */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Find a Therapist</h1>
            </div>
            
            <TherapistFilterBar
              filters={filters}
              onFilterChange={setFilters}
              onSearch={setSearchQuery}
            />
            
            <Button 
              onClick={searchTherapists}
              className="w-full mb-6"
              disabled={!selectedDate || !selectedTime || isLoading}
            >
              {isLoading ? "Searching..." : "Search Available Therapists"}
            </Button>

            {therapists.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center border">
                <h3 className="text-lg font-medium mb-2">No therapists found</h3>
                <p className="text-slate-500 mb-4">
                  Try adjusting your filters or selecting a different time
                </p>
                <Button 
                  onClick={() => {
                    setFilters({
                      specialties: [],
                      locations: ['mobile', 'clinic', 'virtual'],
                      availableNow: false
                    });
                    setSearchQuery('');
                  }}
                  variant="outline"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {therapists.map((therapist: any) => (
                  <TherapistCard
                    key={therapist.id}
                    id={therapist.id}
                    name={`${therapist.first_name} ${therapist.last_name}`}
                    specialty={therapist.specialties[0]}
                    rating={4.5}
                    reviewCount={0}
                    availableNow={true}
                    availableLocations={therapist.service_options}
                    onViewProfile={() => navigate('/therapist-profile')}
                    onRequestAppointment={() => handleRequestAppointment(therapist)}
                  >
                    <AvailableSlotsDisplay
                      slots={therapist.time_slots || []}
                      onSlotSelect={(time) => {
                        setSelectedTime(time);
                        handleRequestAppointment(therapist);
                      }}
                      selectedTime={selectedTime}
                    />
                  </TherapistCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedTherapist && (
        <RequestAppointmentModal
          isOpen={showRequestModal}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedTherapist(null);
          }}
          therapistId={selectedTherapist.id}
          therapistName={selectedTherapist.name}
          selectedDate={selectedDate!}
          selectedTime={selectedTime}
          locationType={locationPreference}
          onLocationTypeChange={setLocationPreference}
        />
      )}
    </div>
  );
};

export default FindTherapist;
