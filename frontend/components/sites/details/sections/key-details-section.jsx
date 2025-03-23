"use client";

import { Building2, Store, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function KeyDetailsSection({ site }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      <Card className="overflow-hidden border border-havelock-blue/20">
        <div className="grid grid-cols-2 divide-x">
          <div className="p-2 space-y-0.5 bg-havelock-blue/5">
            <span className="text-sm text-muted-foreground">Plots</span>
            <p className="text-lg font-bold text-havelock-blue">{site.plots}</p>
          </div>
          <div className="p-2 space-y-0.5 bg-havelock-blue/5">
            <span className="text-sm text-muted-foreground">Type</span>
            <p className="text-sm font-medium">{site.opportunity_type}</p>
          </div>
        </div>
      </Card>

      <div className="bg-background/40 shadow-md rounded-lg p-4">
        <div className="flex items-center gap-2 text-web-orange mb-2">
          <Store className="h-4 w-4" />
          <h3 className="font-semibold">Opportunity Type</h3>
        </div>
        <Badge variant="outline" className="capitalize">
          {site.opportunityType.replace(/-/g, " ")}
        </Badge>
      </div>

      <div className="bg-background/40 shadow-md rounded-lg p-4">
        <div className="flex items-center gap-2 text-web-orange mb-2">
          <Users className="h-4 w-4" />
          <h3 className="font-semibold">Number of Plots</h3>
        </div>
        <p className="text-lg font-medium">{site.plots} units</p>
      </div>
    </div>
  );
}
