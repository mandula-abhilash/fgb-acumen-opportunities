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
  const [opportunityId] = useState(site?.id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(submitSiteSchema),
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
      startOnSiteDate: site?.startOnSiteDate
        ? new Date(site.startOnSiteDate)
        : undefined,
      firstHandoverDate: site?.firstHandoverDate
        ? new Date(site.firstHandoverDate)
        : undefined,
      finalHandoverDate: site?.finalHandoverDate
        ? new Date(site.finalHandoverDate)
        : undefined,
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

  // Set initial values for select fields
  useEffect(() => {
    if (site) {
      // For single select fields
      setValue("opportunityType", site.opportunityType);
      setValue("planningStatus", site.planningStatus);
      setValue("landPurchaseStatus", site.landPurchaseStatus);
      setValue("vatPosition", site.vatPosition);

      // For multi-select fields
      setValue("tenures", site.tenures);
      setValue("region", site.region);
      setValue("lpa", site.lpa);
      setValue("developerRegion", site.developerRegion);

      // For dates
      if (site.startOnSiteDate)
        setValue("startOnSiteDate", new Date(site.startOnSiteDate));
      if (site.firstHandoverDate)
        setValue("firstHandoverDate", new Date(site.firstHandoverDate));
      if (site.finalHandoverDate)
        setValue("finalHandoverDate", new Date(site.finalHandoverDate));
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
        return;
      }

      const siteData = {
        ...data,
        coordinates: selectedLocation,
        boundary: polygonPath,
      };

      await updateLiveOpportunitySite(opportunityId, siteData);

      toast({
        title: "Success",
        description: "Site updated successfully",
      });

      router.push(`/dashboard/opportunities/${opportunityId}`);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update site. Please try again.",
      });
    }
  };

  const handleLocationSelect = (location, address) => {
    setSelectedLocation(location);
    setSelectedAddress(address);
  };

  const handlePolygonComplete = (path) => {
    setPolygonPath(path);
  };

  // File upload handlers
  const handleSitePlanUpload = (fileUrl) => {
    setValue("sitePlanImage", fileUrl);
  };

  const handleSpecificationUpload = (fileUrl) => {
    setValue("proposedSpecification", fileUrl);
  };

  const handleS106Upload = (fileUrl) => {
    setValue("s106Agreement", fileUrl);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
          parentId={opportunityId}
          onSpecificationUpload={handleSpecificationUpload}
          onS106Upload={handleS106Upload}
        />

        <TenureInformation
          watch={watch}
          setValue={setValue}
          register={register}
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
