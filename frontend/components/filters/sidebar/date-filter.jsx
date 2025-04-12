"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Edit2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
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
  // Define isFilterActive before using it in useState
  const isFilterActive = (val = value) => {
    return (
      val &&
      val.mode &&
      ((val.mode === "between" && val.startDate && val.endDate) ||
        (["before", "after"].includes(val.mode) && val.single))
    );
  };

  const [localValue, setLocalValue] = useState(value);
  const [isDirty, setIsDirty] = useState(false);
  const [isOpen, setIsOpen] = useState(!isFilterActive(value));

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
    setIsOpen(false);
  };

  const handleCloseFilter = () => {
    setIsOpen(false);
  };

  const handleClearFilter = (e) => {
    e.stopPropagation();
    setLocalValue({});
    setIsDirty(false);
    onChange({});
    setIsOpen(true);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsOpen(true);
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

  const getFilterLabel = () => {
    if (!isFilterActive()) return null;

    if (value.mode === "between") {
      return `Between ${value.startDate.toLocaleDateString()} and ${value.endDate.toLocaleDateString()}`;
    } else if (value.mode === "before") {
      return `Before ${value.single.toLocaleDateString()}`;
    } else if (value.mode === "after") {
      return `After ${value.single.toLocaleDateString()}`;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-2 px-2">
        {/* Remove CollapsibleTrigger and make the label section non-interactive */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Icon className="h-4 w-4" />
            <Label className="text-sm font-medium flex-1">{label}</Label>
            {isFilterActive() && (
              <div className="h-2 w-2 rounded-full bg-havelock-blue" />
            )}
          </div>
        </div>

        {isFilterActive() && !isOpen && (
          <div className="flex items-center gap-2 px-6 py-1 bg-muted/100 rounded-md group transition-colors hover:bg-muted">
            <span className="flex-1 text-sm font-medium group-hover:text-havelock-blue transition-colors">
              {getFilterLabel()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
              onClick={handleEdit}
            >
              <Edit2 className="h-3 w-3" />
              <span className="sr-only">Edit filter</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
              onClick={handleClearFilter}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear filter</span>
            </Button>
          </div>
        )}

        <CollapsibleContent>
          <div className="space-y-2">
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
                <DatePicker
                  value={localValue.startDate}
                  onChange={(date) => handleDateChange("startDate", date)}
                />
                <DatePicker
                  value={localValue.endDate}
                  onChange={(date) => handleDateChange("endDate", date)}
                />
              </div>
            )}

            {(localValue.mode === "before" || localValue.mode === "after") && (
              <DatePicker
                value={localValue.single}
                onChange={(date) => handleDateChange("single", date)}
              />
            )}

            {localValue.mode && (
              <Button
                onClick={isDirty ? handleApplyFilter : handleCloseFilter}
                disabled={isDirty && !isValid()}
                className="w-full mt-2 bg-web-orange hover:bg-web-orange/90 text-white"
              >
                {isDirty ? "Apply Filter" : "Close"}
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
