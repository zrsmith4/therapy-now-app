import React from 'react';
import { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe("pk_test_51Oo1k2JjmNqUy8NTgqytl9IzFGodOg2bX5UudIOvGEtZovcgaiLTJhXtL6CIVO5oYDGwG5tgd6EsnPO7TOPeTy9400CcAtdPAO");

interface PaymentFormProps {
  appointmentRequest: {
    id: string;
    therapist_id: string;
    requested_time: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentFormContent = ({ appointmentRequest, onSuccess, onCancel }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/appointments`,
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An error occurred during payment",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
};

export const PaymentForm = ({ appointmentRequest, onSuccess, onCancel }: PaymentFormProps) => {
  const [clientSecret, setClientSecret] = useState<string>();
  const { toast } = useToast();

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { appointmentRequest }
        });

        if (error) throw error;
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast({
          variant: "destructive",
          title: "Payment setup failed",
          description: "Unable to initialize payment. Please try again.",
        });
      }
    };

    createPaymentIntent();
  }, [appointmentRequest]);

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ clientSecret }}
    >
      <PaymentFormContent
        appointmentRequest={appointmentRequest}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};
