"use client";

import { Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProjectTimeline({ register, watch, setValue, disabled }) {
  const renderDatePicker = (fieldName, label) => {
    const selectedDate = watch(fieldName);

    const handleDateChange = (date) => {
      setValue(fieldName, date);
    };

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          disabled={disabled}
        />
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
          {renderDatePicker("startOnSiteDate", "Start on Site Date")}
          <div className="hidden md:block">
            {/* Empty space for alignment */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderDatePicker(
            "planningSubmissionDate",
            "Planning Submission Date"
          )}
          {renderDatePicker(
            "planningDeterminationDate",
            "Planning Determination Date"
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderDatePicker("firstGoldenBrickDate", "First Golden Brick Date")}
          {renderDatePicker("finalGoldenBrickDate", "Final Golden Brick Date")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderDatePicker("firstHandoverDate", "First Handover Date")}
          {renderDatePicker("finalHandoverDate", "Final Handover Date")}
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
