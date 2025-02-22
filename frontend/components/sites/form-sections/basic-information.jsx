"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BasicInformation({
  register,
  setValue,
  errors,
  opportunityTypes,
  selectedAddress,
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Enter the fundamental details about the site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">
              Site Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="siteName"
              {...register("siteName")}
              className={errors.siteName ? "border-destructive" : ""}
            />
            {errors.siteName && (
              <p className="text-sm text-destructive">
                {errors.siteName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteAddress">
              Site Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="siteAddress"
              {...register("siteAddress")}
              className={errors.siteAddress ? "border-destructive" : ""}
            />
            {errors.siteAddress && (
              <p className="text-sm text-destructive">
                {errors.siteAddress.message}
              </p>
            )}
            {selectedAddress && (
              <div className="mt-2 p-3 rounded-md border bg-muted/50">
                <p className="text-sm break-words">{selectedAddress}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="opportunityType">
              Opportunity Type <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("opportunityType", value)}
            >
              <SelectTrigger
                className={errors.opportunityType ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select opportunity type" />
              </SelectTrigger>
              <SelectContent>
                {opportunityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.opportunityType && (
              <p className="text-sm text-destructive">
                {errors.opportunityType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="plots">
              Number of Plots <span className="text-destructive">*</span>
            </Label>
            <Input
              id="plots"
              type="number"
              min="1"
              {...register("plots", { valueAsNumber: true })}
              className={errors.plots ? "border-destructive" : ""}
            />
            {errors.plots && (
              <p className="text-sm text-destructive">{errors.plots.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMapsLink">
              Google Maps Link <span className="text-destructive">*</span>
            </Label>
            <Input
              id="googleMapsLink"
              type="url"
              {...register("googleMapsLink")}
              className={errors.googleMapsLink ? "border-destructive" : ""}
              placeholder="https://maps.google.com/..."
            />
            {errors.googleMapsLink && (
              <p className="text-sm text-destructive">
                {errors.googleMapsLink.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
