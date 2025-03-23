"use client";

import { Calendar } from "lucide-react";

import { Card } from "@/components/ui/card";

export function ProjectTimeline({ site, formatDate }) {
  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-havelock-blue mb-4">
        Project Timeline
      </h2>
      <div className="space-y-4">
        {site.startOnSiteDate && (
          <div className="flex justify-between items-center">
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Start on Site
            </h3>
            <span className="text-sm font-medium">
              {formatDate(site.startOnSiteDate)}
            </span>
          </div>
        )}

        {site.firstHandoverDate && (
          <div className="flex justify-between items-center">
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              First Handover
            </h3>
            <span className="text-sm font-medium">
              {formatDate(site.firstHandoverDate)}
            </span>
          </div>
        )}

        {site.finalHandoverDate && (
          <div className="flex justify-between items-center">
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Final Handover
            </h3>
            <span className="text-sm font-medium">
              {formatDate(site.finalHandoverDate)}
            </span>
          </div>
        )}

        {site.projectProgramme && (
          <div className="pt-2 border-t">
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              Project Programme
            </h3>
            <p className="text-foreground whitespace-pre-wrap">
              {site.projectProgramme}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
