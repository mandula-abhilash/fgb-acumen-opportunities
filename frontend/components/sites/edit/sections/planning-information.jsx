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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  fileTypes,
  landPurchaseStatuses,
  maxFileSizes,
  planningStatuses,
} from "@/components/sites/form-constants";

export function PlanningInformation({
  register,
  setValue,
  watch,
  errors,
  parentId,
  onSpecificationUpload,
  onS106Upload,
}) {
  const { toast } = useToast();
  const planningStatus = watch("planningStatus");
  const landPurchaseStatus = watch("landPurchaseStatus");
  const proposedSpecification = watch("proposedSpecification");
  const s106Agreement = watch("s106Agreement");

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
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: "Failed to upload file. Please try again.",
    });
  };

  const handleDeleteFile = async (fileUrl, fieldName) => {
    try {
      const urlParts = fileUrl.split("/");
      const key = urlParts.slice(3).join("/");

      await deleteFileFromS3(key);
      setValue(fieldName, "");

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file. Please try again.",
      });
    }
  };

  const renderDocumentLink = (url, label, fieldName) => {
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
          {label}
        </a>
        <button
          type="button"
          onClick={() => handleDeleteFile(url, fieldName)}
          className="text-destructive hover:text-destructive/80 p-1 rounded-sm"
          title="Delete file"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planning Information</CardTitle>
        <CardDescription>
          Update details about planning status and approvals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="planningStatus">
              Planning Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={planningStatus}
              onValueChange={(value) => setValue("planningStatus", value)}
            >
              <SelectTrigger
                className={errors.planningStatus ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select planning status" />
              </SelectTrigger>
              <SelectContent>
                {planningStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.label}>
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
              value={landPurchaseStatus}
              onValueChange={(value) => setValue("landPurchaseStatus", value)}
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
                  <SelectItem key={status.value} value={status.label}>
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposedDevelopment">Proposed Development</Label>
          <Textarea
            id="proposedDevelopment"
            {...register("proposedDevelopment")}
            placeholder="Describe the proposed development..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposedSpecification">Proposed Specification</Label>
          {proposedSpecification ? (
            renderDocumentLink(
              proposedSpecification,
              "View Proposed Specification",
              "proposedSpecification"
            )
          ) : (
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
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="s106Agreement">Section 106 Agreement</Label>
          {s106Agreement ? (
            renderDocumentLink(
              s106Agreement,
              "View Section 106 Agreement",
              "s106Agreement"
            )
          ) : (
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
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
