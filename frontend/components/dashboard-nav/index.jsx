"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFilters } from "@/contexts/filters-context";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { DesktopNav } from "./desktop-nav";

export function DashboardNav({ activeTab }) {
  const { user, loading } = useAuth();
  const { filters, handleFilterChange } = useFilters();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <DesktopNav
      activeTab={activeTab}
      role={user.role}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
}
