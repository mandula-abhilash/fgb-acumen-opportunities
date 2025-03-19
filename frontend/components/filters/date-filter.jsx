"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Pencil, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
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

const modes = [
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
  { value: "between", label: "Between" },
];

export function DateFilter({ icon: Icon, label, value, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || {});

  const handleChange = (subKey, newValue) => {
    let updatedValue;

    if (subKey === "mode") {
      updatedValue = { mode: newValue };
    } else {
      updatedValue = { ...localValue, [subKey]: newValue };
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
      return single;
    }
    return false;
  };

  const clearFilter = () => {
    onChange(undefined);
    setLocalValue({});
    setIsEditing(false);
  };

  const getFilterSummary = (filterValue) => {
    if (!filterValue || !filterValue.mode) return null;

    const { mode, startDate, endDate, single } = filterValue;
    const formatDate = (date) => format(new Date(date), "dd MMM yyyy");

    switch (mode) {
      case "between":
        if (startDate && endDate) {
          return `Between ${formatDate(startDate)} and ${formatDate(endDate)}`;
        }
        break;
      case "before":
        if (single) {
          return `Before ${formatDate(single)}`;
        }
        break;
      case "after":
        if (single) {
          return `After ${formatDate(single)}`;
        }
        break;
    }
    return null;
  };

  const handleApplyFilter = () => {
    if (isValidFilter(localValue)) {
      onChange(localValue);
      setIsEditing(false);
    }
  };

  const summary = getFilterSummary(value);
  const mode = localValue?.mode || "";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        <Label className="text-sm font-medium flex-1">{label}</Label>
      </div>

      {value && Object.keys(value).length > 0 && !isEditing ? (
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
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Select
              value={mode}
              onValueChange={(value) => handleChange("mode", value)}
            >
              <SelectTrigger className="w-full h-9 text-sm">
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-9",
                      !localValue?.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localValue?.startDate ? (
                      format(new Date(localValue.startDate), "PPP")
                    ) : (
                      <span>Start date</span>
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-9",
                      !localValue?.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localValue?.endDate ? (
                      format(new Date(localValue.endDate), "PPP")
                    ) : (
                      <span>End date</span>
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
            </div>
          )}

          {(mode === "before" || mode === "after") && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-9",
                    !localValue?.single && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localValue?.single ? (
                    format(new Date(localValue.single), "PPP")
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
      )}
    </div>
  );
}
