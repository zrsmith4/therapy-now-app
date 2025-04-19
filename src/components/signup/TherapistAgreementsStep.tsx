
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agreementsSchema } from "@/hooks/useTherapistSignup";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";

interface AgreementsStepProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export const TherapistAgreementsStep = ({ onSubmit, onBack }: AgreementsStepProps) => {
  const form = useForm({
    resolver: zodResolver(agreementsSchema),
    defaultValues: {
      revenueSharing: false,
      equipmentVerification: false,
      licensingAgreement: false,
      insuranceVerification: false,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Agreements</CardTitle>
        <CardDescription>
          Please review and agree to the following terms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                onClick={onBack}
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
  );
};
