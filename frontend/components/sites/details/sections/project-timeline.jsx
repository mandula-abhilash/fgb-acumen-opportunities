"use client";

import { Calendar } from "lucide-react";

import { Card } from "@/components/ui/card";

export function ProjectTimeline({ site, formatDate }) {
  const renderDateRow = (label, date) => {
    if (!date) return null;
    return (
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{formatDate(date)}</span>
      </div>
    );
  };

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-havelock-blue mb-4">
        Project Timeline
      </h2>
      <div className="space-y-4">
        {renderDateRow("Planning Submission", site.planningSubmissionDate)}
        {renderDateRow(
          "Planning Determination",
          site.planningDeterminationDate
        )}
        {renderDateRow("Start on Site", site.startOnSiteDate)}
        {renderDateRow("First Golden Brick", site.firstGoldenBrickDate)}
        {renderDateRow("Final Golden Brick", site.finalGoldenBrickDate)}
        {renderDateRow("First Handover", site.firstHandoverDate)}
        {renderDateRow("Final Handover", site.finalHandoverDate)}

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
