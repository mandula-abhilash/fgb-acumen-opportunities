"use client";

import { Globe2, Landmark } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function LocationInformation({ site }) {
  // Function to clean LPA names
  const cleanLpaName = (lpa) => {
    return lpa.replace(/ LPA$/, "");
  };

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-havelock-blue mb-4">
        Location Information
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
            <Globe2 className="h-4 w-4" />
            Regions
          </h3>
          <div className="flex flex-wrap gap-2">
            {site.region_names?.map((region) => (
              <Badge key={region} variant="outline">
                {region}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
            <Landmark className="h-4 w-4" />
            Local Planning Authorities
          </h3>
          <div className="flex flex-wrap gap-2">
            {site.lpa_names?.map((lpa) => (
              <Badge key={lpa} variant="secondary" className="text-xs">
                {cleanLpaName(lpa)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
