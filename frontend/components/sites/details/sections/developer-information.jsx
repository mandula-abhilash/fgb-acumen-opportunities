"use client";

import { Building2, Globe2, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function DeveloperInformation({ site }) {
  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-havelock-blue mb-4">
        Developer Information
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
            <Building2 className="h-4 w-4" />
            Developer Name
          </h3>
          <p className="text-foreground">{site.developerName}</p>
        </div>
        {site.developer_region_names?.length > 0 && (
          <div>
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <Globe2 className="h-4 w-4" />
              Developer Region
            </h3>
            <div className="flex flex-wrap gap-1">
              {site.developer_region_names.map((region) => (
                <Badge key={region} variant="secondary" className="text-xs">
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {site.developerInfo && (
          <div>
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <Info className="h-4 w-4" />
              Additional Information
            </h3>
            <p className="text-foreground whitespace-pre-wrap">
              {site.developerInfo}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
