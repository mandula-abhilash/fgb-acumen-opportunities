"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createAssistedSite } from "@/lib/api/assistedSites";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { opportunityTypes } from "@/components/sites/form-constants";

import { assistedSiteSchema } from "./schema";
import { BasicInformation } from "./sections/basic-information";
import { ContactInformation } from "./sections/contact-information";
import { HowItWorks } from "./sections/how-it-works";
import { PaymentInformation } from "./sections/payment-information";
import { ResponseSection } from "./sections/response-section";
import { SiteDetails } from "./sections/site-details";
import { SiteLocation } from "./sections/site-location";

export function AssistedSiteForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [polygonPath, setPolygonPath] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [opportunityId] = useState(() => crypto.randomUUID());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assistedSiteSchema),
    defaultValues: {
      siteName: "",
      siteAddress: "",
      customSiteAddress: "",
      opportunityType: "",
      developerName: "",
      plots: "",
      contactEmail: "",
      contactPhone: "",
      additionalInfo: "",
      sitePlanImage: "",
      sitePlanDocument: "",
      manageBidsProcess: false,
    },
  });

  const manageBidsProcess = watch("manageBidsProcess");

  const handleLocationSelect = (location, address) => {
    setSelectedLocation(location);
    setSelectedAddress(address);
    if (address && !watch("siteAddress")) {
      setValue("siteAddress", address);
      setValue("customSiteAddress", address);
    }
  };

  const handlePolygonComplete = (path) => {
    setPolygonPath(path);
  };

  const handleSitePlanUpload = (fileUrl) => {
    setValue("sitePlanImage", fileUrl);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      if (!selectedLocation) {
        toast({
          variant: "destructive",
          title: "Location Required",
          description: "Please select a site location using the map.",
        });
        setIsSubmitting(false);
        return;
      }

      const siteData = {
        ...data,
        coordinates: selectedLocation,
        boundary:
          polygonPath.length > 0
            ? {
                type: "Polygon",
                coordinates: [
                  [
                    ...polygonPath.map((point) => [point.lng, point.lat]),
                    [polygonPath[0].lng, polygonPath[0].lat], // Close the polygon
                  ],
                ],
              }
            : null,
      };

      await createAssistedSite(siteData);

      toast({
        title: "Request Submitted",
        description:
          "Your assisted submission request has been received. We'll contact you shortly.",
      });

      router.push("/dashboard/opportunities");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description:
          "There was an error processing your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 py-4 bg-background/95 backdrop-blur-md dark:bg-background/80"
    >
      <div className="flex flex-col space-y-6 mx-auto">
        <HowItWorks />

        {/* Map and Basic Information Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 min-h-[400px]">
          {/* Basic Information - Takes 1 column on desktop */}
          <div className="order-1 lg:order-1 h-[400px] lg:h-full">
            <BasicInformation
              register={register}
              errors={errors}
              selectedAddress={selectedAddress}
              setValue={setValue}
              watch={watch}
            />
          </div>

          {/* Map - Takes 2 columns on desktop */}
          <div className="order-2 lg:order-2 lg:col-span-2 h-[400px] lg:h-full">
            <SiteLocation
              onLocationSelect={handleLocationSelect}
              onPolygonComplete={handlePolygonComplete}
              selectedLocation={selectedLocation}
              polygonPath={polygonPath}
            />
          </div>
        </div>

        {/* Site Details Section */}
        <SiteDetails
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          opportunityTypes={opportunityTypes}
          parentId={opportunityId}
          onSitePlanUpload={handleSitePlanUpload}
        />

        {/* Response Section */}
        <ResponseSection
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />

        {/* Contact Information and Payment Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ContactInformation
            register={register}
            errors={errors}
            setValue={setValue}
          />

          <PaymentInformation
            manageBidsProcess={manageBidsProcess}
            isSubmitting={isSubmitting}
            setValue={setValue}
          />
        </div>
      </div>
    </form>
  );
}
