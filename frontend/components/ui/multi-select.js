"use client";

import * as React from "react";
import { Check, ChevronDown, X, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
  maxCount = 3,
}) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleSelect = (currentValue) => {
    if (selected.includes(currentValue)) {
      onChange(selected.filter((item) => item !== currentValue));
    } else {
      onChange([...selected, currentValue]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  const toggleAll = () => {
    if (selected.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((option) => option.value));
    }
  };

  const clearExtraOptions = () => {
    onChange(selected.slice(0, maxCount));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full p-1 justify-between h-auto min-h-10",
            className
          )}
        >
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-wrap items-center">
              {selected.length === 0 && (
                <span className="text-sm text-muted-foreground mx-3">
                  {placeholder}
                </span>
              )}
              {selected.slice(0, maxCount).map((value) => {
                const option = options.find((opt) => opt.value === value);
                return (
                  <Badge variant="secondary" key={value} className="m-1">
                    {option?.label}
                    <XCircle
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(value);
                      }}
                    />
                  </Badge>
                );
              })}
              {selected.length > maxCount && (
                <Badge variant="secondary" className="m-1">
                  {`+ ${selected.length - maxCount} more`}
                  <XCircle
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearExtraOptions();
                    }}
                  />
                </Badge>
              )}
            </div>
            {selected.length > 0 && (
              <div className="flex items-center">
                <X
                  className="h-4 mx-2 cursor-pointer text-muted-foreground"
                  onClick={handleClear}
                />
                <Separator orientation="vertical" className="h-6" />
                <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
              </div>
            )}
            {selected.length === 0 && (
              <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search regions..." />
          <CommandList>
            <CommandEmpty>No region found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={toggleAll}>
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selected.length === options.length
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <Check className={cn("h-4 w-4")} />
                </div>
                <span>(Select All)</span>
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selected.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div className="flex items-center justify-between">
                {selected.length > 0 && (
                  <>
                    <CommandItem
                      onSelect={handleClear}
                      className="flex-1 justify-center"
                    >
                      Clear
                    </CommandItem>
                    <Separator orientation="vertical" className="h-6" />
                  </>
                )}
                <CommandItem
                  onSelect={() => setOpen(false)}
                  className="flex-1 justify-center"
                >
                  Close
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
