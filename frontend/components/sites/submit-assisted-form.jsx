"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast";
import { BasicInformation } from "@/components/sites/assisted-form/basic-information";
import { ContactInformation } from "@/components/sites/assisted-form/contact-information";
import { HowItWorks } from "@/components/sites/assisted-form/how-it-works";
import { PaymentInformation } from "@/components/sites/assisted-form/payment-information";
import { ResponseSection } from "@/components/sites/assisted-form/response-section";
import { assistedSubmissionSchema } from "@/components/sites/assisted-form/schema";
import { SiteLocationMap } from "@/components/sites/assisted-form/site-location-map";
import { SitePlanUpload } from "@/components/sites/assisted-form/site-plan-upload";

export function SubmitAssistedSiteForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [polygonPath, setPolygonPath] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assistedSubmissionSchema),
    defaultValues: {
      siteName: "",
      siteAddress: "",
      opportunityType: "",
      developerName: "",
      contactEmail: "",
      contactPhone: "",
      additionalInfo: "",
      manageBidsProcess: false,
      queriesContactName: "",
      queriesContactEmail: "",
      queriesContactPhone: "",
      sitePlanImage: "",
    },
  });

  const manageBidsProcess = watch("manageBidsProcess");

  const handleLocationSelect = (location, address) => {
    setSelectedLocation(location);
    setSelectedAddress(address);
    if (address && !watch("siteAddress")) {
      setValue("siteAddress", address);
    }
  };

  const handlePolygonComplete = (path) => {
    setPolygonPath(path);
  };

  const handleSitePlanUpload = (fileUrl) => {
    setValue("sitePlanImage", fileUrl);
  };

  // Function to validate phone number input
  const validatePhoneInput = (e) => {
    const value = e.target.value;
    // Only allow numbers, +, -, and spaces
    if (!/^[0-9+\- ]*$/.test(value)) {
      e.preventDefault();
      return false;
    }
    return true;
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

      // In a real implementation, this would process payment and submit the data
      console.log("Form data:", {
        ...data,
        coordinates: selectedLocation,
        boundary: polygonPath,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
            />
          </div>

          {/* Map - Takes 2 columns on desktop */}
          <div className="order-2 lg:order-2 lg:col-span-2 h-[400px] lg:h-full">
            <SiteLocationMap
              onLocationSelect={handleLocationSelect}
              onPolygonComplete={handlePolygonComplete}
              selectedLocation={selectedLocation}
              polygonPath={polygonPath}
            />
          </div>
        </div>

        {/* Site Plan Upload Section */}
        <SitePlanUpload handleSitePlanUpload={handleSitePlanUpload} />

        <ResponseSection
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          validatePhoneInput={validatePhoneInput}
        />

        {/* Contact Information and Payment Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ContactInformation
            register={register}
            errors={errors}
            validatePhoneInput={validatePhoneInput}
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
