"use client";

import { usePathname, useRouter } from "next/navigation";
import { useFilters } from "@/contexts/filters-context";
import { Calendar, List, Map, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { DateFilter } from "@/components/filters/date-filter";
import { PlotsFilter } from "@/components/filters/plots-filter";

import { LandPurchaseFilter } from "./land-purchase-filter";
import { PlanningStatusFilter } from "./planning-status-filter";
import { RegionFilter } from "./region-filter";

export function BuyerSidebar({ filters, onFilterChange }) {
  const { viewMode, handleViewModeChange } = useFilters();
  const router = useRouter();
  const pathname = usePathname();
  const isOpportunitiesPage = pathname.includes("/opportunities");

  const handleViewModeToggle = () => {
    if (!isOpportunitiesPage) {
      handleViewModeChange("list"); // Force list view when navigating
      router.push("/dashboard/opportunities");
    } else {
      handleViewModeChange(); // Toggle between views when on opportunities page
    }
  };

  return (
    <div className="w-72 h-full flex flex-col">
      <div className="p-4 border-b">
        {/* View Mode Toggle */}
        <Toggle
          pressed={viewMode === "map"}
          onPressedChange={handleViewModeToggle}
          className="w-full justify-start h-9"
        >
          {!isOpportunitiesPage ? (
            <>
              <List className="h-4 w-4 mr-2" />
              Live Opportunities
            </>
          ) : viewMode === "list" ? (
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
        <div className="flex items-center space-x-2 px-2 mt-4">
          <Checkbox
            id="shortlisted"
            checked={filters.showShortlisted}
            onCheckedChange={(checked) =>
              onFilterChange("showShortlisted", checked)
            }
            className="h-4 w-4 ml-1"
          />
          <Label htmlFor="shortlisted" className="text-sm cursor-pointer">
            <div className="flex items-center">Show Shortlisted Only</div>
          </Label>
        </div>
      </div>

      {/* Scrollable Filters Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
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

          <div className="px-2 pb-[300px]">
            <div className="space-y-6">
              <DateFilter
                icon={Calendar}
                label="Start on Site Date"
                value={filters.startDate}
                onChange={(value) => onFilterChange("startDate", value)}
              />

              <DateFilter
                icon={Timer}
                label="First Handover Date"
                value={filters.firstHandoverDate}
                onChange={(value) => onFilterChange("firstHandoverDate", value)}
              />

              <DateFilter
                icon={Timer}
                label="Final Handover Date"
                value={filters.finalHandoverDate}
                onChange={(value) => onFilterChange("finalHandoverDate", value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
