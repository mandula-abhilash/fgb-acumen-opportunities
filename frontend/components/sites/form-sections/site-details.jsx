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
import { fileTypes } from "@/components/sites/form-constants";

export function SiteDetails({
  register,
  setValue,
  watch,
  errors,
  opportunityTypes,
  parentId,
  onSitePlanUpload,
}) {
  const { toast } = useToast();
  const opportunityType = watch("opportunityType");
  const sitePlanImage = watch("sitePlanImage");

  const handleSitePlanUpload = (fileUrl) => {
    setValue("sitePlanImage", fileUrl);
    if (onSitePlanUpload) {
      onSitePlanUpload(fileUrl);
    }
  };

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
      setValue("sitePlanImage", "");

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
    <Card>
      <CardHeader>
        <CardTitle>Site Details</CardTitle>
        <CardDescription>
          Enter key details about the development site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sitePlanImage">Site Plan</Label>
            {sitePlanImage ? (
              renderSitePlanLink(sitePlanImage)
            ) : (
              <FileUpload
                onUploadComplete={handleSitePlanUpload}
                onUploadError={handleUploadError}
                acceptedFileTypes={[...fileTypes.image, "application/pdf"]}
                maxFileSize={10 * 1024 * 1024}
                folder="site-plans"
                fileCategory="site-plan"
                parentId={parentId}
                label="Upload Site Plan"
                description="Upload a site plan (PDF, JPEG, PNG, max 10MB)"
                fileType="mixed"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="opportunityType">
              Opportunity Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={opportunityType}
              onValueChange={(value) => setValue("opportunityType", value)}
            >
              <SelectTrigger
                className={errors.opportunityType ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select opportunity type" />
              </SelectTrigger>
              <SelectContent>
                {opportunityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.label}>
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
              onKeyDown={(e) => {
                if (
                  !/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Tab/.test(
                    e.key
                  )
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^[0-9]+$/.test(value)) {
                  setValue("plots", value === "" ? "" : parseInt(value, 10));
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 1) {
                  e.target.value = "1";
                  setValue("plots", 1);
                } else {
                  e.target.value = Math.floor(value).toString();
                  setValue("plots", Math.floor(value));
                }
              }}
              {...register("plots", {
                valueAsNumber: true,
                validate: (value) =>
                  value >= 1 || "Number of plots must be at least 1",
              })}
              className={errors.plots ? "border-destructive" : ""}
            />
            {errors.plots && (
              <p className="text-sm text-destructive">{errors.plots.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
