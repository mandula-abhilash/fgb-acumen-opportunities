"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import {
  getLiveOpportunitySite,
  updateLiveOpportunitySite,
} from "@/lib/api/liveOpportunities";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/page-header";
import {
  landPurchaseStatuses,
  opportunityTypes,
  planningStatuses,
  submitSiteSchema,
  tenureTypes,
  vatPositions,
} from "@/components/sites/form-constants";
import { BasicInformation } from "@/components/sites/form-sections/basic-information";
import { CommercialInformation } from "@/components/sites/form-sections/commercial-information";
import { DeveloperInformation } from "@/components/sites/form-sections/developer-information";
import { LocationInformation } from "@/components/sites/form-sections/location-information";
import { PlanningInformation } from "@/components/sites/form-sections/planning-information";
import { ProjectTimeline } from "@/components/sites/form-sections/project-timeline";
import { SiteLocation } from "@/components/sites/form-sections/site-location";
import { TenureInformation } from "@/components/sites/form-sections/tenure-information";

export default function OpportunityDetailsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [polygonPath, setPolygonPath] = useState([]);
  const [opportunityId] = useState(() => params.id || uuidv4());

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
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        const response = await getLiveOpportunitySite(params.id);
        const opportunity = response.data;

        // Map opportunity type from constants
        const opportunityTypeOption = opportunityTypes.find(
          (type) => type.label === opportunity.opportunityType
        );

        // Map planning status from constants
        const planningStatusOption = planningStatuses.find(
          (status) => status.label === opportunity.planningStatus
        );

        // Map land purchase status from constants
        const landPurchaseStatusOption = landPurchaseStatuses.find(
          (status) => status.label === opportunity.landPurchaseStatus
        );

        // Map VAT position from constants
        const vatPositionOption = vatPositions.find(
          (pos) => pos.label === opportunity.vatPosition
        );

        // Set form values with mapped options
        setValue("siteName", opportunity.siteName);
        setValue("siteAddress", opportunity.siteAddress);
        setValue("customSiteAddress", opportunity.customSiteAddress);
        setValue(
          "opportunityType",
          opportunityTypeOption?.value || opportunity.opportunityType
        );
        setValue("developerName", opportunity.developerName);
        setValue("developerRegion", opportunity.developerRegion);
        setValue("googleMapsLink", opportunity.googleMapsLink);
        setValue("lpa", opportunity.lpa);
        setValue("region", opportunity.region);
        setValue(
          "planningStatus",
          planningStatusOption?.value || opportunity.planningStatus
        );
        setValue(
          "landPurchaseStatus",
          landPurchaseStatusOption?.value || opportunity.landPurchaseStatus
        );
        setValue("plots", opportunity.plots);
        setValue("tenures", opportunity.tenures);
        setValue(
          "startOnSiteDate",
          opportunity.startOnSiteDate
            ? new Date(opportunity.startOnSiteDate)
            : null
        );
        setValue(
          "firstHandoverDate",
          opportunity.firstHandoverDate
            ? new Date(opportunity.firstHandoverDate)
            : null
        );
        setValue(
          "finalHandoverDate",
          opportunity.finalHandoverDate
            ? new Date(opportunity.finalHandoverDate)
            : null
        );
        setValue("developerInfo", opportunity.developerInfo);
        setValue("siteContext", opportunity.siteContext);
        setValue("planningOverview", opportunity.planningOverview);
        setValue("proposedDevelopment", opportunity.proposedDevelopment);
        setValue(
          "detailedTenureAccommodation",
          opportunity.detailedTenureAccommodation
        );
        setValue("paymentTerms", opportunity.paymentTerms);
        setValue("projectProgramme", opportunity.projectProgramme);
        setValue("agentTerms", opportunity.agentTerms);
        setValue("sitePlanImage", opportunity.sitePlanImage);
        setValue("proposedSpecification", opportunity.proposedSpecification);
        setValue("s106Agreement", opportunity.s106Agreement);
        setValue(
          "vatPosition",
          vatPositionOption?.value || opportunity.vatPosition
        );

        // Set location data
        if (opportunity.coordinates) {
          setSelectedLocation(opportunity.coordinates);
          setSelectedAddress(opportunity.siteAddress);
        }

        // Set polygon path if exists
        if (opportunity.boundary) {
          setPolygonPath(opportunity.boundary);
        }
      } catch (error) {
        console.error("Error fetching opportunity:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch opportunity details",
        });
        router.push("/dashboard/opportunities");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOpportunity();
    }
  }, [params.id, setValue, toast, router]);

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

      await updateLiveOpportunitySite(params.id, siteData);

      toast({
        title: "Success",
        description: "Site updated successfully",
      });

      router.push("/dashboard/opportunities");
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

  if (loading || authLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const canEdit = user.role === "admin" || user.id === watch("user_id");

  return (
    <div className="flex flex-col">
      <PageHeader title={canEdit ? "Edit Site" : "View Site Details"}>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/opportunities")}
        >
          Back to Opportunities
        </Button>
      </PageHeader>

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
                watch={watch}
                errors={errors}
                opportunityTypes={opportunityTypes}
                selectedAddress={selectedAddress}
                selectedLocation={selectedLocation}
                parentId={opportunityId}
                onSitePlanUpload={handleSitePlanUpload}
                disabled={!canEdit}
              />
            </div>

            {/* Map - Takes 2 columns on desktop */}
            <div className="order-1 lg:order-2 lg:col-span-2 h-[400px] lg:h-full">
              <SiteLocation
                onLocationSelect={handleLocationSelect}
                onPolygonComplete={handlePolygonComplete}
                selectedLocation={selectedLocation}
                polygonPath={polygonPath}
                disabled={!canEdit}
              />
            </div>
          </div>

          <DeveloperInformation
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            disabled={!canEdit}
          />

          <LocationInformation
            watch={watch}
            setValue={setValue}
            errors={errors}
            disabled={!canEdit}
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
            disabled={!canEdit}
          />

          <TenureInformation
            watch={watch}
            setValue={setValue}
            register={register}
            errors={errors}
            tenureTypes={tenureTypes}
            disabled={!canEdit}
          />

          <CommercialInformation
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            disabled={!canEdit}
          />

          <ProjectTimeline
            register={register}
            watch={watch}
            setValue={setValue}
            disabled={!canEdit}
          />

          {canEdit && (
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-white hover:bg-gray-50 text-web-orange font-semibold shadow-lg border border-web-orange"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Site"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
