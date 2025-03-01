"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SiteMap } from "@/components/site-map";

export function SiteLocationMap({
  onLocationSelect,
  onPolygonComplete,
  selectedLocation,
  polygonPath,
}) {
  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <SiteMap
          onLocationSelect={onLocationSelect}
          onPolygonComplete={onPolygonComplete}
          selectedLocation={selectedLocation}
          polygonPath={polygonPath}
          placeholder="Search for and mark the site location on the map"
        />
      </CardContent>
    </Card>
  );
}
