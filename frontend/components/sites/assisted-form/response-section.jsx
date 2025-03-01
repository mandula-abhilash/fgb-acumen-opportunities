"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { fileTypes } from "@/components/sites/form-constants";

export function ResponseSection({
  register,
  setValue,
  watch,
  errors,
  validatePhoneInput,
  handleSitePlanUpload,
}) {
  const initialEOIDate = watch("initialEOIDate");
  const bidSubmissionDate = watch("bidSubmissionDate");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Section</CardTitle>
        <CardDescription>
          Provide details about the bidding process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column of Response Section */}
          <div className="space-y-6">
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {initialEOIDate ? (
                      format(initialEOIDate, "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={initialEOIDate}
                    onSelect={(date) => setValue("initialEOIDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="queriesContactName">
                Who should queries be sent to?
              </Label>
              <Input
                id="queriesContactName"
                placeholder="Contact name"
                {...register("queriesContactName")}
                className={
                  errors.queriesContactName ? "border-destructive" : ""
                }
              />
              {errors.queriesContactName && (
                <p className="text-sm text-destructive">
                  {errors.queriesContactName.message}
                </p>
              )}
            </div>
          </div>

          {/* Right column of Response Section */}
          <div className="space-y-6">
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bidSubmissionDate ? (
                      format(bidSubmissionDate, "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bidSubmissionDate}
                    onSelect={(date) => setValue("bidSubmissionDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                  className={
                    errors.queriesContactPhone ? "border-destructive" : ""
                  }
                  onKeyPress={validatePhoneInput}
                />
                {errors.queriesContactPhone && (
                  <p className="text-sm text-destructive">
                    {errors.queriesContactPhone.message}
                  </p>
                )}
              </div>
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
          </div>
        </div>

        <div className="mt-6">
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              {...register("additionalInfo")}
              placeholder="Any additional information you'd like to provide..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
