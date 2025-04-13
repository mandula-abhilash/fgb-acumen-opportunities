"use client";

import { ExternalLink, FileText, ScrollText, Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function PlanningInformation({ site }) {
  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-havelock-blue mb-4">
        Planning Information
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
            <ScrollText className="h-4 w-4" />
            Planning Status
          </h3>
          <Badge
            variant="outline"
            className="border-havelock-blue text-havelock-blue"
          >
            {site.planningStatus}
          </Badge>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
            <Store className="h-4 w-4" />
            Land Purchase Status
          </h3>
          <Badge variant="outline" className="text-foreground">
            {site.landPurchaseStatus}
          </Badge>
        </div>

        {(site.planningApplicationReference || site.planningApplicationUrl) && (
          <div>
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              Planning Application
            </h3>
            <div className="space-y-2">
              {site.planningApplicationReference && (
                <p className="text-sm">
                  <span className="font-medium">Reference:</span>{" "}
                  {site.planningApplicationReference}
                </p>
              )}
              {site.planningApplicationUrl && (
                <a
                  href={site.planningApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Planning Application
                </a>
              )}
            </div>
          </div>
        )}

        {site.planningOverview && (
          <div>
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              Planning Overview
            </h3>
            <p className="text-foreground whitespace-pre-wrap">
              {site.planningOverview}
            </p>
          </div>
        )}

        {site.proposedDevelopment && (
          <div>
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              Proposed Development
            </h3>
            <p className="text-foreground whitespace-pre-wrap">
              {site.proposedDevelopment}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
