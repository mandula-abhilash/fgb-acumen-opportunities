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
import { fileTypes } from "@/components/sites/form-constants";

export function SitePlanUpload({ handleSitePlanUpload }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Plan</CardTitle>
        <CardDescription>
          Upload a site plan to provide visual context for your site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="sitePlanImage">Upload Site Plan</Label>
          <FileUpload
            onUploadComplete={handleSitePlanUpload}
            acceptedFileTypes={[...fileTypes.image, "application/pdf"]}
            maxFileSize={10 * 1024 * 1024} // 10MB
            folder="site-plans"
            label="Upload Site Plan"
            description="Upload a site plan (PDF, JPEG, PNG, max 10MB)"
            fileType="mixed"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Providing a site plan helps potential buyers better understand the
            layout and context of your site.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
