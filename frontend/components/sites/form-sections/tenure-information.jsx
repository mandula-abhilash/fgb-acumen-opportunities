"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";

export function TenureInformation({
  watch,
  setValue,
  register,
  errors,
  tenureTypes,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenure Information</CardTitle>
        <CardDescription>
          Specify the tenure mix and accommodation details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>
            Tenures <span className="text-destructive">*</span>
          </Label>
          <MultiSelect
            options={tenureTypes}
            selected={watch("tenures")}
            onChange={(value) => setValue("tenures", value)}
            placeholder="Select tenure types..."
          />
          {errors.tenures && (
            <p className="text-sm text-destructive">{errors.tenures.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="detailedTenureAccommodation">
            Detailed Tenure & Accommodation
          </Label>
          <Textarea
            id="detailedTenureAccommodation"
            {...register("detailedTenureAccommodation")}
            placeholder="Provide detailed information about tenure mix and accommodation..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
