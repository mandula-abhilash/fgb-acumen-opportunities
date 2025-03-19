"use client";

import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";

import { getRegions } from "@/lib/api/regions";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Spinner } from "@/components/ui/spinner";

export function RegionFilter({ value, onChange }) {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await getRegions();
        setRegions(data);
      } catch (error) {
        console.error("Failed to fetch regions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner size="sm" className="text-web-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <Globe2 className="h-4 w-4" />
        <Label className="text-sm font-medium flex-1">Region</Label>
      </div>
      <MultiSelect
        options={regions}
        selected={value || []}
        onChange={onChange}
        placeholder="Select regions..."
      />
    </div>
  );
}
