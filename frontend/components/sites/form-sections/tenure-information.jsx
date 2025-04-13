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
import { tenureTypes } from "@/components/sites/form-constants";

export function TenureInformation({
  watch,
  setValue,
  register,
  errors,
  disabled,
}) {
  const handleTenureChange = (selectedValues) => {
    // Convert values to labels
    const selectedLabels = selectedValues.map((value) => {
      const tenure = tenureTypes.find((t) => t.value === value);
      return tenure ? tenure.label : value;
    });
    setValue("tenures", selectedLabels);
  };

  // Convert stored labels back to values for the MultiSelect
  const convertLabelsToValues = (labels) => {
    if (!Array.isArray(labels)) return [];
    return labels.map((label) => {
      const tenure = tenureTypes.find((t) => t.label === label);
      return tenure ? tenure.value : label;
    });
  };

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
            selected={convertLabelsToValues(watch("tenures"))}
            onChange={handleTenureChange}
            placeholder="Select tenure types..."
            disabled={disabled}
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
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
