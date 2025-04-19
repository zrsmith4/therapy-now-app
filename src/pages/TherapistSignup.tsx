
import React from "react";
import { useTherapistSignup } from "@/hooks/useTherapistSignup";
import { StepIndicator } from "@/components/signup/StepIndicator";
import { TherapistPersonalInfoStep } from "@/components/signup/TherapistPersonalInfoStep";
import { TherapistProfessionalInfoStep } from "@/components/signup/TherapistProfessionalInfoStep";
import { TherapistAgreementsStep } from "@/components/signup/TherapistAgreementsStep";

const TherapistSignup = () => {
  const { step, setStep, formData, updateFormData, handleSubmitComplete } = useTherapistSignup();

  const handlePersonalInfoSubmit = (data: any) => {
    updateFormData("personalInfo", data);
    setStep(2);
  };

  const handleProfessionalInfoSubmit = (data: any) => {
    updateFormData("professionalInfo", data);
    setStep(3);
  };

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold text-center mb-2">Physical Therapist Registration</h1>
      <p className="text-slate-500 text-center mb-8">Join our platform to connect with patients</p>
      
      <StepIndicator currentStep={step} />
      
      {step === 1 && (
        <TherapistPersonalInfoStep onSubmit={handlePersonalInfoSubmit} />
      )}
      
      {step === 2 && (
        <TherapistProfessionalInfoStep 
          onSubmit={handleProfessionalInfoSubmit}
          onBack={() => setStep(1)}
        />
      )}
      
      {step === 3 && (
        <TherapistAgreementsStep 
          onSubmit={handleSubmitComplete}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
};

export default TherapistSignup;
