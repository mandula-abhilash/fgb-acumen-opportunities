"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft, Calendar, FileText, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/page-header";
import { SiteMap } from "@/components/site-map";
import { fileTypes, opportunityTypes } from "@/components/sites/form-constants";

const assistedSubmissionSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  opportunityType: z.string().min(1, "Opportunity type is required"),
  developerName: z.string().min(1, "Developer name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().optional(),
  additionalInfo: z.string().optional(),
  initialEOIDate: z.date().optional(),
  bidSubmissionDate: z.date().optional(),
  manageBidsProcess: z.boolean().optional(),
  queriesContactName: z.string().optional(),
  queriesContactEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional(),
  queriesContactPhone: z.string().optional(),
  sitePlanImage: z.string().optional(),
});

export default function AssistedSubmissionPage() {
  const { user, loading } = useAuth();
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
      developerName: user?.name || "",
      contactEmail: user?.email || "",
      contactPhone: "",
      additionalInfo: "",
      manageBidsProcess: false,
      queriesContactName: "",
      queriesContactEmail: "",
      queriesContactPhone: "",
      sitePlanImage: "",
    },
  });

  const initialEOIDate = watch("initialEOIDate");
  const bidSubmissionDate = watch("bidSubmissionDate");
  const manageBidsProcess = watch("manageBidsProcess");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

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

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <PageHeader title="FGB Assisted Site Submission">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/opportunities")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </PageHeader>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assisted Submission Service</CardTitle>
            <CardDescription>
              Provide the essential information below and our team will prepare
              a comprehensive site listing for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="font-semibold text-blue-700 mb-2">How it works</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-blue-700">
                <li>Complete this simplified form with basic site details</li>
                <li>Pay the £250 service fee</li>
                <li>
                  Our team will contact you to gather any additional information
                </li>
                <li>
                  We'll prepare and publish your site listing within 2-3
                  business days
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* First row: Basic Info and Map side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the essential details about your site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">
                    Site Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="siteName"
                    {...register("siteName")}
                    className={errors.siteName ? "border-destructive" : ""}
                  />
                  {errors.siteName && (
                    <p className="text-sm text-destructive">
                      {errors.siteName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteAddress">
                    Site Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="siteAddress"
                    {...register("siteAddress")}
                    className={errors.siteAddress ? "border-destructive" : ""}
                  />
                  {errors.siteAddress && (
                    <p className="text-sm text-destructive">
                      {errors.siteAddress.message}
                    </p>
                  )}
                  {selectedAddress && (
                    <div className="mt-2 p-3 rounded-md border bg-muted/50">
                      <p className="text-sm break-words">{selectedAddress}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="opportunityType">
                    Opportunity Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("opportunityType", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        errors.opportunityType ? "border-destructive" : ""
                      }
                    >
                      <SelectValue placeholder="Select opportunity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {opportunityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.opportunityType && (
                    <p className="text-sm text-destructive">
                      {errors.opportunityType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developerName">
                    Developer Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="developerName"
                    {...register("developerName")}
                    className={errors.developerName ? "border-destructive" : ""}
                  />
                  {errors.developerName && (
                    <p className="text-sm text-destructive">
                      {errors.developerName.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="h-[500px]">
              <CardContent className="p-0 h-full">
                <SiteMap
                  onLocationSelect={handleLocationSelect}
                  onPolygonComplete={handlePolygonComplete}
                  selectedLocation={selectedLocation}
                  polygonPath={polygonPath}
                  placeholder="Search for and mark the site location on the map"
                />
              </CardContent>
            </Card>
          </div>

          {/* Second row: Response Section on left, Contact Info and Payment on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Response Section */}
            <Card>
              <CardHeader>
                <CardTitle>Response Section</CardTitle>
                <CardDescription>
                  Provide details about the bidding process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="initialEOIDate">
                    Date for Initial Expression of Interest
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !initialEOIDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {initialEOIDate ? (
                          format(initialEOIDate, "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={initialEOIDate}
                        onSelect={(date) => setValue("initialEOIDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bidSubmissionDate">
                    Date for Bids to be Submitted
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !bidSubmissionDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {bidSubmissionDate ? (
                          format(bidSubmissionDate, "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={bidSubmissionDate}
                        onSelect={(date) => setValue("bidSubmissionDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="manageBidsProcess"
                      checked={manageBidsProcess}
                      onCheckedChange={(checked) => {
                        setValue("manageBidsProcess", checked);
                      }}
                    />
                    <Label
                      htmlFor="manageBidsProcess"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      FG+B to manage the bids process (chasing, queries, tender
                      summary)
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    This option will incur an additional fee payable by the
                    buyer
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="queriesContactName">
                    Who should queries be sent to?
                  </Label>
                  <Input
                    id="queriesContactName"
                    placeholder="Contact name"
                    {...register("queriesContactName")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="queriesContactEmail">
                      Contact Email for Queries
                    </Label>
                    <Input
                      id="queriesContactEmail"
                      type="email"
                      placeholder="Email address"
                      {...register("queriesContactEmail")}
                      className={
                        errors.queriesContactEmail ? "border-destructive" : ""
                      }
                    />
                    {errors.queriesContactEmail && (
                      <p className="text-sm text-destructive">
                        {errors.queriesContactEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="queriesContactPhone">
                      Contact Phone for Queries
                    </Label>
                    <Input
                      id="queriesContactPhone"
                      placeholder="Phone number"
                      {...register("queriesContactPhone")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    {...register("additionalInfo")}
                    placeholder="Any additional information you'd like to provide..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sitePlanImage">Site Plan</Label>
                  <FileUpload
                    onUploadComplete={handleSitePlanUpload}
                    acceptedFileTypes={[...fileTypes.image, "application/pdf"]}
                    maxFileSize={10 * 1024 * 1024} // 10MB
                    folder="site-plans"
                    label="Upload Site Plan"
                    description="Upload a site plan (PDF, JPEG, PNG, max 10MB)"
                    fileType="mixed"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information and Payment Information */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    How should we reach you for additional details?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...register("contactEmail")}
                      className={
                        errors.contactEmail ? "border-destructive" : ""
                      }
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-destructive">
                        {errors.contactEmail.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input id="contactPhone" {...register("contactPhone")} />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>
                    Service fee for FGB assisted submission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">
                        Assisted Submission Service
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Professional preparation of your site listing
                      </p>
                    </div>
                    <div className="text-xl font-bold">£250.00</div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      className="bg-web-orange hover:bg-web-orange/90 text-white font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Pay & Submit"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
