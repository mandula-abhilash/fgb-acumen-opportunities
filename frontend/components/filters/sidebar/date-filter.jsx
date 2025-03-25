"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

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

export function DateFilter({
  icon: Icon = CalendarIcon,
  label,
  value = {},
  onChange,
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isDirty, setIsDirty] = useState(false);

  const handleModeChange = (mode) => {
    setLocalValue({ mode, startDate: null, endDate: null, single: null });
    setIsDirty(true);
  };

  const handleDateChange = (field, date) => {
    setLocalValue((prev) => ({
      ...prev,
      [field]: date,
    }));
    setIsDirty(true);
  };

  const handleApplyFilter = () => {
    onChange(localValue);
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
        localValue.startDate &&
        localValue.endDate &&
        localValue.startDate <= localValue.endDate
      );
    }

    if (localValue.mode === "before" || localValue.mode === "after") {
      return !!localValue.single;
    }

    return false;
  };

  const isFilterActive = () => {
    return (
      value &&
      value.mode &&
      ((value.mode === "between" && value.startDate && value.endDate) ||
        (["before", "after"].includes(value.mode) && value.single))
    );
  };

  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Icon className="h-4 w-4" />
          <Label className="text-sm font-medium flex-1">{label}</Label>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !localValue.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localValue.startDate ? (
                  format(localValue.startDate, "PPP")
                ) : (
                  <span>Start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localValue.startDate}
                onSelect={(date) => handleDateChange("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !localValue.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localValue.endDate ? (
                  format(localValue.endDate, "PPP")
                ) : (
                  <span>End date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localValue.endDate}
                onSelect={(date) => handleDateChange("endDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {(localValue.mode === "before" || localValue.mode === "after") && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !localValue.single && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {localValue.single ? (
                format(localValue.single, "PPP")
              ) : (
                <span>Select date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={localValue.single}
              onSelect={(date) => handleDateChange("single", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
