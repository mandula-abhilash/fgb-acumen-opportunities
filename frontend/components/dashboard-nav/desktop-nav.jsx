"use client";

import { useState } from "react";
import { ChevronsLeftRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { NavItem } from "./nav-item";
import { getNavItems } from "./nav-items";

export function DesktopNav({ activeTab, role = "buyer" }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState({});
  const [plotsErrors, setPlotsErrors] = useState({});
  const navItems = getNavItems(role);

  const validateNumber = (value) => {
    if (value === "") return true;
    const num = Number(value);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
  };

  const validatePlotRange = (mode, values) => {
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

  const handleFilterChange = (filterKey, value, subKey = null) => {
    if (filterKey === "plots") {
      let updatedPlots;
      if (subKey === "mode") {
        // Reset values when changing modes
        updatedPlots = { mode: value };
      } else {
        updatedPlots = { ...filters.plots, [subKey]: value };

        // Validate number input
        if (value !== "" && !validateNumber(value)) {
          setPlotsErrors({
            ...plotsErrors,
            [subKey]: "Please enter a valid positive whole number",
          });
          return;
        }
      }

      // Clear errors when input is valid
      setPlotsErrors({});

      // Validate the entire range
      const rangeErrors = validatePlotRange(updatedPlots.mode, updatedPlots);
      setPlotsErrors(rangeErrors);

      setFilters({ ...filters, [filterKey]: updatedPlots });
    } else {
      setFilters({
        ...filters,
        [filterKey]: subKey
          ? { ...filters[filterKey], [subKey]: value }
          : value,
      });
    }
  };

  const clearPlotsFilter = () => {
    setFilters({ ...filters, plots: undefined });
    setPlotsErrors({});
  };

  const renderPlotsFilter = (item) => {
    const plotsFilter = filters.plots || {};
    const mode = plotsFilter.mode;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Select
            value={mode}
            onValueChange={(value) =>
              handleFilterChange("plots", value, "mode")
            }
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
              onClick={clearPlotsFilter}
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
                value={plotsFilter.min || ""}
                onChange={(e) =>
                  handleFilterChange("plots", e.target.value, "min")
                }
                className={cn(plotsErrors.min && "border-destructive")}
              />
              {plotsErrors.min && (
                <p className="text-xs text-destructive mt-1">
                  {plotsErrors.min}
                </p>
              )}
            </div>
            <div>
              <Input
                type="number"
                min="0"
                placeholder={item.fields.max.placeholder}
                value={plotsFilter.max || ""}
                onChange={(e) =>
                  handleFilterChange("plots", e.target.value, "max")
                }
                className={cn(plotsErrors.max && "border-destructive")}
              />
              {plotsErrors.max && (
                <p className="text-xs text-destructive mt-1">
                  {plotsErrors.max}
                </p>
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
              value={plotsFilter.single || ""}
              onChange={(e) =>
                handleFilterChange("plots", e.target.value, "single")
              }
              className={cn(plotsErrors.single && "border-destructive")}
            />
            {plotsErrors.single && (
              <p className="text-xs text-destructive mt-1">
                {plotsErrors.single}
              </p>
            )}
          </div>
        )}

        {plotsErrors.general && (
          <p className="text-xs text-destructive">{plotsErrors.general}</p>
        )}
      </div>
    );
  };

  const renderFilterInput = (item) => {
    if (item.type === "plots-range") {
      return renderPlotsFilter(item);
    }

    if (item.options) {
      if (item.multiple) {
        return (
          <MultiSelect
            options={item.options}
            selected={filters[item.filterKey] || []}
            onChange={(value) => handleFilterChange(item.filterKey, value)}
            placeholder={item.placeholder}
            maxCount={3}
          />
        );
      }

      return (
        <Select
          value={filters[item.filterKey] || ""}
          onValueChange={(value) => handleFilterChange(item.filterKey, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={item.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {item.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        placeholder={item.placeholder}
        value={filters[item.filterKey] || ""}
        onChange={(e) => handleFilterChange(item.filterKey, e.target.value)}
      />
    );
  };

  return (
    <div className="relative h-full">
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-3 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent hover:text-accent-foreground z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronsLeftRight
          className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed ? "rotate-180" : ""
          )}
        />
        <span className="sr-only">
          {isCollapsed ? "Expand" : "Collapse"} Sidebar
        </span>
      </Button>

      <div
        className={cn(
          "h-full transition-all duration-300 ease-in-out overflow-y-auto p-2",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex flex-col space-y-2 py-2">
          {navItems.map((item) => {
            if (item.section) {
              if (!isCollapsed) {
                return (
                  <div key={item.section} className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground px-2">
                      {item.section}
                    </h3>
                    {item.items.map((subItem) => (
                      <div key={subItem.id} className="space-y-2 px-2">
                        <div className="flex items-center gap-2">
                          <subItem.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {subItem.label}
                          </span>
                        </div>
                        {renderFilterInput(subItem)}
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }

            return (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                isCollapsed={isCollapsed}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
