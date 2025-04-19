import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, FileText, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StepIndicator } from "@/components/signup/StepIndicator";

const TherapistSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: null,
    professionalInfo: null,
    agreements: null,
  });
  
  const personalInfoSchema = z.object({
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

  const professionalInfoSchema = z.object({
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

  const agreementsSchema = z.object({
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

  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const professionalInfoForm = useForm<z.infer<typeof professionalInfoSchema>>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      licenseNumber: "",
      licenseState: "",
      specialties: [],
      yearsOfExperience: "",
      education: "",
      certifications: "",
      bio: "",
      serviceOptions: [],
      hasNeedlingCertification: false,
      hasMobileTreatmentEquipment: false,
    },
  });

  const agreementsForm = useForm<z.infer<typeof agreementsSchema>>({
    resolver: zodResolver(agreementsSchema),
    defaultValues: {
      revenueSharing: false,
      equipmentVerification: false,
      licensingAgreement: false,
      insuranceVerification: false,
    },
  });

  const onSubmitPersonalInfo = (data: z.infer<typeof personalInfoSchema>) => {
    setFormData(prev => ({ ...prev, personalInfo: data }));
    setStep(2);
  };

  const onSubmitProfessionalInfo = (data: z.infer<typeof professionalInfoSchema>) => {
    setFormData(prev => ({ ...prev, professionalInfo: data }));
    setStep(3);
  };

  const onSubmitAgreements = async (data: z.infer<typeof agreementsSchema>) => {
    setFormData(prev => ({ ...prev, agreements: data }));
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.personalInfo?.email,
        password: formData.personalInfo?.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('therapists')
          .insert([
            {
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
              revenue_sharing_agreed: formData.agreements?.revenueSharing,
              equipment_verification: formData.agreements?.equipmentVerification,
              licensing_agreed: formData.agreements?.licensingAgreement,
              insurance_verification: formData.agreements?.insuranceVerification,
              agreement_date: new Date().toISOString(),
            }
          ]);

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

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold text-center mb-2">Physical Therapist Registration</h1>
      <p className="text-slate-500 text-center mb-8">Join our platform to connect with patients</p>
      
      <StepIndicator currentStep={step} />
      
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Please provide your basic contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...personalInfoForm}>
              <form onSubmit={personalInfoForm.handleSubmit(onSubmitPersonalInfo)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={personalInfoForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalInfoForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={personalInfoForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={personalInfoForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={personalInfoForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={personalInfoForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={personalInfoForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalInfoForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalInfoForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Zip Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="bg-medical-primary hover:bg-medical-dark">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              Please provide details about your professional background and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...professionalInfoForm}>
              <form onSubmit={professionalInfoForm.handleSubmit(onSubmitProfessionalInfo)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={professionalInfoForm.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PT License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your license number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={professionalInfoForm.control}
                    name="licenseState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License State</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AL">Alabama</SelectItem>
                              <SelectItem value="AK">Alaska</SelectItem>
                              <SelectItem value="AZ">Arizona</SelectItem>
                              <SelectItem value="CA">California</SelectItem>
                              <SelectItem value="CO">Colorado</SelectItem>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="TX">Texas</SelectItem>
                              {/* Add all states here */}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={professionalInfoForm.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-2">0-2 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="11-15">11-15 years</SelectItem>
                            <SelectItem value="15+">15+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={professionalInfoForm.control}
                  name="specialties"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Specialties</FormLabel>
                        <FormDescription>
                          Select all specialties that apply to your practice
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "orthopedic", label: "Orthopedic" },
                          { id: "sports", label: "Sports" },
                          { id: "neurological", label: "Neurological" },
                          { id: "vestibular", label: "Vestibular" },
                          { id: "pediatric", label: "Pediatric" },
                          { id: "geriatric", label: "Geriatric" },
                          { id: "cardiopulmonary", label: "Cardiopulmonary" },
                          { id: "womens-health", label: "Women's Health" },
                        ].map((specialty) => (
                          <FormField
                            key={specialty.id}
                            control={professionalInfoForm.control}
                            name="specialties"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={specialty.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(specialty.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, specialty.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== specialty.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {specialty.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={professionalInfoForm.control}
                  name="serviceOptions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Service Options</FormLabel>
                        <FormDescription>
                          Select all service types you are available to provide
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: "mobile", label: "Mobile (Visit patients at their location)" },
                          { id: "clinic", label: "Clinic (Patients visit you at a clinic)" },
                          { id: "virtual", label: "Virtual (Telehealth appointments)" },
                        ].map((service) => (
                          <FormField
                            key={service.id}
                            control={professionalInfoForm.control}
                            name="serviceOptions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={service.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(service.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, service.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== service.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {service.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={professionalInfoForm.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your educational background (degrees, institutions)"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={professionalInfoForm.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Certifications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any additional certifications or specialized training"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={professionalInfoForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a brief description about yourself and your practice"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4 border-t pt-4">
                  <FormField
                    control={professionalInfoForm.control}
                    name="hasNeedlingCertification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I have completed necessary dry needling certification for my state
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={professionalInfoForm.control}
                    name="hasMobileTreatmentEquipment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I have the necessary equipment to provide mobile treatment services
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="bg-medical-primary hover:bg-medical-dark">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Provider Agreements</CardTitle>
            <CardDescription>
              Please review and agree to the following terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...agreementsForm}>
              <form onSubmit={agreementsForm.handleSubmit(onSubmitAgreements)} className="space-y-6">
                <div className="border rounded-md p-4 mb-4 bg-slate-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Revenue Sharing Agreement
                  </h3>
                  <div className="text-sm text-slate-700 mb-4 max-h-40 overflow-y-auto p-2 bg-white border rounded">
                    <p>I agree to provide a portion of the revenue from visits completed through the Heal on Wheels platform as a service fee. This fee helps maintain the platform, connect me with patients, and handle administrative tasks.</p>
                    <p className="mt-2">The current revenue sharing model is as follows:</p>
                    <ul className="list-disc ml-5 mt-2">
                      <li>20% of the visit fee for the first 10 patients per month</li>
                      <li>15% of the visit fee for patients 11-25 per month</li>
                      <li>10% of the visit fee for patients beyond 25 per month</li>
                    </ul>
                    <p className="mt-2">I understand that these rates may be subject to change with adequate notice from Heal on Wheels.</p>
                  </div>
                  <FormField
                    control={agreementsForm.control}
                    name="revenueSharing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the revenue sharing model for services provided through the platform.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border rounded-md p-4 mb-4 bg-slate-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Equipment and Training Verification
                  </h3>
                  <div className="text-sm text-slate-700 mb-4 max-h-40 overflow-y-auto p-2 bg-white border rounded">
                    <p>I confirm that I have the relevant equipment available to treat the patient types I have selected in my profile. For specialized treatments (e.g., dry needling), I have completed all necessary training and certification requirements for my practicing state.</p>
                    <p className="mt-2">I understand that I am responsible for ensuring that all equipment is properly maintained, sanitized, and safe for patient use.</p>
                  </div>
                  <FormField
                    control={agreementsForm.control}
                    name="equipmentVerification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I verify that I have the appropriate equipment and training for the services I offer.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border rounded-md p-4 mb-4 bg-slate-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Licensing Agreement
                  </h3>
                  <div className="text-sm text-slate-700 mb-4 max-h-40 overflow-y-auto p-2 bg-white border rounded">
                    <p>I confirm that I am licensed as a physical therapist in the state(s) I have indicated, and that my license is active and in good standing. I agree to maintain my license in good standing while providing services through the Heal on Wheels platform.</p>
                    <p className="mt-2">I understand that I am responsible for practicing within my scope of practice and adhering to all relevant state regulations and laws.</p>
                    <p className="mt-2">I agree to promptly notify Heal on Wheels of any change in my licensing status, including renewal dates, suspensions, or other disciplinary actions.</p>
                  </div>
                  <FormField
                    control={agreementsForm.control}
                    name="licensingAgreement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I confirm my license is active and valid, and I agree to maintain it while using the platform.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border rounded-md p-4 mb-4 bg-slate-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Malpractice Insurance Verification
                  </h3>
                  <div className="text-sm text-slate-700 mb-4 max-h-40 overflow-y-auto p-2 bg-white border rounded">
                    <p>I confirm that I carry my own professional liability/malpractice insurance at the industry standard rate of $1 million per incident and $3 million aggregate policy limit.</p>
                    <p className="mt-2">I understand that Heal on Wheels does not provide malpractice insurance coverage for therapists using the platform, and I am solely responsible for obtaining and maintaining appropriate coverage.</p>
                    <p className="mt-2">I agree to provide proof of insurance upon request and to notify Heal on Wheels if my coverage lapses or changes significantly.</p>
                  </div>
                  <FormField
                    control={agreementsForm.control}
                    name="insuranceVerification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I confirm I maintain malpractice insurance at the required coverage levels.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="bg-medical-primary hover:bg-medical-dark">
                    Complete Registration
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TherapistSignup;
