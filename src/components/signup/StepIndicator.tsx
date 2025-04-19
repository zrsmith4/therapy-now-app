
import React from 'react';
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div 
              className={`rounded-full h-10 w-10 flex items-center justify-center border-2 
                ${currentStep === s 
                  ? "border-medical-primary bg-medical-light text-medical-primary" 
                  : currentStep > s 
                    ? "border-medical-primary bg-medical-primary text-white"
                    : "border-gray-300 text-gray-300"
                }`}
            >
              {currentStep > s ? <Check className="h-5 w-5" /> : s}
            </div>
            {s < 4 && (
              <div className={`w-10 h-1 ${currentStep > s ? "bg-medical-primary" : "bg-gray-300"}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
