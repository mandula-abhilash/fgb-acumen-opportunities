"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { updateLiveOpportunitySite } from "@/lib/api/liveOpportunities";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  editSiteSchema,
  landPurchaseStatuses,
  opportunityTypes,
  planningStatuses,
  tenureTypes,
} from "@/components/sites/form-constants";

import { BasicInformation } from "./sections/basic-information";
import { CommercialInformation } from "./sections/commercial-information";
import { DeveloperInformation } from "./sections/developer-information";
import { LocationInformation } from "./sections/location-information";
import { PlanningInformation } from "./sections/planning-information";
import { ProjectTimeline } from "./sections/project-timeline";
import { SiteDetails } from "./sections/site-details";
import { SiteLocation } from "./sections/site-location";
import { TenureInformation } from "./sections/tenure-information";

export function EditSiteForm({ site }) {
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(
    site?.coordinates || null
  );
  const [selectedAddress, setSelectedAddress] = useState(
    site?.siteAddress || ""
  );
  const [polygonPath, setPolygonPath] = useState(site?.boundary || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorFields, setErrorFields] = useState([]);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    return date;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting: isFormSubmitting },
    clearErrors,
    trigger,
  } = useForm({
    resolver: zodResolver(editSiteSchema),
    mode: "onChange",
    defaultValues: {
      siteName: site?.siteName || "",
      siteAddress: site?.siteAddress || "",
      customSiteAddress: site?.customSiteAddress || "",
      opportunityType: site?.opportunityType || "",
      developerName: site?.developerName || "",
      developerRegion: site?.developerRegion || [],
      googleMapsLink: site?.googleMapsLink || "",
      lpa: site?.lpa || [],
      region: site?.region || [],
      planningStatus: site?.planningStatus || "",
      landPurchaseStatus: site?.landPurchaseStatus || "",
      plots: site?.plots || 0,
      tenures: site?.tenures || [],
      startOnSiteDate: parseDate(site?.startOnSiteDate),
      firstHandoverDate: parseDate(site?.firstHandoverDate),
      finalHandoverDate: parseDate(site?.finalHandoverDate),
      planningSubmissionDate: parseDate(site?.planningSubmissionDate),
      planningDeterminationDate: parseDate(site?.planningDeterminationDate),
      firstGoldenBrickDate: parseDate(site?.firstGoldenBrickDate),
      finalGoldenBrickDate: parseDate(site?.finalGoldenBrickDate),
      developerInfo: site?.developerInfo || "",
      siteContext: site?.siteContext || "",
      planningOverview: site?.planningOverview || "",
      proposedDevelopment: site?.proposedDevelopment || "",
      detailedTenureAccommodation: site?.detailedTenureAccommodation || "",
      paymentTerms: site?.paymentTerms || "",
      vatPosition: site?.vatPosition || "",
      projectProgramme: site?.projectProgramme || "",
      agentTerms: site?.agentTerms || "",
      sitePlanImage: site?.sitePlanImage || "",
      proposedSpecification: site?.proposedSpecification || "",
      s106Agreement: site?.s106Agreement || "",
    },
  });

  // Track error fields separately to ensure we have the full list after submission
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrorFields(Object.keys(errors));
    } else {
      setErrorFields([]);
    }
  }, [errors]);

  // Enhanced scroll to error functionality
  const scrollToError = () => {
    if (errorFields.length === 0) return;

    const firstErrorField = errorFields[0];
    const errorElement = document.querySelector(
      `[name="${firstErrorField}"], [id="${firstErrorField}"]`
    );

    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      try {
        errorElement.focus({ preventScroll: true });
      } catch (e) {
        console.error("Could not focus element:", e);
      }
    } else if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Scroll to the first error when form submission fails
  useEffect(() => {
    if (errorFields.length > 0 && !isSubmitting) {
      const timer = setTimeout(scrollToError, 150);
      return () => clearTimeout(timer);
    }
  }, [errorFields, isSubmitting]);

  // Clear errors when fields are corrected
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && errors[name]) {
        trigger(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, errors, trigger]);

  useEffect(() => {
    if (site) {
      setValue("opportunityType", site.opportunityType);
      setValue("planningStatus", site.planningStatus);
      setValue("landPurchaseStatus", site.landPurchaseStatus);
      setValue("vatPosition", site.vatPosition);
      setValue("tenures", site.tenures);
      setValue("region", site.region);
      setValue("lpa", site.lpa);
      setValue("developerRegion", site.developerRegion);

      // Set dates
      const setDateField = (field, dateStr) => {
        if (dateStr) {
          setValue(field, parseDate(dateStr));
        }
      };

      setDateField("startOnSiteDate", site.startOnSiteDate);
      setDateField("firstHandoverDate", site.firstHandoverDate);
      setDateField("finalHandoverDate", site.finalHandoverDate);
      setDateField("planningSubmissionDate", site.planningSubmissionDate);
      setDateField("planningDeterminationDate", site.planningDeterminationDate);
      setDateField("firstGoldenBrickDate", site.firstGoldenBrickDate);
      setDateField("finalGoldenBrickDate", site.finalGoldenBrickDate);
    }
  }, [site, setValue]);

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

      // Format dates to YYYY-MM-DD
      const formatDate = (date) => {
        if (!date) return null;
        return date.toISOString().split("T")[0];
      };

      const siteData = {
        ...data,
        coordinates: selectedLocation,
        boundary: polygonPath,
        startOnSiteDate: formatDate(data.startOnSiteDate),
        firstHandoverDate: formatDate(data.firstHandoverDate),
        finalHandoverDate: formatDate(data.finalHandoverDate),
        planningSubmissionDate: formatDate(data.planningSubmissionDate),
        planningDeterminationDate: formatDate(data.planningDeterminationDate),
        firstGoldenBrickDate: formatDate(data.firstGoldenBrickDate),
        finalGoldenBrickDate: formatDate(data.finalGoldenBrickDate),
      };

      await updateLiveOpportunitySite(site.id, siteData);

      toast({
        title: "Success",
        description: "Site updated successfully",
      });

      router.push(`/dashboard/opportunities/${site.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update site. Please try again.",
      });

      setTimeout(scrollToError, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e) => {
    handleSubmit(onSubmit)(e).catch((error) => {
      setTimeout(scrollToError, 150);
    });
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

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      ref={formRef}
      onSubmit={handleFormSubmit}
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
                  <li
                    key={field}
                    className="text-sm"
                    onClick={() => {
                      const errorField = document.querySelector(
                        `[name="${field}"], #${field}`
                      );
                      if (errorField) {
                        errorField.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                        try {
                          errorField.focus({ preventScroll: true });
                        } catch (e) {}
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
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
              watch={watch}
              clearErrors={clearErrors}
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
          parentId={site.id}
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
          parentId={site.id}
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
            className="bg-web-orange hover:bg-web-orange/90 text-white"
            disabled={isSubmitting || isFormSubmitting}
            onClick={() => {
              if (Object.keys(errors).length > 0) {
                setTimeout(scrollToError, 100);
              }
            }}
          >
            {isSubmitting || isFormSubmitting ? "Updating..." : "Update Site"}
          </Button>
        </div>
      </div>
    </form>
  );
}
