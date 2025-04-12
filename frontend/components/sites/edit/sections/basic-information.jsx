"use client";

import { useEffect } from "react";
import { ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BasicInformation({
  register,
  setValue,
  watch,
  errors,
  selectedAddress,
  selectedLocation,
}) {
  useEffect(() => {
    if (selectedLocation) {
      const { lat, lng } = selectedLocation;
      const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
      setValue("googleMapsLink", googleMapsLink);
    }
  }, [selectedLocation, setValue]);

  useEffect(() => {
    if (selectedAddress) {
      setValue("siteAddress", selectedAddress);
      setValue("customSiteAddress", selectedAddress);
    }
  }, [selectedAddress, setValue]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Enter the essential details about the site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteAddress">
              Site Address (From Map){" "}
              <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              Search for the address on the map and adjust the marker pin by
              dragging to set the exact location
            </p>
            <Input
              id="siteAddress"
              {...register("siteAddress")}
              className={errors.siteAddress ? "border-destructive" : ""}
              disabled
              value={selectedAddress || ""}
            />
            {errors.siteAddress && (
              <p className="text-sm text-destructive">
                {errors.siteAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customSiteAddress">
              Custom Site Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customSiteAddress"
              {...register("customSiteAddress")}
              className={errors.customSiteAddress ? "border-destructive" : ""}
              placeholder="Modify address if needed"
            />
            {errors.customSiteAddress && (
              <p className="text-sm text-destructive">
                {errors.customSiteAddress.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              You can modify this address if you need to add additional details
              or make corrections
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMapsLink">
              Google Maps Link <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="googleMapsLink"
                type="url"
                {...register("googleMapsLink")}
                className={
                  errors.googleMapsLink ? "border-destructive pr-10" : "pr-10"
                }
                readOnly
                disabled
              />
              <a
                href={watch("googleMapsLink")}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
                title="Open in Google Maps"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

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
        </div>
      </CardContent>
    </Card>
  );
}
