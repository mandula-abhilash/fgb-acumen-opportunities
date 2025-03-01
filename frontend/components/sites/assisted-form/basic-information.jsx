"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BasicInformation({ register, errors, selectedAddress }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Enter the essential details about your site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <select
            id="opportunityType"
            {...register("opportunityType")}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
              errors.opportunityType ? "border-destructive" : ""
            )}
          >
            <option value="">Select opportunity type</option>
            <option value="section-106">Section 106</option>
            <option value="grant-funded">Grant Funded Land & Build</option>
            <option value="build-to-rent">Build to Rent</option>
            <option value="care">Care</option>
            <option value="other">Other</option>
          </select>
          {errors.opportunityType && (
            <p className="text-sm text-destructive">
              {errors.opportunityType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="developerName">
            Developer Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="developerName"
            {...register("developerName")}
            className={errors.developerName ? "border-destructive" : ""}
          />
          {errors.developerName && (
            <p className="text-sm text-destructive">
              {errors.developerName.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
