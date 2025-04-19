
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, ArrowRight } from "lucide-react";

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

interface MedicalHistoryStepProps {
  onSubmit: (data: z.infer<typeof medicalHistorySchema>) => void;
  onBack: () => void;
}

export const MedicalHistoryStep = ({ onSubmit, onBack }: MedicalHistoryStepProps) => {
  const form = useForm<z.infer<typeof medicalHistorySchema>>({
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
        <CardDescription>Please provide information about your condition and medical history</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
                control={form.control}
                name="painLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pain Level (0-10)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pain level" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="injuryLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Injury Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Previous Treatment, Current Medications, Surgical History */}
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="treatmentGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Goal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What is your goal for physical therapy?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
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
            
            {form.watch("physicianReferral") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
              <Button type="button" variant="outline" onClick={onBack}>
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
