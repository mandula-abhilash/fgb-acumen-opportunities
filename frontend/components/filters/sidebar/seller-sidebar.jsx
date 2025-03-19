"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DateFilter } from "./date-filter";
import { LandPurchaseFilter } from "./land-purchase-filter";
import { PlanningStatusFilter } from "./planning-status-filter";
import { PlotsFilter } from "./plots-filter";
import { RegionFilter } from "./region-filter";

export function SellerSidebar({ filters, onFilterChange, onSubmitNewSite }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`h-full transition-all duration-300 ${isCollapsed ? "w-16" : "w-72"}`}
    >
      <div className="flex flex-col space-y-4 p-4">
        {/* Submit New Site Button */}
        <Button
          onClick={onSubmitNewSite}
          className="bg-web-orange hover:bg-web-orange/90 text-white w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit New Site
        </Button>

        {/* Filters */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold px-2 uppercase tracking-wider text-havelock-blue">
            Filters
          </h3>

          <RegionFilter
            value={filters.regions}
            onChange={(value) => onFilterChange("regions", value)}
          />

          <PlotsFilter
            value={filters.plots}
            onChange={(value) => onFilterChange("plots", value)}
          />

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
