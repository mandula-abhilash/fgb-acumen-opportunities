"use client";

import { Building2, ScrollText, Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function KeyDetailsSection({ site }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-background/40 shadow-sm rounded-lg p-4 border">
        <div className="flex items-center gap-2 text-havelock-blue mb-2">
          <Store className="h-4 w-4" />
          <h3 className="font-semibold">Opportunity Type</h3>
        </div>
        <Badge variant="outline" className="capitalize">
          {site.opportunityType.replace(/-/g, " ")}
        </Badge>
      </div>

      <div className="bg-background/40 shadow-sm rounded-lg p-4 border">
        <div className="flex items-center gap-2 text-havelock-blue mb-2">
          <Building2 className="h-4 w-4" />
          <h3 className="font-semibold">Number of Plots</h3>
        </div>
        <p className="text-lg font-medium">{site.plots} units</p>
      </div>

      <div className="bg-background/40 shadow-sm rounded-lg p-4 border">
        <div className="flex items-center gap-2 text-havelock-blue mb-2">
          <ScrollText className="h-4 w-4" />
          <h3 className="font-semibold">Planning Status</h3>
        </div>
        <Badge
          variant="outline"
          className="border-havelock-blue text-havelock-blue"
        >
          {site.planningStatus}
        </Badge>
      </div>
    </div>
  );
}
