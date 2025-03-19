"use client";

import { ScrollText } from "lucide-react";

import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

const planningStatuses = [
  { value: "allocated", label: "Allocated" },
  { value: "draft-allocation", label: "Draft Allocation" },
  { value: "outline-submission", label: "Outline Submission" },
  { value: "outline-approval", label: "Outline Approval" },
  { value: "full-submission", label: "Full Submission" },
  { value: "full-approval", label: "Full Approval" },
  { value: "detailed-submission", label: "Detailed Submission" },
  { value: "detailed-approval", label: "Detailed Approval" },
  { value: "appeal-lodged", label: "Appeal Lodged" },
  { value: "appeal-allowed", label: "Appeal Allowed" },
];

export function PlanningStatusFilter({ value, onChange }) {
  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <ScrollText className="h-4 w-4" />
        <Label className="text-sm font-medium flex-1">Planning Status</Label>
      </div>
      <MultiSelect
        options={planningStatuses}
        selected={value || []}
        onChange={onChange}
        placeholder="Select planning status..."
      />
    </div>
  );
}
