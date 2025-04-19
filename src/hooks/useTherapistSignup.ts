
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export const personalInfoSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "Zip code is required" }),
});

export const professionalInfoSchema = z.object({
  licenseNumber: z.string().min(1, { message: "License number is required" }),
  licenseState: z.string().min(1, { message: "License state is required" }),
  specialties: z.array(z.string()).min(1, { message: "At least one specialty is required" }),
  yearsOfExperience: z.string().min(1, { message: "Years of experience is required" }),
  education: z.string().min(1, { message: "Education information is required" }),
  certifications: z.string().optional(),
  bio: z.string().min(1, { message: "Professional bio is required" }),
  serviceOptions: z.array(z.string()).min(1, { message: "At least one service option is required" }),
  hasNeedlingCertification: z.boolean().optional(),
  hasMobileTreatmentEquipment: z.boolean().optional(),
});

export const agreementsSchema = z.object({
  revenueSharing: z.boolean().refine(val => val === true, {
    message: "You must agree to the revenue sharing agreement",
  }),
  equipmentVerification: z.boolean().refine(val => val === true, {
    message: "You must verify you have the proper equipment and training",
  }),
  licensingAgreement: z.boolean().refine(val => val === true, {
    message: "You must confirm your license is active and valid",
  }),
  insuranceVerification: z.boolean().refine(val => val === true, {
    message: "You must confirm you maintain malpractice insurance",
  }),
});

export const useTherapistSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: null,
    professionalInfo: null,
    agreements: null,
  });

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({ ...prev, [step]: data }));
  };

  const handleSubmitComplete = async (agreementsData: any) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.personalInfo?.email,
        password: formData.personalInfo?.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Note: We need to create a therapists table in Supabase before this will work
        const { error: profileError } = await supabase
          .from('therapists')
          .insert([{
            user_id: authData.user.id,
            first_name: formData.personalInfo?.firstName,
            last_name: formData.personalInfo?.lastName,
            phone: formData.personalInfo?.phone,
            address: formData.personalInfo?.address,
            city: formData.personalInfo?.city,
            state: formData.personalInfo?.state,
            zip_code: formData.personalInfo?.zipCode,
            license_number: formData.professionalInfo?.licenseNumber,
            license_state: formData.professionalInfo?.licenseState,
            specialties: formData.professionalInfo?.specialties,
            years_of_experience: formData.professionalInfo?.yearsOfExperience,
            education: formData.professionalInfo?.education,
            certifications: formData.professionalInfo?.certifications,
            bio: formData.professionalInfo?.bio,
            service_options: formData.professionalInfo?.serviceOptions,
            has_needling_certification: formData.professionalInfo?.hasNeedlingCertification,
            has_mobile_equipment: formData.professionalInfo?.hasMobileTreatmentEquipment,
            revenue_sharing_agreed: agreementsData.revenueSharing,
            equipment_verification: agreementsData.equipmentVerification,
            licensing_agreed: agreementsData.licensingAgreement,
            insurance_verification: agreementsData.insuranceVerification,
            agreement_date: new Date().toISOString(),
          }]);

        if (profileError) throw profileError;
        
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully!",
        });

        navigate("/therapist-dashboard");
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
