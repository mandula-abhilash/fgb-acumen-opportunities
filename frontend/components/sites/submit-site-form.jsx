"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { createLiveOpportunitySite } from "@/lib/api/liveOpportunities";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import {
  landPurchaseStatuses,
  opportunityTypes,
  planningStatuses,
  submitSiteSchema,
  tenureTypes,
} from "./form-constants";
import { BasicInformation } from "./form-sections/basic-information";
import { CommercialInformation } from "./form-sections/commercial-information";
import { DeveloperInformation } from "./form-sections/developer-information";
import { LocationInformation } from "./form-sections/location-information";
import { PlanningInformation } from "./form-sections/planning-information";
import { ProjectTimeline } from "./form-sections/project-timeline";
import { SiteLocation } from "./form-sections/site-location";
import { TenureInformation } from "./form-sections/tenure-information";

// Debug logging configuration
const DEBUG = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";
const log = {
  form: (...args) => console.log("📝 [Form]:", ...args),
  submit: (...args) => console.log("📤 [Submit]:", ...args),
  error: (...args) => console.error("❌ [Error]:", ...args),
  success: (...args) => console.log("✅ [Success]:", ...args),
  validation: (...args) => console.log("🔍 [Validation]:", ...args),
};

export function SubmitSiteForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [polygonPath, setPolygonPath] = useState([]);
  const [opportunityId] = useState(() => uuidv4());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(submitSiteSchema),
    defaultValues: {
      lpa: [],
      region: [],
      tenures: [],
      sitePlanImage: "",
      proposedSpecification: "",
      s106Agreement: "",
      googleMapsLink: "",
      vatPosition: "",
      siteAddress: "",
      customSiteAddress: "",
      opportunityType: "",
      planningStatus: "",
      landPurchaseStatus: "",
    },
  });

  // Debug: Log form values and validity state
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      log.form("Field changed:", name, value);
      log.validation("Current errors:", errors);
    });
    return () => subscription.unsubscribe();
  }, [watch, errors]);

  const onSubmit = async (data) => {
    log.submit("Form submission started");
    try {
      if (!selectedLocation) {
        log.error("Location validation failed - no location selected");
        toast({
          variant: "destructive",
          title: "Location Required",
          description: "Please select a site location using the map.",
        });
        return;
      }

      const siteData = {
        ...data,
        coordinates: selectedLocation,
        boundary: polygonPath,
        opportunityId,
      };

      log.submit("Submitting data:", siteData);

      const response = await createLiveOpportunitySite(siteData);
      log.success("API call success:", response);

      toast({
        title: "Success",
        description: "Site submitted successfully",
      });

      router.push("/dashboard/opportunities");
    } catch (error) {
      log.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to submit site. Please try again.",
      });
    }
  };

  const handleFormSubmit = async (data) => {
    console.log("🔥 Submit clicked, data:", data);
    await onSubmit(data);
  };

  const handleLocationSelect = (location, address) => {
    log.form("Location selected:", { location, address });
    setSelectedLocation(location);
    setSelectedAddress(address);
  };

  const handlePolygonComplete = (path) => {
    log.form("Polygon boundary updated:", { pointCount: path.length });
    setPolygonPath(path);
  };

  const handleSitePlanUpload = (fileUrl) => {
    log.form("Site plan uploaded:", { fileUrl });
    setValue("sitePlanImage", fileUrl);
  };

  const handleSpecificationUpload = (fileUrl) => {
    log.form("Specification uploaded:", { fileUrl });
    setValue("proposedSpecification", fileUrl);
  };

  const handleS106Upload = (fileUrl) => {
    log.form("S106 agreement uploaded:", { fileUrl });
    setValue("s106Agreement", fileUrl);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="px-6 py-4 bg-background/95 backdrop-blur-md dark:bg-background/80"
    >
      <div className="flex flex-col space-y-6 mx-auto">
        {/* Map and Basic Information Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 min-h-[600px]">
          {/* Basic Information - Takes 1 column on desktop */}
          <div className="order-2 lg:order-1 h-[400px] lg:h-full">
            <BasicInformation
              register={register}
              setValue={setValue}
              errors={errors}
              opportunityTypes={opportunityTypes}
              selectedAddress={selectedAddress}
              selectedLocation={selectedLocation}
              parentId={opportunityId}
              onSitePlanUpload={handleSitePlanUpload}
              watch={watch}
            />
          </div>

          {/* Map - Takes 2 columns on desktop */}
          <div className="order-1 lg:order-2 lg:col-span-2 h-[400px] lg:h-full">
            <SiteLocation
              onLocationSelect={handleLocationSelect}
              onPolygonComplete={handlePolygonComplete}
              selectedLocation={selectedLocation}
              polygonPath={polygonPath}
            />
          </div>
        </div>

        <DeveloperInformation
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />

        <LocationInformation
          watch={watch}
          setValue={setValue}
          errors={errors}
        />

        <PlanningInformation
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          planningStatuses={planningStatuses}
          landPurchaseStatuses={landPurchaseStatuses}
          parentId={opportunityId}
          onSpecificationUpload={handleSpecificationUpload}
          onS106Upload={handleS106Upload}
        />

        <TenureInformation
          watch={watch}
          setValue={setValue}
          register={register}
          errors={errors}
          tenureTypes={tenureTypes}
        />

        <CommercialInformation
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />

        <ProjectTimeline
          register={register}
          watch={watch}
          setValue={setValue}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-white hover:bg-gray-50 text-web-orange font-semibold shadow-lg border border-web-orange"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Site"}
          </Button>
        </div>
      </div>
    </form>
  );
}
