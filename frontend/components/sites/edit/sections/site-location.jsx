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
  initialZoom = 12,
}) {
  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <div className="h-full">
          <SiteMap
            onLocationSelect={onLocationSelect}
            onPolygonComplete={onPolygonComplete}
            selectedLocation={selectedLocation}
            polygonPath={polygonPath}
            placeholder="Search for and mark the site location on the map"
            initialZoom={initialZoom}
          />
        </div>
      </CardContent>
    </Card>
  );
}
