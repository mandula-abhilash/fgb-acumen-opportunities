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

  return (
    <div className="w-72 h-full flex flex-col">
      <div className="p-4 space-y-4 border-b pt-14 lg:pt-4">
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
              id="shortlisted-mobile"
              checked={filters.showShortlisted}
              onCheckedChange={(checked) =>
                handleFilterChange("showShortlisted", checked)
              }
              className="h-4 w-4 ml-1 data-[state=checked]:bg-web-orange data-[state=checked]:text-primary-foreground"
            />
            <Label
              htmlFor="shortlisted-mobile"
              className="text-sm cursor-pointer select-none"
            >
              Show Shortlisted Only
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
