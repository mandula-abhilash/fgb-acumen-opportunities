"use client";

import { usePathname, useRouter } from "next/navigation";
import { List, Map } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

export function SellerSidebar({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isOpportunitiesPage = pathname === "/dashboard/opportunities";

  const handleViewModeToggle = () => {
    if (!isOpportunitiesPage) {
      router.push("/dashboard/opportunities");
    } else {
      onViewModeChange();
    }
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
    </div>
  );
}
