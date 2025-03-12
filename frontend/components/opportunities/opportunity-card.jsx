"use client";

import Link from "next/link";
import { Building2, Heart, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function OpportunityCard({ opportunity }) {
  return (
    <Card className="p-4 shadow-md">
      <div className="flex gap-6">
        {/* Image Column - Fixed width */}
        <div className="w-[350px] flex-shrink-0">
          <div className="h-[350px] relative rounded-lg overflow-hidden bg-muted">
            <img
              src={opportunity.site_plan_image || "https://placehold.in/400"}
              alt={opportunity.site_name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Basic Site Details Column */}
        <div className="w-1/3 flex flex-col">
          <h3 className="text-xl font-semibold mb-2">
            {opportunity.site_name}
          </h3>
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{opportunity.site_address}</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Developer
              </div>
              <p className="font-medium">{opportunity.developer_name}</p>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Tenures</div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(opportunity.tenures) &&
                  opportunity.tenures.map((tenure) => (
                    <Badge key={tenure} variant="secondary">
                      {tenure}
                    </Badge>
                  ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Region</div>
              <p className="font-medium">
                {opportunity.region_names?.join(", ") || "Not specified"}
              </p>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">LPA</div>
              <p className="font-medium">
                {opportunity.lpa_names?.join(", ") || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Details Column */}
        <div className="w-1/3 flex flex-col">
          <div className="space-y-3 flex-1">
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Number of Plots</span>
              </div>
              <p className="font-medium">{opportunity.plots} units</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Opportunity Type</span>
              </div>
              <p className="font-medium">{opportunity.opportunity_type}</p>
            </div>

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
