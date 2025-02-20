"use client";

import { MultiSelect } from "@/components/ui/multi-select";

export function MultiSelectFilter({ item, value, onChange }) {
  return (
    <MultiSelect
      options={item.options}
      selected={value || []}
      onChange={onChange}
      placeholder={item.placeholder}
      maxCount={3}
    />
  );
}
