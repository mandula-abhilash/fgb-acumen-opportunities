"use client";

import { usePathname, useRouter } from "next/navigation";
import { useFilters } from "@/contexts/filters-context";
import { Calendar, Check, List, Map, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { DateFilter } from "@/components/filters/sidebar/date-filter";
import { PlotsFilter } from "@/components/filters/sidebar/plots-filter";

import { LandPurchaseFilter } from "./land-purchase-filter";
import { PlanningStatusFilter } from "./planning-status-filter";
import { RegionFilter } from "./region-filter";

export function BuyerSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { filters, handleFilterChange, viewMode, handleViewModeChange } =
    useFilters();
  const isOpportunitiesPage = pathname === "/dashboard/opportunities";

  const handleViewModeToggle = () => {
    if (!isOpportunitiesPage) {
      router.push("/dashboard/opportunities");
    } else {
      handleViewModeChange();
    }
  };

  return (
    <div className="w-72 h-full flex flex-col">
      <div className="p-4 border-b">
        {/* View Mode Toggle */}
        <Toggle
          pressed={viewMode === "map" && isOpportunitiesPage}
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                handleFilterChange("showShortlisted", !filters.showShortlisted)
              }
              className={`h-4 w-4 ml-1 rounded flex items-center justify-center ${
                filters.showShortlisted
                  ? "bg-web-orange"
                  : "border border-gray-300"
              }`}
              aria-checked={filters.showShortlisted}
              role="checkbox"
            >
              {filters.showShortlisted && (
                <Check className="h-3 w-3 text-white" />
              )}
            </button>
            <Label
              onClick={() =>
                handleFilterChange("showShortlisted", !filters.showShortlisted)
              }
              className="text-sm cursor-pointer select-none"
            >
              Show Shortlisted Only
            </Label>
          </div>
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
            onChange={(value) => handleFilterChange("regions", value)}
          />

          <div className="px-2">
            <PlotsFilter
              value={filters.plots}
              onChange={(value) => handleFilterChange("plots", value)}
            />
          </div>

          <PlanningStatusFilter
            value={filters.planningStatus}
            onChange={(value) => handleFilterChange("planningStatus", value)}
          />

          <LandPurchaseFilter
            value={filters.landPurchaseStatus}
            onChange={(value) =>
              handleFilterChange("landPurchaseStatus", value)
            }
          />

          <div className="px-2 pb-[300px]">
            <div className="space-y-6">
              <DateFilter
                icon={Calendar}
                label="Start on Site Date"
                value={filters.startDate}
                onChange={(value) => handleFilterChange("startDate", value)}
              />

              <DateFilter
                icon={Timer}
                label="First Handover Date"
                value={filters.firstHandoverDate}
                onChange={(value) =>
                  handleFilterChange("firstHandoverDate", value)
                }
              />

              <DateFilter
                icon={Timer}
                label="Final Handover Date"
                value={filters.finalHandoverDate}
                onChange={(value) =>
                  handleFilterChange("finalHandoverDate", value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
