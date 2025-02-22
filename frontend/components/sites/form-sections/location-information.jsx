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

export function LocationInformation({
  watch,
  setValue,
  errors,
  regions,
  lpaOptions,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Information</CardTitle>
        <CardDescription>
          Specify the regions and local planning authorities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>
            Region <span className="text-destructive">*</span>
          </Label>
          <MultiSelect
            options={regions}
            selected={watch("region")}
            onChange={(value) => setValue("region", value)}
            placeholder="Select regions..."
          />
          {errors.region && (
            <p className="text-sm text-destructive">{errors.region.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            LPA <span className="text-destructive">*</span>
          </Label>
          <MultiSelect
            options={lpaOptions}
            selected={watch("lpa")}
            onChange={(value) => setValue("lpa", value)}
            placeholder="Select LPA..."
          />
          {errors.lpa && (
            <p className="text-sm text-destructive">{errors.lpa.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
