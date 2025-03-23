"use client";

import { ExternalLink, Trash2 } from "lucide-react";

import { deleteFileFromS3 } from "@/lib/upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { fileTypes, opportunityTypes } from "@/components/sites/form-constants";

export function BasicInformation({
  register,
  errors,
  selectedAddress,
  handleSitePlanUpload,
}) {
  const { toast } = useToast();

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: "Failed to upload file. Please try again.",
    });
  };

  const handleDeleteFile = async (fileUrl) => {
    try {
      const urlParts = fileUrl.split("/");
      const key = urlParts.slice(3).join("/");

      await deleteFileFromS3(key);
      handleSitePlanUpload("");

      toast({
        title: "Success",
        description: "Site plan deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete site plan. Please try again.",
      });
    }
  };

  const renderSitePlanLink = (url) => {
    if (!url) return null;
    return (
      <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="h-4 w-4" />
          View Site Plan
        </a>
        <button
          type="button"
          onClick={() => handleDeleteFile(url)}
          className="text-destructive hover:text-destructive/80 p-1 rounded-sm"
          title="Delete site plan"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Enter the essential details about your site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteAddress">
              Site Address (From Map){" "}
              <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              Search for the address on the map and adjust the marker pin by
              dragging to set the exact location
            </p>
            <Input
              id="siteAddress"
              {...register("siteAddress")}
              className={errors.siteAddress ? "border-destructive" : ""}
              disabled
              value={selectedAddress || ""}
            />
            {errors.siteAddress && (
              <p className="text-sm text-destructive">
                {errors.siteAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customSiteAddress">
              Custom Site Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customSiteAddress"
              {...register("customSiteAddress")}
              className={errors.customSiteAddress ? "border-destructive" : ""}
              placeholder="Modify address if needed"
            />
            {errors.customSiteAddress && (
              <p className="text-sm text-destructive">
                {errors.customSiteAddress.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              You can modify this address if you need to add additional details
              or make corrections
            </p>
          </div>

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
            <Label htmlFor="sitePlanImage">Site Plan</Label>
            <FileUpload
              onUploadComplete={handleSitePlanUpload}
              onUploadError={handleUploadError}
              acceptedFileTypes={[...fileTypes.image, "application/pdf"]}
              maxFileSize={10 * 1024 * 1024}
              folder="site-plans"
              fileCategory="site-plan"
              label="Upload Site Plan"
              description="Upload a site plan (PDF, JPEG, PNG, max 10MB)"
              fileType="mixed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="opportunityType">
              Opportunity Type <span className="text-destructive">*</span>
            </Label>
            <Select {...register("opportunityType")}>
              <SelectTrigger
                className={errors.opportunityType ? "border-destructive" : ""}
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
            <Label htmlFor="plots">
              Number of Plots <span className="text-destructive">*</span>
            </Label>
            <Input
              id="plots"
              type="number"
              min="1"
              step="1"
              {...register("plots", { valueAsNumber: true })}
              className={errors.plots ? "border-destructive" : ""}
            />
            {errors.plots && (
              <p className="text-sm text-destructive">{errors.plots.message}</p>
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
        </div>
      </CardContent>
    </Card>
  );
}
