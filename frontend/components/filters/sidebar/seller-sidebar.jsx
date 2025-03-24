"use client";

import { usePathname, useRouter } from "next/navigation";
import { useFilters } from "@/contexts/filters-context";
import { List, Map } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

export function SellerSidebar() {
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

  // Create a specific handler for the shortlist checkbox
  const handleShortlistedChange = (checked) => {
    // Convert to boolean if needed (as checked might come as "indeterminate")
    const newValue = checked === true;
    handleFilterChange("showShortlisted", newValue);
  };

  return (
    <div className="w-72 h-full flex flex-col">
      <div className="p-4 space-y-4 border-b">
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
        <div className="flex items-center space-x-2 px-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shortlisted"
              checked={filters.showShortlisted}
              onCheckedChange={handleShortlistedChange}
              className="h-4 w-4 ml-1"
            />
            <Label
              htmlFor="shortlisted"
              className="text-sm cursor-pointer select-none"
              onClick={() => handleShortlistedChange(!filters.showShortlisted)}
            >
              Show Shortlisted Only
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
