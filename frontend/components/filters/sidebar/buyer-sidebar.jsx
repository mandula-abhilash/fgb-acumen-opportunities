"use client";

import { useState } from "react";
import { Heart, List, Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { PlotsFilter } from "@/components/filters/plots-filter";

import { DateFilter } from "./date-filter";
import { LandPurchaseFilter } from "./land-purchase-filter";
import { PlanningStatusFilter } from "./planning-status-filter";
import { RegionFilter } from "./region-filter";

export function BuyerSidebar({
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange,
  showShortlisted,
  onShortlistedChange,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`h-full transition-all duration-300 ${isCollapsed ? "w-16" : "w-72"}`}
    >
      <div className="flex flex-col space-y-4 p-4">
        {/* View Mode Toggle */}
        <Toggle
          pressed={viewMode === "map"}
          onPressedChange={onViewModeChange}
          className="w-full justify-start h-9"
        >
          {viewMode === "list" ? (
            <>
              <Map className="h-4 w-4 mr-2" />
              Explore on Map
            </>
          ) : (
            <>
              <List className="h-4 w-4 mr-2" />
              View as List
            </>
          )}
        </Toggle>

        {/* Shortlisted Toggle */}
        <div className="flex items-center space-x-2 px-2">
          <Checkbox
            id="shortlisted"
            checked={showShortlisted}
            onCheckedChange={onShortlistedChange}
            className="h-4 w-4 ml-1"
          />
          <Label htmlFor="shortlisted" className="text-sm cursor-pointer">
            <div className="flex items-center">Show Shortlisted Only</div>
          </Label>
        </div>

        <Separator />

        {/* Filters */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold px-2 uppercase tracking-wider text-havelock-blue">
            Filters
          </h3>

          <RegionFilter
            value={filters.regions}
            onChange={(value) => onFilterChange("regions", value)}
          />

          <div className="px-2">
            <PlotsFilter
              value={filters.plots}
              onChange={(value) => onFilterChange("plots", value)}
            />
          </div>

          <PlanningStatusFilter
            value={filters.planningStatus}
            onChange={(value) => onFilterChange("planningStatus", value)}
          />

          <LandPurchaseFilter
            value={filters.landPurchaseStatus}
            onChange={(value) => onFilterChange("landPurchaseStatus", value)}
          />

          <DateFilter
            label="Start on Site Date"
            value={filters.startDate}
            onChange={(value) => onFilterChange("startDate", value)}
          />

          <DateFilter
            label="Handover Dates"
            value={filters.handoverDate}
            onChange={(value) => onFilterChange("handoverDate", value)}
          />
        </div>
      </div>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-3 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent hover:text-accent-foreground"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="sr-only">
          {isCollapsed ? "Expand" : "Collapse"} Sidebar
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Button>
    </div>
  );
}
