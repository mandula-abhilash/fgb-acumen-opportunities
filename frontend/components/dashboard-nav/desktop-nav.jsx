"use client";

import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MultiSelectFilter } from "@/components/filters/multi-select-filter";
import { PlotsFilter } from "@/components/filters/plots-filter";
import { SelectFilter } from "@/components/filters/select-filter";
import { TextFilter } from "@/components/filters/text-filter";

import { NavItem } from "./nav-item";
import { getNavItems } from "./nav-items";

export function DesktopNav({ activeTab, role = "buyer" }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState({});
  const navItems = getNavItems(role);

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const hasActiveFilter = (item) => {
    const value = filters[item.filterKey];
    if (!value) return false;

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "object") {
      // For plots filter
      return (
        value.mode &&
        ((value.mode === "between" && value.min && value.max) ||
          ((value.mode === "more-than" || value.mode === "less-than") &&
            value.single))
      );
    }

    return value.trim().length > 0;
  };

  const renderFilterInput = (item) => {
    const value = filters[item.filterKey];
    const onChange = (newValue) => handleFilterChange(item.filterKey, newValue);

    switch (item.type) {
      case "plots-range":
        return <PlotsFilter item={item} value={value} onChange={onChange} />;
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
          "h-full transition-all duration-300 ease-in-out overflow-y-auto p-2",
          isCollapsed ? "w-16" : "w-72"
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
