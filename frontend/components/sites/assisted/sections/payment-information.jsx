"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Coins, Loader2, Mail } from "lucide-react";

import { createAssistedSite } from "@/lib/api/assistedSites";
import { createCheckoutSession } from "@/lib/api/stripe";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export function PaymentInformation({
  manageBidsProcess,
  isSubmitting,
  setValue,
  formData,
  onSubmitForm,
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [siteId, setSiteId] = useState(null);

  // Calculate payment details
  const basePrice = 250;

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      // First validate and submit the form data
      const isValid = await onSubmitForm();

      if (!isValid) {
        return; // Form validation failed
      }

      setIsProcessingPayment(true);

      // First save the form data to get a site ID
      try {
        console.log("Submitting form data:", formData);
        const response = await createAssistedSite(formData);

        if (response.success && response.data.id) {
          const newSiteId = response.data.id;
          setSiteId(newSiteId);

          // Now create Stripe checkout session with the site ID
          const { sessionId } = await createCheckoutSession({
            siteId: newSiteId,
          });

          // Redirect to Stripe checkout
          const stripe = await stripePromise;
          if (!stripe) {
            throw new Error("Failed to load Stripe");
          }

          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) throw error;
        } else {
          throw new Error("Failed to save site data");
        }
      } catch (saveError) {
        console.error("Error saving site data:", saveError);
        toast({
          variant: "destructive",
          title: "Error Saving Data",
          description:
            "Failed to save your site information. Please try again.",
        });
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description:
          error.message || "Failed to process payment. Please try again.",
      });
      setIsProcessingPayment(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Service fee for FGB assisted submission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Assisted Submission Service</h3>
              <p className="text-sm text-muted-foreground">
                Professional preparation of your site listing
              </p>
            </div>
            <div className="text-lg font-medium">£{basePrice.toFixed(2)}</div>
          </div>

          {/* Fixed height container for switch row */}
          <div className="flex justify-between items-center pt-2 border-t h-auto py-3">
            <div className="max-w-[80%]">
              <div className="flex items-center">
                <div>
                  <h3 className="font-semibold flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-web-orange" />
                    Contact me about bid management
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This service includes managing the entire bids process,
                    handling queries, and providing a tender summary report. An
                    additional fee will be payable by the buyer.
                  </p>
                  <p className="text-sm text-web-orange mt-1">
                    For more information, please contact andy@fgandb.co.uk
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Switch
                checked={manageBidsProcess}
                onCheckedChange={(checked) => {
                  setValue("manageBidsProcess", checked);
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t-2">
            <div>
              <h3 className="font-bold text-lg">Total</h3>
            </div>
            <div className="text-xl font-bold text-web-orange">
              £{basePrice.toFixed(2)}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="button"
              className="bg-web-orange hover:bg-web-orange/90 text-white font-semibold"
              disabled={isSubmitting || isProcessingPayment}
              onClick={handlePayment}
            >
              {isSubmitting || isProcessingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Pay & Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
