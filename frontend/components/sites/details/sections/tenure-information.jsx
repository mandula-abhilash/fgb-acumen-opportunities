"use client";

import { Home, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function TenureInformation({ site }) {
  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-havelock-blue mb-4">
        Tenure Information
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
            <Home className="h-4 w-4" />
            Tenures
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(site.tenures) &&
              site.tenures.map((tenure) => (
                <Badge
                  key={tenure}
                  variant="outline"
                  className="text-foreground"
                >
                  {tenure}
                </Badge>
              ))}
          </div>
        </div>

        {site.detailedTenureAccommodation && (
          <div>
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <Info className="h-4 w-4" />
              Detailed Tenure & Accommodation
            </h3>
            <p className="text-foreground whitespace-pre-wrap">
              {site.detailedTenureAccommodation}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
