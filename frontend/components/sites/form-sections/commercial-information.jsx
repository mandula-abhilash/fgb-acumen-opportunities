"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CommercialInformation({ register }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commercial Information</CardTitle>
        <CardDescription>Enter commercial and payment details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Textarea
            id="paymentTerms"
            {...register("paymentTerms")}
            placeholder="Describe the payment terms..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agentTerms">Agent Terms</Label>
          <Textarea
            id="agentTerms"
            {...register("agentTerms")}
            placeholder="Specify any agent terms..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
