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
import { SiteLocation } from "./sections/site-location";
import { TenureInformation } from "./sections/tenure-information";

// Debug logging configuration
const DEBUG = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";
const log = {
  form: (...args) => DEBUG && console.log("📝 [Form]:", ...args),
  submit: (...args) => DEBUG && console.log("📤 [Submit]:", ...args),
  error: (...args) => DEBUG && console.error("❌ [Error]:", ...args),
  success: (...args) => DEBUG && console.log("✅ [Success]:", ...args),
  validation: (...args) => DEBUG && console.log("🔍 [Validation]:", ...args),
};

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
      log.error("Current errors:", errors);
    } else {
      setErrorFields([]);
    }
  }, [errors]);

  // Enhanced scroll to error functionality
  const scrollToError = () => {
    if (errorFields.length === 0) return;

    // Try different selector strategies
    let errorElement = null;
    const fieldId = errorFields[0];

    // First try by name attribute
    errorElement = document.querySelector(`[name="${fieldId}"]`);

    // Then try by id
    if (!errorElement) {
      errorElement = document.getElementById(fieldId);
    }

    // Try with a more general approach for custom components
    if (!errorElement) {
      // Look for labels or containers with data attributes
      errorElement = document.querySelector(
        `[data-field="${fieldId}"], [data-error="${fieldId}"]`
      );
    }

    // Try parent containers that might wrap the field
    if (!errorElement) {
      const possibleContainers = document.querySelectorAll(".field-container");
      possibleContainers.forEach((container) => {
        if (container.querySelector(`[name="${fieldId}"]`)) {
          errorElement = container;
        }
      });
    }

    // If all else fails, try to find any element with the field name in it
    if (!errorElement) {
      document.querySelectorAll("*").forEach((el) => {
        if (el.textContent && el.textContent.includes(fieldId)) {
          const closestInput = el
            .closest("div")
            ?.querySelector("input, select, textarea");
          if (closestInput) {
            errorElement = closestInput;
          }
        }
      });
    }

    if (errorElement) {
      // Use a small delay to ensure the DOM is fully ready
      setTimeout(() => {
        log.form(`Scrolling to error field: ${fieldId}`);
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        try {
          errorElement.focus({ preventScroll: true });
        } catch (e) {
          log.error("Could not focus element:", e);
        }
      }, 100);
    } else {
      log.error(`Could not find element for error field: ${fieldId}`);
      // Fallback: scroll to the form top
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Scroll to the first error when form submission fails
  useEffect(() => {
    // Only scroll if there are errors and we're not actively submitting
    if (errorFields.length > 0 && !isSubmitting) {
      // Add a slight delay to ensure the DOM is fully updated
      const timer = setTimeout(scrollToError, 150);
      return () => clearTimeout(timer);
    }
  }, [errorFields, isSubmitting]);

  // Clear errors when fields are corrected
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && errors[name]) {
        trigger(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, errors, trigger]);

  // Debug: Log form values and validity state
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      log.form("Field changed:", name, value);
      log.validation("Current errors:", errors);
    });
    return () => subscription.unsubscribe();
  }, [watch, errors]);

  useEffect(() => {
    if (site) {
      log.form("Setting initial form values", { siteId: site.id });
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

      log.form("Initial form values set successfully");
    }
  }, [site, setValue]);

  // Modified to better handle errors
  const onSubmit = async (data) => {
    log.submit("Form submission started", { siteId: site.id });
    setIsSubmitting(true);

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
        setIsSubmitting(false);
        return;
      }

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

      log.submit("Submitting to API", siteData);

      const response = await updateLiveOpportunitySite(site.id, siteData);
      log.success("API call success", response);

      toast({
        title: "Success",
        description: "Site updated successfully",
      });

      router.push(`/dashboard/opportunities/${site.id}`);
    } catch (error) {
      log.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update site. Please try again.",
      });

      // Trigger error scroll after submission error
      setTimeout(scrollToError, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Special error handler for form submission to ensure we scroll after validation errors
  const handleFormSubmit = (e) => {
    handleSubmit(onSubmit)(e).catch((error) => {
      log.error("Form validation error:", error);
      // Additional delay to allow React Hook Form to process errors
      setTimeout(scrollToError, 150);
    });
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

  // Show validation errors at the top if there are any
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
                      // Make error items clickable to navigate to the field
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
              parentId={site.id}
              onSitePlanUpload={handleSitePlanUpload}
              watch={watch}
              clearErrors={clearErrors}
            />
          </div>

          {/* Map - Takes 2 columns on desktop */}
          <div
            className="order-1 lg:order-2 lg:col-span-2 h-[400px] lg:h-full"
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
              // If there are already errors, scroll to them on button click
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
