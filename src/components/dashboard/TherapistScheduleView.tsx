
import React, { useState, useEffect } from 'react';
import TherapistScheduleCalendar from '@/components/therapists/TherapistScheduleCalendar';
import ScheduleOptionsSelector from '@/components/therapists/ScheduleOptionsSelector';
import { Button } from '@/components/ui/button';
import AvailabilityManager from '@/components/therapists/AvailabilityManager';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const TherapistScheduleView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [serviceOptions, setServiceOptions] = useState<Array<'mobile' | 'clinic' | 'virtual'>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTherapistSettings();
    }
  }, [user]);

  const fetchTherapistSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('therapists')
        .select('service_options')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data && Array.isArray(data.service_options)) {
        setServiceOptions(data.service_options as Array<'mobile' | 'clinic' | 'virtual'>);
      }
    } catch (error) {
      console.error('Error fetching therapist settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceOption = async (option: 'mobile' | 'clinic' | 'virtual') => {
    try {
      setLoading(true);
      
      // Create new array based on whether option is currently included
      let updatedOptions: Array<'mobile' | 'clinic' | 'virtual'>;
      
      if (serviceOptions.includes(option)) {
        updatedOptions = serviceOptions.filter(item => item !== option);
      } else {
        updatedOptions = [...serviceOptions, option];
      }
      
      const { error } = await supabase
        .from('therapists')
        .update({ service_options: updatedOptions })
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      setServiceOptions(updatedOptions);
      toast({
        title: "Settings updated",
        description: `${option} visits ${updatedOptions.includes(option) ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      console.error('Error updating service options:', error);
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: "There was a problem updating your settings."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Set Your Availability</h2>
        <AvailabilityManager />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Schedule</h2>
        <ScheduleOptionsSelector />
        <div className="mt-6">
          <TherapistScheduleCalendar userId={user?.id || 'demo-therapist-id'} />
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Location Preferences</h3>
          <p className="text-slate-500 mb-4">
            Where are you willing to provide therapy services?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border rounded-lg p-4 text-center ${serviceOptions.includes('mobile') ? 'bg-medical-light' : ''}`}>
              <h4 className="font-medium mb-1">Mobile</h4>
              <p className="text-xs text-slate-500">Visit patients at their location</p>
              <Button 
                size="sm" 
                className="mt-2"
                variant={serviceOptions.includes('mobile') ? 'default' : 'outline'}
                onClick={() => toggleServiceOption('mobile')}
                disabled={loading}
              >
                {serviceOptions.includes('mobile') ? 'Enabled' : 'Enable'}
              </Button>
            </div>
            
            <div className={`border rounded-lg p-4 text-center ${serviceOptions.includes('clinic') ? 'bg-medical-light' : ''}`}>
              <h4 className="font-medium mb-1">Clinic</h4>
              <p className="text-xs text-slate-500">Patients visit your clinic</p>
              <Button 
                size="sm" 
                className="mt-2"
                variant={serviceOptions.includes('clinic') ? 'default' : 'outline'}
                onClick={() => toggleServiceOption('clinic')}
                disabled={loading}
              >
                {serviceOptions.includes('clinic') ? 'Enabled' : 'Enable'}
              </Button>
            </div>
            
            <div className={`border rounded-lg p-4 text-center ${serviceOptions.includes('virtual') ? 'bg-medical-light' : ''}`}>
              <h4 className="font-medium mb-1">Virtual</h4>
              <p className="text-xs text-slate-500">Remote video sessions</p>
              <Button 
                size="sm" 
                className="mt-2"
                variant={serviceOptions.includes('virtual') ? 'default' : 'outline'}
                onClick={() => toggleServiceOption('virtual')}
                disabled={loading}
              >
                {serviceOptions.includes('virtual') ? 'Enabled' : 'Enable'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistScheduleView;
