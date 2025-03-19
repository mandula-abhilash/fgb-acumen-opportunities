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
    handoverDate: {},
  });

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  return (
    <FiltersContext.Provider value={{ filters, handleFilterChange }}>
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
