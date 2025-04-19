
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePatientSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: null,
    medicalHistory: null,
    consentForms: null,
    paymentInfo: null,
  });

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({ ...prev, [step]: data }));
  };

  const handleSubmitComplete = async (paymentData: any) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.personalInfo?.email || '',
        password: formData.personalInfo?.password || '',
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('patients')
          .insert([{
            user_id: authData.user.id,
            first_name: formData.personalInfo?.firstName,
            last_name: formData.personalInfo?.lastName,
            phone: formData.personalInfo?.phone,
            date_of_birth: formData.personalInfo?.dateOfBirth,
            address: formData.personalInfo?.address,
            city: formData.personalInfo?.city,
            state: formData.personalInfo?.state,
            zip_code: formData.personalInfo?.zipCode,
          }]);

        if (profileError) throw profileError;

        const { error: medicalError } = await supabase
          .from('patient_medical_history')
          .insert([{
            user_id: authData.user.id,
            primary_concern: formData.medicalHistory?.primaryConcern,
            pain_level: formData.medicalHistory?.painLevel,
            injury_location: formData.medicalHistory?.injuryLocation,
            previous_treatment: formData.medicalHistory?.previousTreatment,
            current_medications: formData.medicalHistory?.currentMedications,
            surgical_history: formData.medicalHistory?.surgicalHistory,
            treatment_goal: formData.medicalHistory?.treatmentGoal,
            physician_referral: formData.medicalHistory?.physicianReferral,
            physician_name: formData.medicalHistory?.physicianName,
            physician_contact: formData.medicalHistory?.physicianContact,
          }]);

        if (medicalError) throw medicalError;

        const { error: consentError } = await supabase
          .from('patient_consents')
          .insert([{
            user_id: authData.user.id,
            treatment_consent: formData.consentForms?.treatmentConsent,
            financial_policy: formData.consentForms?.financialPolicy,
            no_show_policy: formData.consentForms?.noShowPolicy,
            hipaa_consent: formData.consentForms?.hipaaConsent,
            consent_date: new Date().toISOString(),
          }]);

        if (consentError) throw consentError;

        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully!",
        });

        navigate("/");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
      });
    }
  };

  return {
    step,
    setStep,
    formData,
    updateFormData,
    handleSubmitComplete,
  };
};
