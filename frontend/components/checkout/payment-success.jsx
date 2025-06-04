"use client";

import Link from "next/link";
import { CheckCircle2, Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PaymentSuccess() {
  return (
    <div className="relative">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold">Payment Successful!</h1>

          <div className="flex items-center gap-2 text-lg">
            <Coins className="h-5 w-5 text-web-orange" />
            <span>Your assisted site submission has been received</span>
          </div>

          <p className="text-muted-foreground">
            Thank you for your payment. Our team will contact you shortly to
            gather any additional information needed for your site listing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/dashboard/opportunities" className="w-full">
              <Button className="w-full bg-web-orange hover:bg-web-orange/90 text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
