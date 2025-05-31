"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPaymentSession } from "@/visdak-auth/src/api/stripe";
import { CheckCircle2, Loader2 } from "lucide-react";

import { createAssistedSite } from "@/lib/api/assistedSites";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState("verifying");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        router.replace("/dashboard");
        return;
      }

      try {
        const result = await verifyPaymentSession(sessionId);
        if (result.status === "complete" || result.paymentStatus === "paid") {
          setStatus("creating");
          const siteData = JSON.parse(result.metadata?.siteData || "{}");
          await createAssistedSite(siteData);
          setStatus("success");
        } else {
          setStatus("failed");
          setTimeout(() => router.replace("/dashboard"), 2000);
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStatus("failed");
        setTimeout(() => router.replace("/dashboard"), 2000);
      }
    };

    verifyPayment();
  }, [sessionId, router, toast]);

  if (status === "verifying" || status === "creating") {
    return (
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-web-orange" />
          <p className="text-muted-foreground">
            {status === "verifying"
              ? "Verifying your payment..."
              : "Creating your site..."}
          </p>
        </div>
      </Card>
    );
  }

  if (status === "failed") {
    return (
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-web-orange" />
          <p className="text-muted-foreground">
            Payment verification failed. Redirecting...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold">Success!</h1>
        <p className="text-muted-foreground">
          Your site has been submitted successfully. Our team will review and
          prepare your listing within 2-3 business days.
        </p>
        <Button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-web-orange hover:bg-web-orange/90 text-white"
        >
          Back to Dashboard
        </Button>
      </div>
    </Card>
  );
}
