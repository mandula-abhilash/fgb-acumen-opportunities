"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { vatPositions } from "@/components/sites/form-constants";

export function CommercialInformation({
  register,
  setValue,
  watch,
  errors,
  disabled,
}) {
  const currentVatPosition = watch("vatPosition");

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
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vatPosition">VAT Position</Label>
          <Select
            value={currentVatPosition}
            onValueChange={(value) => setValue("vatPosition", value)}
            disabled={disabled}
          >
            <SelectTrigger
              className={errors?.vatPosition ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select VAT position" />
            </SelectTrigger>
            <SelectContent>
              {vatPositions.map((position) => (
                <SelectItem key={position.value} value={position.label}>
                  {position.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="agentTerms">Agent Terms (if applicable)</Label>
          <Textarea
            id="agentTerms"
            {...register("agentTerms")}
            placeholder="Specify any agent terms if applicable..."
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
