"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = React.useState("");

  console.log("Current selected values:", selected);
  console.log("Is dropdown open:", open);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnselect = (item) => {
    console.log("Unselecting item:", item);
    onChange(selected.filter((i) => i !== item));
  };

  const handleSelect = (currentValue) => {
    console.log("Selecting value:", currentValue);
    if (selected.includes(currentValue)) {
      console.log("Removing from selection");
      onChange(selected.filter((item) => item !== currentValue));
    } else {
      console.log("Adding to selection");
      onChange([...selected, currentValue]);
    }
  };

  const handleClear = (e) => {
    console.log("Clearing all selections");
    e.stopPropagation();
    onChange([]);
  };

  const toggleAll = () => {
    console.log("Toggling all options");
    if (selected.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((option) => option.value));
    }
  };

  return (
    <div className="relative">
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
              <div className="flex flex-wrap items-center gap-1">
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
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(value);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnselect(value);
                        }}
                      >
                        <X className="h-3 w-3 hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })}
                {selected.length > maxCount && (
                  <Badge variant="secondary" className="m-1">
                    +{selected.length - maxCount} more
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selected.length > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={handleClear}
                      className="h-auto p-1 hover:bg-transparent"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Separator orientation="vertical" className="h-4" />
                  </>
                )}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start" sideOffset={4}>
          <Command>
            <CommandInput
              placeholder="Search..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-[200px] overflow-y-auto">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleAll();
                  }}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
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
                  <span>
                    {selected.length === options.length
                      ? "Deselect All"
                      : "Select All"}
                  </span>
                </div>
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
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
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
