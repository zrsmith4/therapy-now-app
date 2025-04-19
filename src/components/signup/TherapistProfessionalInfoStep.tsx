
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { professionalInfoSchema } from "@/hooks/useTherapistSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ProfessionalInfoStepProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export const TherapistProfessionalInfoStep = ({ onSubmit, onBack }: ProfessionalInfoStepProps) => {
  const form = useForm({
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Information</CardTitle>
        <CardDescription>
          Please provide details about your professional background and services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
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
                        control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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

            <FormField
              control={form.control}
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
                        control={form.control}
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

            <div className="space-y-4 border-t pt-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                onClick={onBack}
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
  );
};
