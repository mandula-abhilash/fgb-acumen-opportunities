"use client";

import { useState } from "react";
import { Building2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  const [localValue, setLocalValue] = useState(value);
  const [isDirty, setIsDirty] = useState(false);

  const handleModeChange = (mode) => {
    setLocalValue({ mode, min: "", max: "", single: "" });
    setIsDirty(true);
  };

  const handleValueChange = (field, newValue) => {
    setLocalValue((prev) => ({
      ...prev,
      [field]: newValue,
    }));
    setIsDirty(true);
  };

  const handleApplyFilter = () => {
    // Validate and transform values
    const filterValue = {
      ...localValue,
      min: localValue.min ? parseInt(localValue.min) : undefined,
      max: localValue.max ? parseInt(localValue.max) : undefined,
      single: localValue.single ? parseInt(localValue.single) : undefined,
    };

    onChange(filterValue);
    setIsDirty(false);
  };

  const handleClearFilter = () => {
    setLocalValue({});
    setIsDirty(false);
    onChange({});
  };

  const isValid = () => {
    if (!localValue.mode) return false;

    if (localValue.mode === "between") {
      return (
        localValue.min &&
        localValue.max &&
        parseInt(localValue.min) <= parseInt(localValue.max)
      );
    }

    if (localValue.mode === "more-than" || localValue.mode === "less-than") {
      return !!localValue.single;
    }

    return false;
  };

  const isFilterActive = () => {
    return (
      value &&
      value.mode &&
      ((value.mode === "between" && value.min && value.max) ||
        (["more-than", "less-than"].includes(value.mode) && value.single))
    );
  };

  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Building2 className="h-4 w-4" />
          <Label className="text-sm font-medium">Number of Plots</Label>
          {isFilterActive() && (
            <div className="h-2 w-2 rounded-full bg-havelock-blue" />
          )}
        </div>
        {isFilterActive() && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={handleClearFilter}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear filter</span>
          </Button>
        )}
      </div>

      <Select value={localValue.mode} onValueChange={handleModeChange}>
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

      {localValue.mode === "between" && (
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Minimum plots"
            value={localValue.min || ""}
            onChange={(e) => handleValueChange("min", e.target.value)}
            min="0"
          />
          <Input
            type="number"
            placeholder="Maximum plots"
            value={localValue.max || ""}
            onChange={(e) => handleValueChange("max", e.target.value)}
            min="0"
          />
        </div>
      )}

      {(localValue.mode === "more-than" || localValue.mode === "less-than") && (
        <Input
          type="number"
          placeholder={`${localValue.mode === "more-than" ? "Minimum" : "Maximum"} plots`}
          value={localValue.single || ""}
          onChange={(e) => handleValueChange("single", e.target.value)}
          min="0"
        />
      )}

      {localValue.mode && (
        <Button
          onClick={handleApplyFilter}
          disabled={!isValid() || !isDirty}
          className="w-full mt-2 bg-web-orange hover:bg-web-orange/90 text-white"
        >
          Apply Filter
        </Button>
      )}
    </div>
  );
}
