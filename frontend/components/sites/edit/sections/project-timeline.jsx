"use client";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

export function ProjectTimeline({ register, watch, setValue, disabled }) {
  const renderDatePicker = (fieldName, label) => {
    const selectedDate = watch(fieldName);

    const handleClear = (e) => {
      e.stopPropagation(); // Prevent popover from opening
      setValue(fieldName, null);
    };

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="flex-1">
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </span>
              {selectedDate && !disabled && (
                <X
                  className="h-4 w-4 opacity-50 hover:opacity-100"
                  onClick={handleClear}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setValue(fieldName, date)}
              initialFocus
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>
          Set key project dates and programme details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Planning Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderDatePicker(
            "planningSubmissionDate",
            "Planning Submission Date"
          )}
          {renderDatePicker("startOnSiteDate", "Start on Site Date")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderDatePicker(
            "planningDeterminationDate",
            "Planning Determination Date"
          )}
          {renderDatePicker("firstGoldenBrickDate", "First Golden Brick Date")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderDatePicker("finalGoldenBrickDate", "Final Golden Brick Date")}
          {renderDatePicker("firstHandoverDate", "First Handover Date")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderDatePicker("finalHandoverDate", "Final Handover Date")}
          <div className="hidden md:block">
            {/* Empty space for alignment */}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectProgramme">Project Programme</Label>
          <Textarea
            id="projectProgramme"
            {...register("projectProgramme")}
            placeholder="Describe the project programme and key milestones..."
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
