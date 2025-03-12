"use client";

import Link from "next/link";
import { Building2, Heart, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function OpportunityCard({ opportunity }) {
  return (
    <Card className="p-6">
      <div className="flex gap-6">
        {/* Image Column */}
        <div className="w-1/3">
          <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-muted">
            <img
              src={opportunity.site_plan_image || "https://placehold.in/400"}
              alt={opportunity.site_name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  {opportunity.opportunity_type}
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

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Developer
                </div>
                <p className="font-medium">{opportunity.developer_name}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">Plots</span>
                </div>
                <p className="font-medium">{opportunity.plots} units</p>
              </div>
            </div>

            {/* Tenures */}
            <div className="space-y-2">
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

            {/* Status Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Planning Status
                </div>
                <Badge
                  variant="outline"
                  className="border-web-orange text-web-orange"
                >
                  {opportunity.planning_status}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Purchase Stage
                </div>
                <Badge variant="outline">
                  {opportunity.land_purchase_status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 mt-4 border-t">
            <Button className="flex-1 bg-web-orange hover:bg-web-orange/90 text-white">
              View Details
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="h-4 w-4 mr-2" />
              Shortlist
            </Button>
            <Button variant="secondary" className="flex-1">
              Confirm Interest
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
