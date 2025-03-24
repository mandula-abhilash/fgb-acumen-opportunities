"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFilters } from "@/contexts/filters-context";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BuyerSidebar } from "@/components/filters/sidebar/buyer-sidebar";
import { SellerSidebar } from "@/components/filters/sidebar/seller-sidebar";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { filters, handleFilterChange, viewMode, handleViewModeChange } =
    useFilters();

  const renderSidebar = () => {
    if (user?.role === "seller") {
      return (
        <SellerSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      );
    }

    return (
      <BuyerSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
    );
  };

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="fixed right-4 top-4 z-[60] rounded-full lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
          <div className="fixed top-14 right-0 w-72 h-[calc(100vh-3.5rem)] bg-background border-l shadow-xl overflow-y-auto">
            <div className="pt-4">{renderSidebar()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
