"use client";

import { useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

export function ResponseSection({ register, setValue, watch, errors }) {
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
              <label className="text-sm font-medium">
                Date for Initial Expression of Interest
              </label>
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={initialEOIDate}
                    onSelect={(date) => setValue("initialEOIDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Right column of Response Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Date for Bids to be Submitted
              </label>
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bidSubmissionDate}
                    onSelect={(date) => setValue("bidSubmissionDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Additional Information
            </label>
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
