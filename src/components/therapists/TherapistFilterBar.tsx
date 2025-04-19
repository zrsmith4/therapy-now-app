
import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { MapPin, Video, Car, Filter, CalendarCheck } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TherapistFilterBarProps {
  filters: {
    specialties: string[]
    locations: Array<'mobile' | 'clinic' | 'virtual'>
    availableNow: boolean
  }
  onFilterChange: (filters: any) => void
  onSearch: (query: string) => void
}

const specialtyOptions = [
  'Sports',
  'Orthopedic',
  'Vestibular',
  'Neurological',
  'Pediatric',
  'Geriatric',
  'Cardiovascular'
]

const TherapistFilterBar = ({
  filters,
  onFilterChange,
  onSearch
}: TherapistFilterBarProps) => {
  const handleSpecialtyChange = (specialty: string) => {
    const updatedSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty]
    
    onFilterChange({
      ...filters,
      specialties: updatedSpecialties
    })
  }
  
  const handleLocationChange = (location: 'mobile' | 'clinic' | 'virtual') => {
    const updatedLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location]
    
    onFilterChange({
      ...filters,
      locations: updatedLocations
    })
  }
  
  const handleAvailableNowChange = () => {
    onFilterChange({
      ...filters,
      availableNow: !filters.availableNow
    })
  }
  
  return (
    <div className="bg-white p-4 rounded-lg border mb-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Input
            placeholder="Search by name or specialty..."
            className="pl-10 w-full"
            onChange={(e) => onSearch(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant={filters.availableNow ? "default" : "outline"}
            size="sm"
            onClick={handleAvailableNowChange}
            className={filters.availableNow ? "bg-medical-success hover:bg-medical-success/90" : ""}
          >
            <CalendarCheck className="h-4 w-4 mr-2" />
            Available Now
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Location Type</h4>
                  <div className="flex flex-wrap gap-2">
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer text-sm ${
                        filters.locations.includes('mobile')
                          ? 'bg-medical-secondary text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      onClick={() => handleLocationChange('mobile')}
                    >
                      <Car className="h-3 w-3" />
                      <span>Mobile</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer text-sm ${
                        filters.locations.includes('clinic')
                          ? 'bg-medical-tertiary text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      onClick={() => handleLocationChange('clinic')}
                    >
                      <MapPin className="h-3 w-3" />
                      <span>Clinic</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer text-sm ${
                        filters.locations.includes('virtual')
                          ? 'bg-medical-primary text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      onClick={() => handleLocationChange('virtual')}
                    >
                      <Video className="h-3 w-3" />
                      <span>Virtual</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Specialties</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {specialtyOptions.map(specialty => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox
                          id={`specialty-${specialty}`}
                          checked={filters.specialties.includes(specialty)}
                          onCheckedChange={() => handleSpecialtyChange(specialty)}
                        />
                        <Label
                          htmlFor={`specialty-${specialty}`}
                          className="text-sm cursor-pointer"
                        >
                          {specialty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

export default TherapistFilterBar
