"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { BuyerSidebar } from "@/components/filters/sidebar/buyer-sidebar";
import { SellerSidebar } from "@/components/filters/sidebar/seller-sidebar";

export function DesktopNav({ activeTab, filters, onFilterChange }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState("list");
  const [showShortlisted, setShowShortlisted] = useState(false);

  const handleViewModeChange = () => {
    setViewMode((prev) => (prev === "list" ? "map" : "list"));
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
        onFilterChange={onFilterChange}
        showShortlisted={showShortlisted}
        onShortlistedChange={setShowShortlisted}
      />
    );
  }

  if (user?.role === "seller") {
    return (
      <SellerSidebar
        filters={filters}
        onFilterChange={onFilterChange}
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
        onFilterChange={onFilterChange}
        showShortlisted={showShortlisted}
        onShortlistedChange={setShowShortlisted}
      />
    );
  }

  return null;
}
