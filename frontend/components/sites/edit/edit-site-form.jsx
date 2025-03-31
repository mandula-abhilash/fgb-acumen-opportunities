"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { updateLiveOpportunitySite } from "@/lib/api/liveOpportunities";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { submitSiteSchema } from "@/components/sites/form-constants";

import { BasicInformation } from "./sections/basic-information";
import { CommercialInformation } from "./sections/commercial-information";
import { DeveloperInformation } from "./sections/developer-information";
import { LocationInformation } from "./sections/location-information";
import { PlanningInformation } from "./sections/planning-information";
import { ProjectTimeline } from "./sections/project-timeline";
import { SiteLocation } from "./sections/site-location";
import { TenureInformation } from "./sections/tenure-information";

// Debug logging
const log = {
  form: (...args) => console.log("📝 [Form]:", ...args),
  submit: (...args) => console.log("📤 [Submit]:", ...args),
  error: (...args) => console.error("❌ [Error]:", ...args),
  success: (...args) => console.log("✅ [Success]:", ...args),
  validation: (...args) => console.log("🔍 [Validation]:", ...args),
};

export function EditSiteForm({ site }) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(
    site?.coordinates || null
  );
  const [selectedAddress, setSelectedAddress] = useState(
    site?.siteAddress || ""
  );
  const [polygonPath, setPolygonPath] = useState(site?.boundary || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseDate = (dateStr) => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    return date;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(submitSiteSchema),
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

  // Debug: Log form values and validity state
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      log.form("Field changed:", name, value);
      log.validation("Current errors:", errors);
    });
    return () => subscription.unsubscribe();
  }, [watch, errors]);

  const onSubmit = async (data) => {
    log.submit("Form submission started", { siteId: site.id });
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
      log.submit("Form submission finished");
    }
  };

  const handleFormSubmit = async (data) => {
    console.log("🔥 Submit clicked, data:", data);
    await onSubmit(data);
  };

  const handleLocationSelect = (location, address) => {
    log.form("Location selected", { location, address });
    setSelectedLocation(location);
    setSelectedAddress(address);
  };

  const handlePolygonComplete = (path) => {
    log.form("Polygon boundary updated", { pointCount: path.length });
    setPolygonPath(path);
  };

  const handleSitePlanUpload = (fileUrl) => {
    log.form("Site plan uploaded", { fileUrl });
    setValue("sitePlanImage", fileUrl);
  };

  const handleSpecificationUpload = (fileUrl) => {
    log.form("Specification uploaded", { fileUrl });
    setValue("proposedSpecification", fileUrl);
  };

  const handleS106Upload = (fileUrl) => {
    log.form("S106 agreement uploaded", { fileUrl });
    setValue("s106Agreement", fileUrl);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="px-6 py-4 bg-background/95 backdrop-blur-md dark:bg-background/80"
    >
      <div className="flex flex-col space-y-6 mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 min-h-[600px]">
          <div className="order-2 lg:order-1 h-[400px] lg:h-full">
            <BasicInformation
              register={register}
              setValue={setValue}
              errors={errors}
              selectedAddress={selectedAddress}
              selectedLocation={selectedLocation}
              parentId={site.id}
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
          parentId={site.id}
          onSpecificationUpload={handleSpecificationUpload}
          onS106Upload={handleS106Upload}
        />
        <TenureInformation
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
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
            className="bg-web-orange hover:bg-web-orange/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Site"}
          </Button>
        </div>
      </div>
    </form>
  );
}
