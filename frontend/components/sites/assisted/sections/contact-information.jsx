"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactInformation({ register, errors, setValue }) {
  const [phoneValue, setPhoneValue] = useState("");

  const handlePhoneChange = (e) => {
    // Only allow numbers, +, -, and spaces
    const value = e.target.value.replace(/[^\d+\- ]/g, "");
    setPhoneValue(value);
    setValue("contactPhone", value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          How should we reach you for additional details?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactEmail"
            type="email"
            {...register("contactEmail")}
            className={errors.contactEmail ? "border-destructive" : ""}
          />
          {errors.contactEmail && (
            <p className="text-sm text-destructive">
              {errors.contactEmail.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone Number</Label>
          <Input
            id="contactPhone"
            value={phoneValue}
            onChange={handlePhoneChange}
            className={errors.contactPhone ? "border-destructive" : ""}
            placeholder="e.g., +44 1234567890"
          />
          {errors.contactPhone && (
            <p className="text-sm text-destructive">
              {errors.contactPhone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            id="additionalInfo"
            {...register("additionalInfo")}
            placeholder="Any additional information you'd like to provide..."
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
