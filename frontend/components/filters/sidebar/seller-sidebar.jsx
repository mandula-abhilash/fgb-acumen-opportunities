"use client";

import { useRouter } from "next/navigation";
import { useFilters } from "@/contexts/filters-context";
import { Heart, List, Map } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

export function SellerSidebar({ onSubmitNewSite }) {
  const router = useRouter();
  const { viewMode, handleViewModeChange, filters, handleFilterChange } =
    useFilters();

  const handleViewModeToggle = () => {
    handleViewModeChange();
  };

  return (
    <div className="w-72 h-full flex flex-col">
      <div className="p-4 space-y-4 border-b">
        {/* View Mode Toggle */}
        <Toggle
          pressed={viewMode === "map"}
          onPressedChange={handleViewModeToggle}
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
            checked={filters.showShortlisted}
            onCheckedChange={(checked) =>
              handleFilterChange("showShortlisted", checked)
            }
            className="h-4 w-4 ml-1"
          />
          <Label htmlFor="shortlisted" className="text-sm cursor-pointer">
            <div className="flex items-center">Show Shortlisted Only</div>
          </Label>
        </div>
      </div>
    </div>
  );
}
