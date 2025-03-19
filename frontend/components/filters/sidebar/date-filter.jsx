"use client";

import { format } from "date-fns";
import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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

export function DateFilter({ label, value = {}, onChange }) {
  const handleModeChange = (mode) => {
    onChange({ ...value, mode });
  };

  const handleDateChange = (field, date) => {
    onChange({ ...value, [field]: date });
  };

  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <Label className="text-sm font-medium flex-1">{label}</Label>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value.startDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {value.startDate ? (
                  format(value.startDate, "PPP")
                ) : (
                  <span>Start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={value.startDate}
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
                  !value.endDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {value.endDate ? (
                  format(value.endDate, "PPP")
                ) : (
                  <span>End date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={value.endDate}
                onSelect={(date) => handleDateChange("endDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {(value.mode === "before" || value.mode === "after") && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value.single && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {value.single ? (
                format(value.single, "PPP")
              ) : (
                <span>Select date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={value.single}
              onSelect={(date) => handleDateChange("single", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
