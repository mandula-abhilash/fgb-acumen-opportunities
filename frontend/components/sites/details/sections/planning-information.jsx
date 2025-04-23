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
          <div className="mt-1">
            <Badge
              variant="outline"
              className="border-havelock-blue text-havelock-blue"
            >
              {site.planningStatus}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
            <Store className="h-4 w-4" />
            Land Purchase Status
          </h3>
          <div className="mt-1">
            <Badge variant="outline">{site.landPurchaseStatus}</Badge>
          </div>
        </div>

        {(site.planning_application_reference ||
          site.planning_application_url) && (
          <div>
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              Planning Application
            </h3>
            <div className="space-y-2">
              {site.planning_application_reference && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Reference:</span>
                  <span className="text-sm">
                    {site.planning_application_reference}
                  </span>
                </div>
              )}
              {site.planning_application_url && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Application URL:</span>
                  <a
                    href={site.planning_application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Application
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
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
            <p className="text-sm whitespace-pre-wrap">
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
            <p className="text-sm whitespace-pre-wrap">
              {site.proposedDevelopment}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
