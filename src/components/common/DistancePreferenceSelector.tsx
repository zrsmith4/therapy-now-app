
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DistancePreferenceSelectorProps {
  value: number;
  onChange: (value: number) => void;
  userType: "therapist" | "patient";
  maxDistance?: number;
  className?: string;
}

const DistancePreferenceSelector = ({
  value,
  onChange,
  userType,
  maxDistance = 50,
  className
}: DistancePreferenceSelectorProps) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const getDescription = () => {
    if (userType === "therapist") {
      return "Set the maximum distance you are willing to travel to your patients' locations for mobile appointments.";
    } else {
      return "Set the maximum distance you are willing to travel to a clinic for in-person appointments.";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Distance Preference</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Maximum Distance</Label>
              <span className="text-sm font-medium">{value} miles</span>
            </div>
            <Slider
              defaultValue={[value]}
              max={maxDistance}
              step={1}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 miles</span>
              <span>{maxDistance} miles</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mt-4">
            {value === 0 ? (
              userType === "therapist" 
                ? "You are not available for mobile appointments." 
                : "You prefer virtual appointments only."
            ) : (
              `You are willing to travel up to ${value} miles for ${userType === "therapist" ? "mobile appointments" : "in-clinic visits"}.`
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistancePreferenceSelector;
