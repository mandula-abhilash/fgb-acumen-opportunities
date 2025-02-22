"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteMap } from "@/components/site-map";

export function SiteLocation({
  onLocationSelect,
  onPolygonComplete,
  selectedLocation,
  polygonPath,
}) {
  return (
    <Card className="relative">
      <CardHeader className="relative z-20">
        <CardTitle>Site Location</CardTitle>
        <CardDescription>
          Search for and mark the site location on the map
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px]">
          <SiteMap
            onLocationSelect={onLocationSelect}
            onPolygonComplete={onPolygonComplete}
            selectedLocation={selectedLocation}
            polygonPath={polygonPath}
          />
        </div>
      </CardContent>
    </Card>
  );
}
