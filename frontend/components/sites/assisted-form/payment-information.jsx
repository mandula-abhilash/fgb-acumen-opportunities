"use client";

import * as React from "react";
import { Coins, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";

export function PaymentInformation({
  manageBidsProcess,
  isSubmitting,
  setValue,
}) {
  // Calculate payment details
  const basePrice = 250;
  // Use state to control height
  const [contentHeight, setContentHeight] = React.useState(
    manageBidsProcess ? "auto" : "auto"
  );

  // Update height when manageBidsProcess changes
  React.useEffect(() => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      setContentHeight("auto");
    }, 10);
  }, [manageBidsProcess]);

  return (
    <Card className="relative">
      <CardHeader className="sticky top-0 bg-background z-10">
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Service fee for FGB assisted submission
        </CardDescription>
      </CardHeader>
      <CardContent
        style={{ height: contentHeight }}
        className="transition-all duration-300"
      >
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
              type="submit"
              className="bg-web-orange hover:bg-web-orange/90 text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
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
