"use client";

import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { BuyerSidebar } from "@/components/filters/sidebar/buyer-sidebar";
import { SellerSidebar } from "@/components/filters/sidebar/seller-sidebar";

export function DesktopNav({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) {
  const { user } = useAuth();

  if (user?.role === "buyer") {
    return (
      <BuyerSidebar
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    );
  }

  if (user?.role === "seller") {
    return (
      <SellerSidebar
        filters={filters}
        onFilterChange={onFilterChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
    );
  }

  // Default to buyer view
  return (
    <BuyerSidebar
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      filters={filters}
      onFilterChange={onFilterChange}
    />
  );
}
