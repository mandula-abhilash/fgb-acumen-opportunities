"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronsLeftRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { DateFilter } from "@/components/filters/date-filter";
import { MultiSelectFilter } from "@/components/filters/multi-select-filter";
import { PlotsFilter } from "@/components/filters/plots-filter";
import { SelectFilter } from "@/components/filters/select-filter";
import { TextFilter } from "@/components/filters/text-filter";

import { NavItem } from "./nav-item";
import { getNavItems } from "./nav-items";

export function DesktopNav({ activeTab, role = "buyer" }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState({});
  const [showShortlisted, setShowShortlisted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewMode = searchParams.get("view") || "list";
  const navItems = getNavItems(role);

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleViewModeChange = () => {
    const params = new URLSearchParams(searchParams);
    const newMode = viewMode === "list" ? "map" : "list";
    params.set("view", newMode);
    router.push(`/dashboard/opportunities?${params.toString()}`);
  };

  const isValidDateFilter = (value) => {
    if (!value || !value.mode) return false;

    const { mode, startDate, endDate, single } = value;
    if (mode === "between") {
      return startDate && endDate && new Date(startDate) < new Date(endDate);
    }
    if (mode === "before" || mode === "after") {
      return single && single.toString().length > 0;
    }
    return false;
  };

  const isValidPlotsFilter = (value) => {
    if (!value || !value.mode) return false;

    const { mode, min, max, single } = value;
    if (mode === "between") {
      return min && max && Number(min) < Number(max);
    }
    if (mode === "more-than" || mode === "less-than") {
      return single && single.toString().length > 0;
    }
    return false;
  };

  const hasActiveFilter = (item) => {
    const value = filters[item.filterKey];
    if (!value) return false;

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "object") {
      if (item.type === "date-range") {
        return isValidDateFilter(value);
      }
      if (item.type === "plots-range") {
        return isValidPlotsFilter(value);
      }
    }

    return value.trim().length > 0;
  };

  const renderFilterInput = (item) => {
    const value = filters[item.filterKey];
    const onChange = (newValue) => handleFilterChange(item.filterKey, newValue);

    switch (item.type) {
      case "toggle":
        const Icon = viewMode === "list" ? item.mapIcon : item.icon;
        return (
          <Toggle
            pressed={viewMode === "map"}
            onPressedChange={handleViewModeChange}
            className="w-full justify-start h-9 px-2"
          >
            <Icon className="h-4 w-4 mr-2" />
            {viewMode === "list" ? "Explore on Map" : "View as List"}
          </Toggle>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2 px-2 py-1">
            <Checkbox
              id={item.id}
              checked={showShortlisted}
              onCheckedChange={setShowShortlisted}
            />
            <label
              htmlFor={item.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.label}
            </label>
          </div>
        );
      case "plots-range":
        return <PlotsFilter item={item} value={value} onChange={onChange} />;
      case "date-range":
        return <DateFilter item={item} value={value} onChange={onChange} />;
      case "filter":
        if (item.options) {
          if (item.multiple) {
            return (
              <MultiSelectFilter
                item={item}
                value={value}
                onChange={onChange}
              />
            );
          }
          return <SelectFilter item={item} value={value} onChange={onChange} />;
        }
        return <TextFilter item={item} value={value} onChange={onChange} />;
      default:
        return null;
    }
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
          "h-full transition-all duration-300 ease-in-out overflow-y-auto py-2 px-4",
          isCollapsed ? "w-16" : "w-72"
        )}
      >
        <div className="flex flex-col space-y-2 py-2">
          {navItems.map((item) => {
            if (item.section) {
              if (!isCollapsed) {
                return (
                  <div key={item.section} className="space-y-4">
                    <h3 className="text-sm font-semibold px-2 mt-4 uppercase tracking-wider text-havelock-blue">
                      {item.section}
                    </h3>
                    {item.items.map((subItem) => (
                      <div key={subItem.id} className="space-y-2 px-2">
                        <div className="flex items-center gap-2">
                          <subItem.icon className="h-4 w-4" />
                          <span className="text-sm font-medium flex-1">
                            {subItem.label}
                          </span>
                          {hasActiveFilter(subItem) && (
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        {renderFilterInput(subItem)}
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }

            if (item.type === "toggle" || item.type === "checkbox") {
              if (!isCollapsed) {
                return (
                  <div key={item.id} className="px-2">
                    {renderFilterInput(item)}
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
