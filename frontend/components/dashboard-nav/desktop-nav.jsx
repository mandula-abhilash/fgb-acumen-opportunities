"use client";

import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

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
  const navItems = getNavItems(role);

  const handleFilterChange = (filterKey, value) => {
    const updatedFilters = {
      ...filters,
      [filterKey]: value,
    };
    setFilters(updatedFilters);
  };

  const renderFilterInput = (item) => {
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
