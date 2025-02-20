"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PlotsFilter({ item, value, onChange }) {
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const validateNumber = (value) => {
    if (value === "") return true;
    const num = Number(value);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
  };

  const validateRange = (mode, values) => {
    const errors = {};

    if (mode === "between") {
      if (!values.min && !values.max) {
        errors.general = "Please enter both minimum and maximum values";
      } else if (!values.min) {
        errors.min = "Please enter minimum value";
      } else if (!values.max) {
        errors.max = "Please enter maximum value";
      } else if (Number(values.min) >= Number(values.max)) {
        errors.general = "Minimum value must be less than maximum value";
      }
    } else if (mode === "more-than" && !values.single) {
      errors.single = "Please enter a value";
    } else if (mode === "less-than" && !values.single) {
      errors.single = "Please enter a value";
    }

    return errors;
  };

  const handleChange = (subKey, newValue) => {
    let updatedValue;

    if (subKey === "mode") {
      updatedValue = { mode: newValue };
      setErrors({});
    } else {
      updatedValue = { ...value, [subKey]: newValue };

      if (newValue !== "" && !validateNumber(newValue)) {
        setErrors((prev) => ({
          ...prev,
          [subKey]: "Please enter a valid positive whole number",
        }));
        return;
      }

      const rangeErrors = validateRange(updatedValue.mode, updatedValue);
      setErrors(rangeErrors);
    }

    onChange(updatedValue);
  };

  const isValidFilter = (filter) => {
    if (!filter || !filter.mode) return false;

    const { mode, min, max, single } = filter;
    if (mode === "between") {
      return min && max && Number(min) < Number(max);
    }
    if (mode === "more-than" || mode === "less-than") {
      return single && single.toString().length > 0;
    }
    return false;
  };

  const clearFilter = () => {
    onChange(undefined);
    setErrors({});
    setIsEditing(false);
  };

  const getFilterSummary = (filterValue) => {
    if (!filterValue) return null;

    const { mode, min, max, single } = filterValue;
    if (!mode) return null;

    switch (mode) {
      case "between":
        if (min && max && !errors.general) {
          return `Between ${min} and ${max} plots`;
        }
        break;
      case "more-than":
        if (single && !errors.single) {
          return `More than ${single} plots`;
        }
        break;
      case "less-than":
        if (single && !errors.single) {
          return `Less than ${single} plots`;
        }
        break;
    }
    return null;
  };

  const handleClose = () => {
    if (isValidFilter(value)) {
      setIsEditing(false);
    }
  };

  const summary = getFilterSummary(value);
  const isValid = isValidFilter(value);
  const mode = value?.mode;

  if (isValid && !isEditing) {
    return (
      <div className="flex items-center gap-2 bg-secondary rounded-md p-2">
        <span className="flex-1 text-sm">{summary}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3 w-3" />
          <span className="sr-only">Edit filter</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={clearFilter}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear filter</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Select
          value={mode || ""}
          onValueChange={(value) => handleChange("mode", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select filter type" />
          </SelectTrigger>
          <SelectContent>
            {item.modes.map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                {mode.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {mode && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-2"
            onClick={clearFilter}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear filter</span>
          </Button>
        )}
      </div>

      {mode === "between" && (
        <div className="space-y-2">
          <div>
            <Input
              type="number"
              min="0"
              placeholder={item.fields.min.placeholder}
              value={value?.min || ""}
              onChange={(e) => handleChange("min", e.target.value)}
              className={cn(errors.min && "border-destructive")}
            />
            {errors.min && (
              <p className="text-xs text-destructive mt-1">{errors.min}</p>
            )}
          </div>
          <div>
            <Input
              type="number"
              min="0"
              placeholder={item.fields.max.placeholder}
              value={value?.max || ""}
              onChange={(e) => handleChange("max", e.target.value)}
              className={cn(errors.max && "border-destructive")}
            />
            {errors.max && (
              <p className="text-xs text-destructive mt-1">{errors.max}</p>
            )}
          </div>
        </div>
      )}

      {(mode === "more-than" || mode === "less-than") && (
        <div>
          <Input
            type="number"
            min="0"
            placeholder={
              mode === "more-than"
                ? item.fields.single.moreThan.placeholder
                : item.fields.single.lessThan.placeholder
            }
            value={value?.single || ""}
            onChange={(e) => handleChange("single", e.target.value)}
            className={cn(errors.single && "border-destructive")}
          />
          {errors.single && (
            <p className="text-xs text-destructive mt-1">{errors.single}</p>
          )}
        </div>
      )}

      {errors.general && (
        <p className="text-xs text-destructive">{errors.general}</p>
      )}

      {mode && (
        <div className="pt-2">
          <Button
            variant="secondary"
            className="w-full text-sm"
            onClick={handleClose}
            disabled={!isValidFilter(value)}
          >
            Apply Filter
          </Button>
        </div>
      )}
    </div>
  );
}
