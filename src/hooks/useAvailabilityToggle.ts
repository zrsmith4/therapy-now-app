
import { useState } from 'react';

export const useAvailabilityToggle = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityTimeout, setAvailabilityTimeout] = useState<string | null>(null);
  
  // Handle availability toggle with optional timeout
  const handleAvailabilityToggle = (value: boolean, duration?: string) => {
    setIsAvailable(value);
    setAvailabilityTimeout(duration || null);
    
    if (value && duration) {
      // If a timeout is set, schedule turning off availability
      const timeoutDurations: Record<string, number> = {
        '30min': 30 * 60 * 1000,
        '1hour': 60 * 60 * 1000,
        '2hours': 2 * 60 * 60 * 1000,
        '4hours': 4 * 60 * 60 * 1000,
      };
      
      const timeoutDuration = timeoutDurations[duration];
      if (timeoutDuration) {
        setTimeout(() => {
          setIsAvailable(false);
          setAvailabilityTimeout(null);
        }, timeoutDuration);
      }
    }
  };

  return {
    isAvailable,
    availabilityTimeout,
    handleAvailabilityToggle
  };
};
