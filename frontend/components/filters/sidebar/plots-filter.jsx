"use client";

import { Building2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const modes = [
  { value: "between", label: "Between" },
  { value: "more-than", label: "More than" },
  { value: "less-than", label: "Less than" },
];

export function PlotsFilter({ value = {}, onChange }) {
  const handleModeChange = (mode) => {
    onChange({ ...value, mode });
  };

  const handleValueChange = (field, newValue) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        <Label className="text-sm font-medium flex-1">Number of Plots</Label>
      </div>

      <Select value={value.mode} onValueChange={handleModeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select filter type" />
        </SelectTrigger>
        <SelectContent>
          {modes.map((mode) => (
            <SelectItem key={mode.value} value={mode.value}>
              {mode.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value.mode === "between" && (
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Minimum plots"
            value={value.min || ""}
            onChange={(e) => handleValueChange("min", e.target.value)}
            min="0"
          />
          <Input
            type="number"
            placeholder="Maximum plots"
            value={value.max || ""}
            onChange={(e) => handleValueChange("max", e.target.value)}
            min="0"
          />
        </div>
      )}

      {(value.mode === "more-than" || value.mode === "less-than") && (
        <Input
          type="number"
          placeholder={`${value.mode === "more-than" ? "Minimum" : "Maximum"} plots`}
          value={value.single || ""}
          onChange={(e) => handleValueChange("single", e.target.value)}
          min="0"
        />
      )}
    </div>
  );
}
