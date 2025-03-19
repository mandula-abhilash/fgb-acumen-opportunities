"use client";

import { Store } from "lucide-react";

import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

const landPurchaseStatuses = [
  { value: "land-offer", label: "Land Offer Stage" },
  { value: "preferred-buyer", label: "Preferred Buyer" },
  { value: "heads-of-terms", label: "Heads of Terms Agreed" },
  { value: "contracts-exchanged", label: "Contracts Exchanged" },
  { value: "purchase-completed", label: "Purchase Completed" },
];

export function LandPurchaseFilter({ value, onChange }) {
  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <Store className="h-4 w-4" />
        <Label className="text-sm font-medium flex-1">
          Land Purchase Status
        </Label>
      </div>
      <MultiSelect
        options={landPurchaseStatuses}
        selected={value || []}
        onChange={onChange}
        placeholder="Select purchase status..."
      />
    </div>
  );
}
