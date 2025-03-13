"use client";

import Link from "next/link";
import {
  Building2,
  FileText,
  Globe2,
  Heart,
  Home,
  Landmark,
  MapPin,
  MessageSquareMore,
  ScrollText,
  Store,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function OpportunityCard({ opportunity }) {
  return (
    <Card className="p-4 shadow-md">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Column */}
        <div className="w-full lg:w-[350px] flex-shrink-0">
          <div className="h-[250px] lg:h-[350px] relative rounded-lg overflow-hidden bg-muted">
            <img
              src={opportunity.site_plan_image || "https://placehold.in/400"}
              alt={opportunity.site_name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 flex flex-col">
          {/* Header Section - Clickable */}
          <Link
            href={`/dashboard/opportunities/${opportunity.id}`}
            className="pb-4 group cursor-pointer transition-colors"
          >
            <div className="bg-muted/50 group-hover:bg-muted/100 px-4 py-2 rounded-lg transition-colors">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-havelock-blue transition-colors">
                        {opportunity.site_name}
                      </h3>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-md">
                          {opportunity.site_address}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Click to view full opportunity details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Link>

          {/* Details Section */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 px-1">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">Developer</span>
                </div>
                <p className="font-medium">{opportunity.developer_name}</p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Globe2 className="h-4 w-4" />
                  <span className="text-sm">Region</span>
                </div>
                <p className="font-medium">
                  {opportunity.region_names?.join(", ") || "Not specified"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Landmark className="h-4 w-4" />
                  <span className="text-sm">LPA</span>
                </div>
                <p className="font-medium">
                  {opportunity.lpa_names?.join(", ") || "Not specified"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Opportunity Type</span>
                </div>
                <p className="font-medium">{opportunity.opportunity_type}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Number of Plots</span>
                </div>
                <p className="font-medium">{opportunity.plots} units</p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <ScrollText className="h-4 w-4" />
                  <span className="text-sm">Planning Status</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-web-orange text-web-orange"
                >
                  {opportunity.planning_status}
                </Badge>
              </div>

              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Store className="h-4 w-4" />
                  <span className="text-sm">Purchase Stage</span>
                </div>
                <Badge variant="secondary">
                  {opportunity.land_purchase_status}
                </Badge>
              </div>

              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Home className="h-4 w-4" />
                  <span className="text-sm">Tenures</span>
                </div>
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Shortlist
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Add this site to your shortlisted opportunities</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" className="flex-1">
                    <MessageSquareMore className="h-4 w-4 mr-2" />
                    Confirm Interest
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>We will inform the seller that you are interested</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </Card>
  );
}
