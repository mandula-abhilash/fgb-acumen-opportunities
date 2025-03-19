"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { BuyerSidebar } from "@/components/filters/sidebar/buyer-sidebar";
import { SellerSidebar } from "@/components/filters/sidebar/seller-sidebar";

export function DesktopNav({ activeTab }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewMode = searchParams.get("view") || "list";

  const [filters, setFilters] = useState({
    regions: [],
    plots: {},
    planningStatus: [],
    landPurchaseStatus: [],
    startDate: {},
    handoverDate: {},
  });
  const [showShortlisted, setShowShortlisted] = useState(false);

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));

    // Update URL with filter parameters
    const params = new URLSearchParams(searchParams);

    if (filterKey === "regions" && Array.isArray(value)) {
      if (value.length > 0) {
        params.set("regions", value.join(","));
      } else {
        params.delete("regions");
      }
    }

    // Update the URL with the new parameters
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleViewModeChange = () => {
    const params = new URLSearchParams(searchParams);
    const newMode = viewMode === "list" ? "map" : "list";
    params.set("view", newMode);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSubmitNewSite = () => {
    router.push("/dashboard/sites/options");
  };

  if (user?.role === "buyer") {
    return (
      <BuyerSidebar
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        showShortlisted={showShortlisted}
        onShortlistedChange={setShowShortlisted}
      />
    );
  }

  if (user?.role === "seller") {
    return (
      <SellerSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSubmitNewSite={handleSubmitNewSite}
      />
    );
  }

  // Admin gets access to both views with a toggle
  if (user?.role === "admin") {
    return (
      <BuyerSidebar
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        showShortlisted={showShortlisted}
        onShortlistedChange={setShowShortlisted}
      />
    );
  }

  return null;
}
