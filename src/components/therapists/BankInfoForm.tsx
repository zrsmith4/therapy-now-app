
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const bankInfoSchema = z.object({
  accountHolderName: z.string().min(1, { message: "Account holder name is required" }),
  bankName: z.string().min(1, { message: "Bank name is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  routingNumber: z.string().min(9, { message: "Routing number must be at least 9 digits" }).max(9, { message: "Routing number must be 9 digits" }),
  accountType: z.string().min(1, { message: "Account type is required" }),
});

type BankInfoFormProps = {
  userId: string;
  onSuccess?: () => void;
  existingData?: z.infer<typeof bankInfoSchema>;
};

const BankInfoForm = ({ userId, onSuccess, existingData }: BankInfoFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof bankInfoSchema>>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues: existingData || {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof bankInfoSchema>) => {
    try {
      const { error } = await supabase
        .from('therapist_payment_info')
        .upsert(
          {
            user_id: userId,
            account_holder_name: data.accountHolderName,
            bank_name: data.bankName,
            account_number: data.accountNumber,
            routing_number: data.routingNumber,
            account_type: data.accountType,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;

      toast({
        title: "Payment information saved",
        description: "Your bank information has been successfully updated.",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving bank information:", error);
      toast({
        variant: "destructive",
        title: "Error saving information",
        description: "There was a problem saving your bank information. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Add your bank details to receive payments for your services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the name on your account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Routing Number</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="9-digit routing number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Checking or Savings" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Save Payment Information</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BankInfoForm;
