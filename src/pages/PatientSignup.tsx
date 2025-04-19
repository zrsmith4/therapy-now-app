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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowRight, ArrowLeft, FileText, CreditCard, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PatientSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: null,
    medicalHistory: null,
    consentForms: null,
    paymentInfo: null,
  });
  
  const personalInfoSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    zipCode: z.string().min(1, { message: "Zip code is required" }),
  });

  const medicalHistorySchema = z.object({
    primaryConcern: z.string().min(1, { message: "Primary concern is required" }),
    painLevel: z.string().min(1, { message: "Pain level is required" }),
    injuryLocation: z.string().min(1, { message: "Injury location is required" }),
    previousTreatment: z.string().optional(),
    currentMedications: z.string().optional(),
    surgicalHistory: z.string().optional(),
    treatmentGoal: z.string().min(1, { message: "Treatment goal is required" }),
    physicianReferral: z.boolean(),
    physicianName: z.string().optional(),
    physicianContact: z.string().optional(),
  });

  const consentFormsSchema = z.object({
    treatmentConsent: z.boolean().refine(val => val === true, {
      message: "You must agree to the treatment consent",
    }),
    financialPolicy: z.boolean().refine(val => val === true, {
      message: "You must agree to the financial policy",
    }),
    noShowPolicy: z.boolean().refine(val => val === true, {
      message: "You must agree to the no-show policy",
    }),
    hipaaConsent: z.boolean().refine(val => val === true, {
      message: "You must agree to the HIPAA consent",
    }),
  });

  const paymentInfoSchema = z.object({
    cardName: z.string().min(1, { message: "Name on card is required" }),
    cardNumber: z.string().min(16, { message: "Valid card number is required" }).max(16),
    expiryDate: z.string().min(5, { message: "Expiry date is required" }),
    cvv: z.string().min(3, { message: "CVV is required" }).max(4),
    billingAddress: z.string().min(1, { message: "Billing address is required" }),
    billingCity: z.string().min(1, { message: "City is required" }),
    billingState: z.string().min(1, { message: "State is required" }),
    billingZipCode: z.string().min(1, { message: "Zip code is required" }),
    savePaymentInfo: z.boolean(),
  });

  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const medicalHistoryForm = useForm<z.infer<typeof medicalHistorySchema>>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      primaryConcern: "",
      painLevel: "",
      injuryLocation: "",
      previousTreatment: "",
      currentMedications: "",
      surgicalHistory: "",
      treatmentGoal: "",
      physicianReferral: false,
      physicianName: "",
      physicianContact: "",
    },
  });

  const consentFormsForm = useForm<z.infer<typeof consentFormsSchema>>({
    resolver: zodResolver(consentFormsSchema),
    defaultValues: {
      treatmentConsent: false,
      financialPolicy: false,
      noShowPolicy: false,
      hipaaConsent: false,
    },
  });

  const paymentInfoForm = useForm<z.infer<typeof paymentInfoSchema>>({
    resolver: zodResolver(paymentInfoSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      billingAddress: "",
      billingCity: "",
      billingState: "",
      billingZipCode: "",
      savePaymentInfo: true,
    },
  });

  const onSubmitPersonalInfo = (data: z.infer<typeof personalInfoSchema>) => {
    setFormData(prev => ({ ...prev, personalInfo: data }));
    setStep(2);
  };

  const onSubmitMedicalHistory = (data: z.infer<typeof medicalHistorySchema>) => {
    setFormData(prev => ({ ...prev, medicalHistory: data }));
    setStep(3);
    
    if (data.injuryLocation.toLowerCase().includes('back')) {
      loadOswestryForm();
    } else if (data.injuryLocation.toLowerCase().includes('neck') || 
              data.injuryLocation.toLowerCase().includes('thoracic')) {
      loadNeckDisabilityForm();
    } else if (['shoulder', 'elbow', 'wrist', 'hand', 'finger'].some(
      part => data.injuryLocation.toLowerCase().includes(part))) {
      loadQuickDashForm();
    } else if (['hip', 'knee', 'foot', 'ankle'].some(
      part => data.injuryLocation.toLowerCase().includes(part))) {
      loadLefsForm();
    }
  };

  const loadOswestryForm = () => {
    console.log("Loading Oswestry Disability Index form");
  };

  const loadNeckDisabilityForm = () => {
    console.log("Loading Neck Disability Index form");
  };

  const loadQuickDashForm = () => {
    console.log("Loading QuickDASH form");
  };

  const loadLefsForm = () => {
    console.log("Loading Lower Extremity Functional Scale form");
  };

  const onSubmitConsentForms = (data: z.infer<typeof consentFormsSchema>) => {
    setFormData(prev => ({ ...prev, consentForms: data }));
    setStep(4);
  };

  const onSubmitPaymentInfo = async (data: z.infer<typeof paymentInfoSchema>) => {
    setFormData(prev => ({ ...prev, paymentInfo: data }));
    
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

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div 
                className={`rounded-full h-10 w-10 flex items-center justify-center border-2 
                  ${step === s 
                    ? "border-medical-primary bg-medical-light text-medical-primary" 
                    : step > s 
                      ? "border-medical-primary bg-medical-primary text-white"
                      : "border-gray-300 text-gray-300"
                  }`}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 4 && (
                <div className={`w-10 h-1 ${step > s ? "bg-medical-primary" : "bg-gray-300"}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold text-center mb-2">Patient Registration</h1>
      <p className="text-slate-500 text-center mb-8">Create your patient account to schedule appointments</p>
      
      {renderStepIndicator()}
      
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
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
            <CardTitle>Medical History</CardTitle>
            <CardDescription>
              Please provide information about your condition and medical history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...medicalHistoryForm}>
              <form onSubmit={medicalHistoryForm.handleSubmit(onSubmitMedicalHistory)} className="space-y-6">
                <FormField
                  control={medicalHistoryForm.control}
                  name="primaryConcern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your primary concern?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what brings you in for therapy"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={medicalHistoryForm.control}
                    name="painLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pain Level (0-10)</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select pain level" />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                <SelectItem key={level} value={level.toString()}>
                                  {level} - {level === 0 
                                    ? "No Pain" 
                                    : level < 4 
                                      ? "Mild" 
                                      : level < 7 
                                        ? "Moderate" 
                                        : "Severe"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={medicalHistoryForm.control}
                    name="injuryLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Injury Location</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low Back">Low Back</SelectItem>
                              <SelectItem value="Neck">Neck</SelectItem>
                              <SelectItem value="Thoracic Spine">Thoracic Spine</SelectItem>
                              <SelectItem value="Shoulder">Shoulder</SelectItem>
                              <SelectItem value="Elbow">Elbow</SelectItem>
                              <SelectItem value="Wrist/Hand">Wrist/Hand</SelectItem>
                              <SelectItem value="Hip">Hip</SelectItem>
                              <SelectItem value="Knee">Knee</SelectItem>
                              <SelectItem value="Ankle/Foot">Ankle/Foot</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={medicalHistoryForm.control}
                  name="previousTreatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Treatment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Have you had any previous treatment for this condition?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={medicalHistoryForm.control}
                  name="currentMedications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Medications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any current medications"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={medicalHistoryForm.control}
                  name="surgicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surgical History</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any relevant surgical history"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={medicalHistoryForm.control}
                  name="treatmentGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Goal</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is your goal for physical therapy? (e.g., reduce pain, return to sports, etc.)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={medicalHistoryForm.control}
                  name="physicianReferral"
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
                          Do you have a specific physician you'd like to send evaluations to?
                        </FormLabel>
                        <FormDescription>
                          For direct access states that require sending evaluations to physicians
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {medicalHistoryForm.watch("physicianReferral") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={medicalHistoryForm.control}
                      name="physicianName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Physician Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter physician name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={medicalHistoryForm.control}
                      name="physicianContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Physician Contact (Email/Fax)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter physician email or fax" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
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
            <CardTitle>Consent Forms</CardTitle>
            <CardDescription>
              Please review and agree to the following consent forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...consentFormsForm}>
              <form onSubmit={consentFormsForm.handleSubmit(onSubmitConsentForms)} className="space-y-6">
                <div className="border rounded-md p-4 mb-4 bg-slate-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Treatment Consent
                  </h3>
                  <div className="text-sm text-slate-700 mb-4 max-h-40 overflow-y-auto p-2 bg-white border rounded">
                    <p>I hereby consent to evaluation and treatment by a licensed physical therapist through the Heal on Wheels platform. I understand that physical therapy may involve physical activities and manual techniques that could potentially cause discomfort or injury. I acknowledge that no guarantees have been made to me about the results of therapy.</p>
                    <p className="mt-2">I understand that I have the right to ask questions at any time about the treatment I receive and to discontinue treatment at any time.</p>
                  </div>
                  <FormField
                    control={consentFormsForm.control}
                    name="treatmentConsent"
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
                            I have read and understood the Treatment Consent Form and agree to its terms.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border rounded-md p-4 mb-4 bg-slate-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Financial Policy
                  </h3>
                  <div className="text-sm text-slate-700 mb-4 max-h-40 overflow-y-auto p-2 bg-white border rounded">
                    <p>I understand that payment is due at the time of service. Heal on Wheels is an out-of-network provider with all insurance companies. I agree to pay directly for all services provided.</p>
                    <p className="mt-2">I understand that I am financially responsible for all charges whether or not they are covered by insurance. If needed, I may submit claims to my insurance company on my own behalf for possible reimbursement.</p>
                  </div>
                  <FormField
                    control={consentFormsForm.control}
                    name="financialPolicy"
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
                            I have read and understood the Financial Policy and agree to its terms.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border rounded-md p-4 mb-4 bg-slate-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> No-Show Policy
                  </h3>
                  <div className="text-sm text-slate-700 mb-4 max-h-40 overflow-y-auto p-2 bg-white border rounded">
                    <p>I understand that a $50 fee will be charged for any missed appointment without 24-hour notice. This includes:</p>
                    <ul className="list-disc ml-5 mt-2">
                      <li>Not showing up for an in-clinic appointment</li>
                      <li>Not being present at the location provided for a mobile visit</li>
                      <li>Not joining a scheduled virtual visit</li>
                    </ul>
                    <p className="mt-2">I understand this fee is not covered by insurance and will be charged directly to my payment method on file.</p>
                  </div>
                  <FormField
                    control={consentFormsForm.control}
                    name="noShowPolicy"
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
                            I have read and understood the No-Show Policy and agree to its terms.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border rounded-md p-4 mb-4 bg-slate-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> HIPAA Consent
                  </h3>
                  <div className="text-sm text-slate-700 mb-4 max-h-40 overflow-y-auto p-2 bg-white border rounded">
                    <p>I acknowledge that I have been informed of Heal on Wheels' Notice of Privacy Practices as required by the Health Insurance Portability and Accountability Act (HIPAA).</p>
                    <p className="mt-2">I understand that my personal and health information may be used for treatment, payment, and healthcare operations as described in the Notice.</p>
                  </div>
                  <FormField
                    control={consentFormsForm.control}
                    name="hipaaConsent"
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
                            I have read and understood the HIPAA Consent and agree to its terms.
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
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>
              Please provide your payment details for appointments and no-show fees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...paymentInfoForm}>
              <form onSubmit={paymentInfoForm.handleSubmit(onSubmitPaymentInfo)} className="space-y-6">
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-medium mb-4 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" /> Card Information
                  </h3>
                  
                  <FormField
                    control={paymentInfoForm.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name as it appears on card" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={paymentInfoForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter card number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={paymentInfoForm.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentInfoForm.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="CVV" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Billing Address</h3>
                  
                  <FormField
                    control={paymentInfoForm.control}
                    name="billingAddress"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Billing Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter billing address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormField
                      control={paymentInfoForm.control}
                      name="billingCity"
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
                      control={paymentInfoForm.control}
                      name="billingState"
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
                      control={paymentInfoForm.control}
                      name="billingZipCode"
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
                </div>
                
                <FormField
                  control={paymentInfoForm.control}
                  name="savePaymentInfo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 border-t pt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Save this payment method for future appointments
                        </FormLabel>
                        <FormDescription>
                          Your payment information will be securely stored for future transactions.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(3)}
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

export default PatientSignup;
