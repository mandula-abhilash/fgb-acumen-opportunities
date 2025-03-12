"use client";

import Link from "next/link";
import { Building2, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function OpportunityCard({ opportunity }) {
  // Format date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        {/* Image Column */}
        <div className="w-1/3">
          <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-muted">
            <img
              src={
                opportunity.site_plan_image ||
                "https://via.placeholder.com/400x300"
              }
              alt={opportunity.site_name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Data Column */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{opportunity.opportunity_type}</Badge>
              <Badge
                variant="outline"
                className="border-web-orange text-web-orange"
              >
                {opportunity.planning_status}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {opportunity.site_name}
            </h3>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{opportunity.site_address}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Number of Plots</span>
              </div>
              <p className="font-medium">{opportunity.plots} units</p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Purchase Status
              </div>
              <p className="font-medium">{opportunity.land_purchase_status}</p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">LPA</div>
              <p className="font-medium">
                {Array.isArray(opportunity.lpa)
                  ? opportunity.lpa.join(", ")
                  : opportunity.lpa}
              </p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Region</div>
              <p className="font-medium">
                {Array.isArray(opportunity.region)
                  ? opportunity.region.join(", ")
                  : opportunity.region}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Key Dates</div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start on Site</p>
                <p className="font-medium">
                  {formatDate(opportunity.start_on_site_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">First Handover</p>
                <p className="font-medium">
                  {formatDate(opportunity.first_handover_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Final Handover</p>
                <p className="font-medium">
                  {formatDate(opportunity.final_handover_date)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Tenures</div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(opportunity.tenures) &&
                opportunity.tenures.map((tenure) => (
                  <Badge key={tenure} variant="secondary">
                    {tenure}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* Actions Column */}
        <div className="w-48 flex flex-col justify-between">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Developer</div>
            <p className="text-lg font-medium">{opportunity.developer_name}</p>
          </div>
          <div className="space-y-2">
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-web-orange font-semibold shadow-md border border-web-orange">
              View Details
            </Button>
            <Button variant="outline" className="w-full">
              Shortlist
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
