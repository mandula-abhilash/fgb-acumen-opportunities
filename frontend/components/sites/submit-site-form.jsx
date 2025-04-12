"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { createLiveOpportunitySite } from "@/lib/api/liveOpportunities";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { SiteDetails } from "./form-sections/site-details";
import { SiteLocation } from "./form-sections/site-location";
import { TenureInformation } from "./form-sections/tenure-information";

export function SubmitSiteForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [polygonPath, setPolygonPath] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const [opportunityId] = useState(() => uuidv4());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting: isFormSubmitting },
    clearErrors,
    trigger,
  } = useForm({
    resolver: zodResolver(submitSiteSchema),
    mode: "onChange",
  });

  // Scroll to the first error when form submission fails
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"], [id="${firstErrorField}"]`
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus({ preventScroll: true });
      }
    }
  }, [errors]);

  // Clear errors when fields are corrected
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && errors[name]) {
        trigger(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, errors, trigger]);

  const onSubmit = async (data) => {
    try {
      if (!selectedLocation) {
        toast({
          variant: "destructive",
          title: "Location Required",
          description: "Please select a site location using the map.",
        });
        const mapElement = document.querySelector(
          '[data-map-container="true"]'
        );
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      setIsSubmitting(true);
      const siteData = {
        ...data,
        coordinates: selectedLocation,
        boundary: polygonPath,
        opportunityId,
      };

      const response = await createLiveOpportunitySite(siteData);

      toast({
        title: "Success",
        description: "Site submitted successfully",
      });

      router.push("/dashboard/opportunities");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to submit site. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (location, address) => {
    setSelectedLocation(location);
    setSelectedAddress(address);
  };

  const handlePolygonComplete = (path) => {
    setPolygonPath(path);
  };

  const handleSitePlanUpload = (fileUrl) => {
    setValue("sitePlanImage", fileUrl);
  };

  const handleSpecificationUpload = (fileUrl) => {
    setValue("proposedSpecification", fileUrl);
  };

  const handleS106Upload = (fileUrl) => {
    setValue("s106Agreement", fileUrl);
  };

  // Show validation errors at the top if there are any
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 py-4 bg-background/95 backdrop-blur-md dark:bg-background/80"
      noValidate
    >
      <div className="flex flex-col space-y-6 mx-auto">
        {hasErrors && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please correct the following errors before submitting:
              <ul className="mt-2 list-disc list-inside">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="text-sm">
                    {error.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Map and Basic Information Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 min-h-[500px]">
          {/* Basic Information - Takes 1 column on desktop */}
          <div className="order-2 lg:order-1 h-[460px] lg:h-full">
            <BasicInformation
              register={register}
              setValue={setValue}
              errors={errors}
              selectedAddress={selectedAddress}
              selectedLocation={selectedLocation}
            />
          </div>

          {/* Map - Takes 2 columns on desktop */}
          <div
            className="order-1 lg:order-2 lg:col-span-2 h-[460px] lg:h-full"
            data-map-container="true"
          >
            <SiteLocation
              onLocationSelect={handleLocationSelect}
              onPolygonComplete={handlePolygonComplete}
              selectedLocation={selectedLocation}
              polygonPath={polygonPath}
            />
          </div>
        </div>

        <SiteDetails
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          opportunityTypes={opportunityTypes}
          parentId={opportunityId}
          onSitePlanUpload={handleSitePlanUpload}
        />

        <DeveloperInformation
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          clearErrors={clearErrors}
        />

        <LocationInformation
          watch={watch}
          setValue={setValue}
          errors={errors}
          clearErrors={clearErrors}
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
          clearErrors={clearErrors}
        />

        <TenureInformation
          watch={watch}
          setValue={setValue}
          register={register}
          errors={errors}
          tenureTypes={tenureTypes}
          clearErrors={clearErrors}
        />

        <CommercialInformation
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          clearErrors={clearErrors}
        />

        <ProjectTimeline
          register={register}
          watch={watch}
          setValue={setValue}
          clearErrors={clearErrors}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-white hover:bg-gray-50 text-web-orange font-semibold shadow-lg border border-web-orange"
            disabled={isSubmitting || isFormSubmitting}
          >
            {isSubmitting || isFormSubmitting ? "Submitting..." : "Submit Site"}
          </Button>
        </div>
      </div>
    </form>
  );
}
