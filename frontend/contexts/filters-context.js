"use client";

import { createContext, useContext, useState } from "react";

const FiltersContext = createContext(null);

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState({
    regions: [],
    plots: {},
    planningStatus: [],
    landPurchaseStatus: [],
    startDate: {},
    firstHandoverDate: {},
    finalHandoverDate: {},
  });

  const [viewMode, setViewMode] = useState("list");

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleViewModeChange = () => {
    setViewMode((prev) => (prev === "list" ? "map" : "list"));
  };

  return (
    <FiltersContext.Provider
      value={{
        filters,
        handleFilterChange,
        viewMode,
        handleViewModeChange,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
}
