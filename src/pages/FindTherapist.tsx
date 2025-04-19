
import React, { useState } from 'react'
import AppHeader from '@/components/layout/AppHeader'
import TherapistFilterBar from '@/components/therapists/TherapistFilterBar'
import TherapistCard from '@/components/therapists/TherapistCard'
import LocationTypeSelector from '@/components/appointments/LocationTypeSelector'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

// Demo data
const demoTherapists = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Sports Rehabilitation',
    rating: 4.8,
    reviewCount: 124,
    availableNow: true,
    availableLocations: ['mobile', 'clinic', 'virtual']
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Orthopedic Therapy',
    rating: 4.7,
    reviewCount: 98,
    availableNow: false,
    availableLocations: ['clinic', 'virtual']
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Neurological Rehabilitation',
    rating: 4.9,
    reviewCount: 156,
    availableNow: true,
    availableLocations: ['mobile', 'virtual']
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Geriatric Therapy',
    rating: 4.6,
    reviewCount: 87,
    availableNow: false,
    availableLocations: ['clinic']
  },
  {
    id: '5',
    name: 'Dr. Olivia Taylor',
    specialty: 'Pediatric Therapy',
    rating: 4.9,
    reviewCount: 112,
    availableNow: false,
    availableLocations: ['mobile', 'clinic']
  },
  {
    id: '6',
    name: 'Dr. Robert Garcia',
    specialty: 'Sports Rehabilitation',
    rating: 4.7,
    reviewCount: 78,
    availableNow: true,
    availableLocations: ['virtual']
  }
]

const FindTherapist = () => {
  const navigate = useNavigate()
  const [locationPreference, setLocationPreference] = useState<'mobile' | 'clinic' | 'virtual'>('mobile')
  const [filters, setFilters] = useState({
    specialties: [] as string[],
    locations: ['mobile', 'clinic', 'virtual'] as Array<'mobile' | 'clinic' | 'virtual'>,
    availableNow: false
  })
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter therapists based on current filters
  const filteredTherapists = demoTherapists.filter(therapist => {
    // Filter by location
    if (!therapist.availableLocations.some(loc => filters.locations.includes(loc as any))) {
      return false
    }
    
    // Filter by availability
    if (filters.availableNow && !therapist.availableNow) {
      return false
    }
    
    // Filter by specialty
    if (filters.specialties.length > 0 && 
        !filters.specialties.some(specialty => 
          therapist.specialty.toLowerCase().includes(specialty.toLowerCase())
        )) {
      return false
    }
    
    // Filter by search query
    if (searchQuery && 
        !therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })
  
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader userType="patient" userName="Alex Smith" />
      
      <main className="container px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-4">Location Preference</h2>
            <LocationTypeSelector 
              value={locationPreference}
              onChange={setLocationPreference}
            />
            
            <div className="mt-6">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
          
          <div className="md:w-2/3 lg:w-3/4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Find a Therapist</h1>
            </div>
            
            <TherapistFilterBar
              filters={filters}
              onFilterChange={setFilters}
              onSearch={setSearchQuery}
            />
            
            {filteredTherapists.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center border">
                <h3 className="text-lg font-medium mb-2">No therapists found</h3>
                <p className="text-slate-500 mb-4">Try adjusting your filters or search criteria</p>
                <Button 
                  onClick={() => {
                    setFilters({
                      specialties: [],
                      locations: ['mobile', 'clinic', 'virtual'],
                      availableNow: false
                    })
                    setSearchQuery('')
                  }}
                  variant="outline"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTherapists.map(therapist => (
                  <TherapistCard
                    key={therapist.id}
                    id={therapist.id}
                    name={therapist.name}
                    specialty={therapist.specialty}
                    rating={therapist.rating}
                    reviewCount={therapist.reviewCount}
                    availableNow={therapist.availableNow}
                    availableLocations={therapist.availableLocations as ('mobile' | 'clinic' | 'virtual')[]}
                    onBook={() => navigate('/appointments')}
                    onViewProfile={() => navigate('/therapist-profile')}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default FindTherapist
