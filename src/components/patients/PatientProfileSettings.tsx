import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DistancePreferenceSelector from "@/components/common/DistancePreferenceSelector";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type PatientSettingsProps = {
  userId: string;
  initialData?: any; // Added initialData prop
};

const PatientProfileSettings = ({ userId, initialData }: PatientSettingsProps) => {
  const { toast } = useToast();
  const [distance, setDistance] = useState(initialData?.travel_distance || 25); // Use initialData if provided
  const [loading, setLoading] = useState(!initialData); // Don't show loading if we have initialData

  // Load patient settings only if we don't have initialData
  useEffect(() => {
    if (initialData) return; // Skip loading if we have initialData
    
    const loadPatientSettings = async () => {
      try {
        setLoading(true);
        
        // Load distance preference
        const { data, error } = await supabase
          .from('patients')
          .select('travel_distance')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (error) throw error;
        
        if (typeof data?.travel_distance === "number") {
          setDistance(data.travel_distance);
        }
      } catch (error) {
        console.error('Error loading patient settings:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading settings',
          description: 'Unable to load your profile settings. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadPatientSettings();
    }
  }, [userId, toast, initialData]);
  
  const saveDistancePreference = async () => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ travel_distance: distance })
        .eq('user_id', userId);
        
      if (error) throw error;
      
      toast({
        title: 'Distance preference saved',
        description: 'Your travel distance preference has been updated.',
      });
    } catch (error) {
      console.error('Error saving distance preference:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving preference',
        description: 'Unable to save your distance preference. Please try again.',
      });
    }
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading your profile settings...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile Settings</h2>
      
      <Tabs defaultValue="distance">
        <TabsList className="mb-6">
          <TabsTrigger value="distance">Distance Preferences</TabsTrigger>
          <TabsTrigger value="medical">Medical Information</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="distance">
          <Card>
            <CardHeader>
              <CardTitle>Travel Distance</CardTitle>
              <CardDescription>
                Set how far you're willing to travel to visit a clinic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DistancePreferenceSelector
                value={distance}
                onChange={setDistance}
                userType="patient"
              />
              <Button onClick={saveDistancePreference} className="w-full">
                Save Distance Preference
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>
                Update your medical history and current conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Medical information editor coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insurance">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
              <CardDescription>
                Manage your health insurance details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Insurance information editor coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientProfileSettings;
