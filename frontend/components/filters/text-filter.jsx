"use client";

import { Input } from "@/components/ui/input";

export function TextFilter({ item, value, onChange }) {
  return (
    <Input
      placeholder={item.placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
