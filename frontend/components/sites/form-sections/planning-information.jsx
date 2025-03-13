"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fileTypes, maxFileSizes } from "@/components/sites/form-constants";

export function PlanningInformation({
  register,
  setValue,
  watch,
  errors,
  planningStatuses,
  landPurchaseStatuses,
  parentId,
  onSpecificationUpload,
  onS106Upload,
  disabled,
}) {
  const currentPlanningStatus = watch("planningStatus");
  const currentLandPurchaseStatus = watch("landPurchaseStatus");

  const handleProposedSpecUpload = (fileUrl) => {
    setValue("proposedSpecification", fileUrl);
    if (onSpecificationUpload) {
      onSpecificationUpload(fileUrl);
    }
  };

  const handleS106Upload = (fileUrl) => {
    setValue("s106Agreement", fileUrl);
    if (onS106Upload) {
      onS106Upload(fileUrl);
    }
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
  };

  const handlePlanningStatusChange = (value) => {
    setValue("planningStatus", value);
  };

  const handleLandPurchaseStatusChange = (value) => {
    setValue("landPurchaseStatus", value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planning Information</CardTitle>
        <CardDescription>
          Enter details about planning status and approvals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="planningStatus">
              Planning Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={currentPlanningStatus}
              onValueChange={handlePlanningStatusChange}
              disabled={disabled}
            >
              <SelectTrigger
                className={errors.planningStatus ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select planning status" />
              </SelectTrigger>
              <SelectContent>
                {planningStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.planningStatus && (
              <p className="text-sm text-destructive">
                {errors.planningStatus.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="landPurchaseStatus">
              Land Purchase Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={currentLandPurchaseStatus}
              onValueChange={handleLandPurchaseStatusChange}
              disabled={disabled}
            >
              <SelectTrigger
                className={
                  errors.landPurchaseStatus ? "border-destructive" : ""
                }
              >
                <SelectValue placeholder="Select land purchase status" />
              </SelectTrigger>
              <SelectContent>
                {landPurchaseStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.landPurchaseStatus && (
              <p className="text-sm text-destructive">
                {errors.landPurchaseStatus.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="planningOverview">Planning Overview</Label>
          <Textarea
            id="planningOverview"
            {...register("planningOverview")}
            placeholder="Provide an overview of the planning situation..."
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposedDevelopment">Proposed Development</Label>
          <Textarea
            id="proposedDevelopment"
            {...register("proposedDevelopment")}
            placeholder="Describe the proposed development..."
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposedSpecification">Proposed Specification</Label>
          <FileUpload
            onUploadComplete={handleProposedSpecUpload}
            onUploadError={handleUploadError}
            acceptedFileTypes={fileTypes.document}
            maxFileSize={maxFileSizes.document}
            folder="specifications"
            fileCategory="proposed-specification"
            parentId={parentId}
            label="Upload Proposed Specification"
            description="Upload a PDF or Word document (max 10MB)"
            fileType="document"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="s106Agreement">Section 106 Agreement</Label>
          <FileUpload
            onUploadComplete={handleS106Upload}
            onUploadError={handleUploadError}
            acceptedFileTypes={fileTypes.document}
            maxFileSize={maxFileSizes.document}
            folder="s106-agreements"
            fileCategory="s106-agreement"
            parentId={parentId}
            label="Upload Section 106 Agreement"
            description="Upload a PDF or Word document (max 10MB)"
            fileType="document"
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
