"use client";

import { Coins } from "lucide-react";

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
  const bidManagementFee = manageBidsProcess ? 2750 : 0;
  const totalPrice = basePrice + bidManagementFee;

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

          <div className="flex justify-between items-center pt-2 border-t">
            <div>
              <div className="flex items-center space-x-2">
                <div>
                  <h3 className="font-semibold">
                    FG+B to manage the bids process
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Includes chasing, handling queries, and providing a tender
                    summary report
                  </p>
                </div>
              </div>
            </div>
            <Switch
              checked={manageBidsProcess}
              onCheckedChange={(checked) => {
                setValue("manageBidsProcess", checked);
              }}
            />
          </div>

          {manageBidsProcess && (
            <div className="flex justify-between items-center pt-2 pl-6 text-web-orange">
              <div>
                <p className="text-sm font-medium">Bids Management Fee</p>
              </div>
              <div className="text-lg font-medium">
                £{bidManagementFee.toFixed(2)}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t-2">
            <div>
              <h3 className="font-bold text-lg">Total</h3>
            </div>
            <div className="text-xl font-bold text-web-orange">
              £{totalPrice.toFixed(2)}
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
