"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const opportunityTypes = [
  { value: "section-106", label: "Section 106" },
  { value: "grant-funded", label: "Grant Funded Land & Build" },
  { value: "build-to-rent", label: "Build to Rent" },
  { value: "care", label: "Care" },
  { value: "other", label: "Other" },
];

const regions = [
  { value: "north-east", label: "North East" },
  { value: "north-west", label: "North West" },
  { value: "yorkshire-humber", label: "Yorkshire and the Humber" },
  { value: "east-midlands", label: "East Midlands" },
  { value: "west-midlands", label: "West Midlands" },
  { value: "east-england", label: "East of England" },
  { value: "london", label: "London" },
  { value: "south-east", label: "South East" },
  { value: "south-west", label: "South West" },
  { value: "wales", label: "Wales" },
  { value: "scotland", label: "Scotland" },
  { value: "northern-ireland", label: "Northern Ireland" },
];

const lpaOptions = [
  { value: "manchester", label: "Manchester City Council" },
  { value: "liverpool", label: "Liverpool City Council" },
  { value: "leeds", label: "Leeds City Council" },
  // Add more LPA options as needed
];

const tenureTypes = [
  { value: "social-rent", label: "Social Rent" },
  { value: "affordable-rent", label: "Affordable Rent" },
  { value: "shared-ownership", label: "Shared Ownership" },
  { value: "first-homes", label: "First Homes" },
  { value: "open-market", label: "Open Market" },
  { value: "build-to-rent", label: "Build to Rent" },
  { value: "care", label: "Care" },
];

const planningStatuses = [
  { value: "allocated", label: "Allocated" },
  { value: "draft-allocation", label: "Draft Allocation" },
  { value: "outline-submission", label: "Outline Submission" },
  { value: "outline-approval", label: "Outline Approval" },
  { value: "full-submission", label: "Full Submission" },
  { value: "full-approval", label: "Full Approval" },
  { value: "detailed-submission", label: "Detailed Submission" },
  { value: "detailed-approval", label: "Detailed Approval" },
  { value: "appeal-lodged", label: "Appeal Lodged" },
  { value: "appeal-allowed", label: "Appeal Allowed" },
];

const landPurchaseStatuses = [
  { value: "land-offer", label: "Land Offer Stage" },
  { value: "preferred-buyer", label: "Preferred Buyer" },
  { value: "heads-of-terms", label: "Heads of Terms Agreed" },
  { value: "contracts-exchanged", label: "Contracts Exchanged" },
  { value: "purchase-completed", label: "Purchase Completed" },
];

const plotsSchema = z.object({
  mode: z.enum(["between", "more-than", "less-than"]),
  min: z.string().optional(),
  max: z.string().optional(),
  single: z.string().optional(),
});

const submitSiteSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  opportunityType: z.string().min(1, "Opportunity type is required"),
  developerName: z.string().min(1, "Developer name is required"),
  developerRegion: z.string().optional(),
  googleMapsLink: z.string().url("Please enter a valid Google Maps URL"),
  lpa: z.array(z.string()).min(1, "Please select at least one LPA"),
  region: z.array(z.string()).min(1, "Please select at least one region"),
  planningStatus: z.string().min(1, "Planning status is required"),
  landPurchaseStatus: z.string().min(1, "Land purchase status is required"),
  plots: plotsSchema,
  tenures: z.array(z.string()).min(1, "Please select at least one tenure type"),
  startOnSiteDate: z.date().optional(),
  handoverDate: z.date().optional(),
});

export function SubmitSiteForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [plotsMode, setPlotsMode] = useState("between");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(submitSiteSchema),
    defaultValues: {
      plots: {
        mode: "between",
        min: "",
        max: "",
        single: "",
      },
      lpa: [],
      region: [],
      tenures: [],
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      toast({
        title: "Success",
        description: "Site submitted successfully",
      });
      router.push("/dashboard/opportunities");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit site. Please try again.",
      });
    }
  };

  const handleFileChange = (event, field) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log(`Selected ${field} file:`, file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
      <Card className="mb-6">
        <CardContent className="pt-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-2">
              <Label htmlFor="developerRegion">Developer Region</Label>
              <Select
                onValueChange={(value) => setValue("developerRegion", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select developer region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-sm text-destructive">
                  {errors.region.message}
                </p>
              )}
            </div>
          </div>

          {/* Status Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="planningStatus">
                Planning Status <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("planningStatus", value)}
              >
                <SelectTrigger
                  className={errors.planningStatus ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select planning status" />
                </SelectTrigger>
                <SelectContent>
                  {planningStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.planningStatus && (
                <p className="text-sm text-destructive">
                  {errors.planningStatus.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="landPurchaseStatus">
                Land Purchase Status <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("landPurchaseStatus", value)}
              >
                <SelectTrigger
                  className={
                    errors.landPurchaseStatus ? "border-destructive" : ""
                  }
                >
                  <SelectValue placeholder="Select land purchase status" />
                </SelectTrigger>
                <SelectContent>
                  {landPurchaseStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.landPurchaseStatus && (
                <p className="text-sm text-destructive">
                  {errors.landPurchaseStatus.message}
                </p>
              )}
            </div>
          </div>

          {/* Plots and Tenures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>
                Plots <span className="text-destructive">*</span>
              </Label>
              <Select
                value={plotsMode}
                onValueChange={(value) => {
                  setPlotsMode(value);
                  setValue("plots.mode", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plots range type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="between">Between</SelectItem>
                  <SelectItem value="more-than">More than</SelectItem>
                  <SelectItem value="less-than">Less than</SelectItem>
                </SelectContent>
              </Select>

              {plotsMode === "between" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="number"
                      placeholder="Min plots"
                      {...register("plots.min")}
                      className={errors.plots?.min ? "border-destructive" : ""}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max plots"
                      {...register("plots.max")}
                      className={errors.plots?.max ? "border-destructive" : ""}
                    />
                  </div>
                </div>
              ) : (
                <Input
                  type="number"
                  placeholder={`${
                    plotsMode === "more-than" ? "Minimum" : "Maximum"
                  } plots`}
                  {...register("plots.single")}
                  className={errors.plots?.single ? "border-destructive" : ""}
                />
              )}
              {errors.plots && (
                <p className="text-sm text-destructive">
                  {errors.plots.message}
                </p>
              )}
            </div>

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
                <p className="text-sm text-destructive">
                  {errors.tenures.message}
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Start on Site Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watch("startOnSiteDate") && "text-muted-foreground"
                    )}
                  >
                    {watch("startOnSiteDate") ? (
                      format(watch("startOnSiteDate"), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watch("startOnSiteDate")}
                    onSelect={(date) => setValue("startOnSiteDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Handover Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watch("handoverDate") && "text-muted-foreground"
                    )}
                  >
                    {watch("handoverDate") ? (
                      format(watch("handoverDate"), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watch("handoverDate")}
                    onSelect={(date) => setValue("handoverDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Developer Specification Document</Label>
              <Input
                type="file"
                onChange={(e) =>
                  handleFileChange(e, "developerSpecificationDocument")
                }
                accept=".pdf,.doc,.docx"
              />
            </div>

            <div className="space-y-2">
              <Label>Section 106 Agreement</Label>
              <Input
                type="file"
                onChange={(e) => handleFileChange(e, "section106Agreement")}
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-white hover:bg-gray-50 text-web-orange font-semibold shadow-lg border border-web-orange"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Site"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
