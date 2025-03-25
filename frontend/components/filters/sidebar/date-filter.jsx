"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Pencil, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
      return `Between ${format(value.startDate, "PP")} and ${format(value.endDate, "PP")}`;
    } else if (value.mode === "before") {
      return `Before ${format(value.single, "PP")}`;
    } else if (value.mode === "after") {
      return `After ${format(value.single, "PP")}`;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-2 px-2">
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-center gap-2 flex-1">
              <Icon className="h-4 w-4" />
              <Label className="text-sm font-medium flex-1">{label}</Label>
              {isFilterActive() && (
                <div className="h-2 w-2 rounded-full bg-havelock-blue" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        {isFilterActive() && !isOpen && (
          <div className="flex items-center gap-2 px-6 py-1 bg-muted/50 rounded-md">
            <span className="flex-1 text-sm">{getFilterLabel()}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={handleEdit}
            >
              <Pencil className="h-3 w-3" />
              <span className="sr-only">Edit filter</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={handleClearFilter}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear filter</span>
            </Button>
          </div>
        )}

        <CollapsibleContent>
          <div className="space-y-2 pt-2">
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
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
