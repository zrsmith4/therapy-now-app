import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BankInfoForm from "@/components/therapists/BankInfoForm";
import DistancePreferenceSelector from "@/components/common/DistancePreferenceSelector";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TherapistScheduleCalendar from "@/components/therapists/TherapistScheduleCalendar";

type TherapistSettingsProps = {
  userId: string;
  initialData?: any;
};

const TherapistProfileSettings = ({ userId, initialData }: TherapistSettingsProps) => {
  const { toast } = useToast();
  const [distance, setDistance] = useState(initialData?.travel_distance || 15);
  const [loading, setLoading] = useState(!initialData);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    if (initialData) return;

    const loadTherapistSettings = async () => {
      try {
        setLoading(true);

        const { data: therapistData, error: therapistError } = await supabase
          .from('therapists')
          .select('travel_distance')
          .eq('user_id', userId)
          .maybeSingle();

        if (therapistError) throw therapistError;

        if (typeof therapistData?.travel_distance === "number") {
          setDistance(therapistData.travel_distance);
        }

        const { data: paymentData, error: paymentError } = await supabase
          .from('therapist_payment_info')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (paymentError) throw paymentError;

        if (paymentData) {
          setPaymentInfo({
            accountHolderName: paymentData.account_holder_name,
            bankName: paymentData.bank_name,
            accountNumber: paymentData.account_number,
            routingNumber: paymentData.routing_number,
            accountType: paymentData.account_type,
          });
        }
      } catch (error) {
        console.error('Error loading therapist settings:', error);
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
      loadTherapistSettings();
    }
  }, [userId, toast, initialData]);

  const saveDistancePreference = async () => {
    try {
      const { error } = await supabase
        .from('therapists')
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
      <Tabs defaultValue="payment">
        <TabsList className="mb-6">
          <TabsTrigger value="payment">Payment Information</TabsTrigger>
          <TabsTrigger value="distance">Distance Preferences</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="payment">
          <BankInfoForm
            userId={userId}
            existingData={paymentInfo}
          />
        </TabsContent>
        <TabsContent value="distance">
          <Card>
            <CardHeader>
              <CardTitle>Travel Distance</CardTitle>
              <CardDescription>
                Set how far you're willing to travel for mobile appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DistancePreferenceSelector
                value={distance}
                onChange={setDistance}
                userType="therapist"
              />
              <Button onClick={saveDistancePreference} className="w-full">
                Save Distance Preference
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Availability Schedule</CardTitle>
              <CardDescription>
                Set your regular working hours and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TherapistScheduleCalendar userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapistProfileSettings;
