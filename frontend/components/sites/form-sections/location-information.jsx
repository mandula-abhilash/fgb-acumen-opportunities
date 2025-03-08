"use client";

import { useEffect, useState } from "react";

import { getDefaultRegions } from "@/lib/api/regions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Spinner } from "@/components/ui/spinner";

export function LocationInformation({ watch, setValue, errors, lpaOptions }) {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionsData = await getDefaultRegions();
        setRegions(regionsData);
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
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
          <CardDescription>Loading regions...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="lg" className="text-web-orange" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Information</CardTitle>
        <CardDescription>
          Specify the regions and local planning authorities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>
            Region <span className="text-destructive">*</span>
          </Label>
          <MultiSelect
            options={regions}
            selected={watch("region")}
            onChange={(value) => setValue("region", value)}
            placeholder="Select regions..."
          />
          {errors.region && (
            <p className="text-sm text-destructive">{errors.region.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            LPA <span className="text-destructive">*</span>
          </Label>
          <MultiSelect
            options={lpaOptions}
            selected={watch("lpa")}
            onChange={(value) => setValue("lpa", value)}
            placeholder="Select LPA..."
          />
          {errors.lpa && (
            <p className="text-sm text-destructive">{errors.lpa.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
