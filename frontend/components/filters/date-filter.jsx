"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Pencil, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DateFilter({ item, value, onChange }) {
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [lastSavedValue, setLastSavedValue] = useState(null);

  const validateDate = (date) => {
    if (!date) return true;
    const selectedDate = new Date(date);
    return !isNaN(selectedDate.getTime());
  };

  const validateRange = (mode, values) => {
    const errors = {};

    if (mode === "between") {
      if (!values.startDate && !values.endDate) {
        errors.general = "Please select both start and end dates";
      } else if (!values.startDate) {
        errors.startDate = "Please select start date";
      } else if (!values.endDate) {
        errors.endDate = "Please select end date";
      } else if (new Date(values.startDate) >= new Date(values.endDate)) {
        errors.general = "Start date must be before end date";
      }
    } else if (mode === "before" && !values.single) {
      errors.single = "Please select a date";
    } else if (mode === "after" && !values.single) {
      errors.single = "Please select a date";
    }

    return errors;
  };

  const handleChange = (subKey, newValue) => {
    let updatedValue;

    if (subKey === "mode") {
      updatedValue = { mode: newValue };
      setErrors({});
    } else {
      updatedValue = { ...localValue, [subKey]: newValue };

      if (newValue && !validateDate(newValue)) {
        setErrors((prev) => ({
          ...prev,
          [subKey]: "Please select a valid date",
        }));
        return;
      }

      const rangeErrors = validateRange(updatedValue.mode, updatedValue);
      setErrors(rangeErrors);
    }

    setLocalValue(updatedValue);
  };

  const isValidFilter = (filter) => {
    if (!filter || !filter.mode) return false;

    const { mode, startDate, endDate, single } = filter;
    if (mode === "between") {
      return startDate && endDate && new Date(startDate) < new Date(endDate);
    }
    if (mode === "before" || mode === "after") {
      return single && single.toString().length > 0;
    }
    return false;
  };

  const clearFilter = () => {
    onChange(undefined);
    setLocalValue(undefined);
    setErrors({});
    setIsEditing(false);
    setLastSavedValue(null);
  };

  const getFilterSummary = (filterValue) => {
    if (!filterValue) return null;

    const { mode, startDate, endDate, single } = filterValue;
    if (!mode) return null;

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };

    switch (mode) {
      case "between":
        if (startDate && endDate && !errors.general) {
          return `Between ${formatDate(startDate)} and ${formatDate(endDate)}`;
        }
        break;
      case "before":
        if (single && !errors.single) {
          return `Before ${formatDate(single)}`;
        }
        break;
      case "after":
        if (single && !errors.single) {
          return `After ${formatDate(single)}`;
        }
        break;
    }
    return null;
  };

  const handleApplyFilter = () => {
    if (isValidFilter(localValue)) {
      onChange(localValue);
      setLastSavedValue(localValue);
      setIsEditing(false);
    }
  };

  const summary = getFilterSummary(value);
  const mode = localValue?.mode || value?.mode;

  if (value && !isEditing) {
    return (
      <div className="flex items-center gap-2 bg-secondary rounded-md p-2">
        <span className="flex-1 text-sm">{summary}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => {
            setLocalValue(value);
            setIsEditing(true);
          }}
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
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue
              placeholder={
                <span className="text-muted-foreground">
                  Select filter type
                </span>
              }
            />
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-9",
                    !localValue?.startDate && "text-muted-foreground",
                    errors.startDate && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localValue?.startDate ? (
                    new Date(localValue.startDate).toLocaleDateString()
                  ) : (
                    <span>Select start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    localValue?.startDate
                      ? new Date(localValue.startDate)
                      : undefined
                  }
                  onSelect={(date) => handleChange("startDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-xs text-destructive mt-1">
                {errors.startDate}
              </p>
            )}
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-9",
                    !localValue?.endDate && "text-muted-foreground",
                    errors.endDate && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localValue?.endDate ? (
                    new Date(localValue.endDate).toLocaleDateString()
                  ) : (
                    <span>Select end date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    localValue?.endDate
                      ? new Date(localValue.endDate)
                      : undefined
                  }
                  onSelect={(date) => handleChange("endDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && (
              <p className="text-xs text-destructive mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>
      )}

      {(mode === "before" || mode === "after") && (
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-9",
                  !localValue?.single && "text-muted-foreground",
                  errors.single && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localValue?.single ? (
                  new Date(localValue.single).toLocaleDateString()
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  localValue?.single ? new Date(localValue.single) : undefined
                }
                onSelect={(date) => handleChange("single", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
            className="w-full text-sm h-9"
            onClick={handleApplyFilter}
            disabled={!isValidFilter(localValue)}
          >
            Apply Filter
          </Button>
        </div>
      )}
    </div>
  );
}
