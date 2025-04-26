"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { createAssistedSite } from "@/lib/api/assistedSites";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting: isFormSubmitting },
    clearErrors,
    trigger,
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
    mode: "onChange",
  });

  const manageBidsProcess = watch("manageBidsProcess");

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

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && errors[name]) {
        trigger(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, errors, trigger]);

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
        boundary:
          polygonPath.length > 0
            ? {
                type: "Polygon",
                coordinates: [
                  [
                    ...polygonPath.map((point) => [point.lng, point.lat]),
                    [polygonPath[0].lng, polygonPath[0].lat],
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

        <HowItWorks />

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 min-h-[400px]">
          <div className="order-1 lg:order-1 h-[400px] lg:h-full">
            <BasicInformation
              register={register}
              errors={errors}
              selectedAddress={selectedAddress}
              setValue={setValue}
              watch={watch}
            />
          </div>

          <div
            className="order-2 lg:order-2 lg:col-span-2 h-[400px] lg:h-full"
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

        <ResponseSection
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ContactInformation
            register={register}
            errors={errors}
            setValue={setValue}
          />

          <PaymentInformation
            manageBidsProcess={manageBidsProcess}
            isSubmitting={isSubmitting || isFormSubmitting}
            setValue={setValue}
          />
        </div>

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
