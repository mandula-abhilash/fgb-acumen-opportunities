"use client";

import Link from "next/link";
import {
  Building2,
  Calendar,
  FileText,
  Globe2,
  Heart,
  Home,
  Info,
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
import { Separator } from "@/components/ui/separator";

export function OpportunityDetails({ opportunity }) {
  if (!opportunity) return null;

  return (
    <div className="flex flex-col h-full border-l shadow-lg">
      {/* Header Section - Fixed */}
      <div className="flex flex-col space-y-1 p-3 bg-muted/30 border-b">
        <h2 className="text-lg font-bold text-web-orange">
          {opportunity.site_name}
        </h2>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="text-xs">{opportunity.site_address}</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Image Section */}
        <div className="relative w-full h-[200px] border-b">
          <img
            src={
              "https://planning-applications-bucket.s3.eu-west-2.amazonaws.com/65ae31514a033c25afd3487b.jpeg?etag=59248ab241972cc690f857dff37b5c71" ||
              opportunity.site_plan_image ||
              "https://placehold.in/400"
            }
            alt={opportunity.site_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="p-3 space-y-4">
          {/* Key Details */}
          <Card className="overflow-hidden border border-web-orange/20">
            <div className="grid grid-cols-2 divide-x">
              <div className="p-2 space-y-0.5 bg-web-orange/5">
                <span className="text-xs text-muted-foreground">Plots</span>
                <p className="text-lg font-bold text-web-orange">
                  {opportunity.plots}
                </p>
              </div>
              <div className="p-2 space-y-0.5 bg-web-orange/5">
                <span className="text-xs text-muted-foreground">Type</span>
                <p className="text-sm font-medium">
                  {opportunity.opportunity_type}
                </p>
              </div>
            </div>
          </Card>

          {/* Developer Info */}
          <div className="space-y-2 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-web-orange">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-semibold">
                Developer Information
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">Name</span>
                <p className="text-sm">{opportunity.developer_name}</p>
              </div>
              {opportunity.developer_info && (
                <div>
                  <span className="text-xs text-muted-foreground">
                    Additional Info
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.developer_info}
                  </p>
                </div>
              )}
              {opportunity.developer_region && (
                <div>
                  <span className="text-xs text-muted-foreground">
                    Developer Regions
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {opportunity.developer_region.map((region) => (
                      <Badge
                        key={region}
                        variant="secondary"
                        className="text-xs"
                      >
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-web-orange">
              <Globe2 className="h-4 w-4" />
              <span className="text-xs font-semibold">
                Location Information
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">Regions</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {opportunity.region_names?.map((region) => (
                    <Badge key={region} variant="secondary" className="text-xs">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground">
                  Local Planning Authorities
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {opportunity.lpa_names?.map((lpa) => (
                    <Badge key={lpa} variant="secondary" className="text-xs">
                      {lpa}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Planning Info */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-web-orange">
              <ScrollText className="h-4 w-4" />
              <span className="text-xs font-semibold">
                Planning Information
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">
                  Planning Status
                </span>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className="text-xs border-web-orange text-web-orange"
                  >
                    {opportunity.planning_status}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground">
                  Land Purchase Status
                </span>
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs">
                    {opportunity.land_purchase_status}
                  </Badge>
                </div>
              </div>

              {opportunity.planning_overview && (
                <div>
                  <span className="text-xs text-muted-foreground">
                    Planning Overview
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.planning_overview}
                  </p>
                </div>
              )}

              {opportunity.proposed_development && (
                <div>
                  <span className="text-xs text-muted-foreground">
                    Proposed Development
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.proposed_development}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tenure Info */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-web-orange">
              <Home className="h-4 w-4" />
              <span className="text-xs font-semibold">Tenure Information</span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">Tenures</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.isArray(opportunity.tenures) &&
                    opportunity.tenures.map((tenure) => (
                      <Badge key={tenure} variant="outline" className="text-xs">
                        {tenure}
                      </Badge>
                    ))}
                </div>
              </div>

              {opportunity.detailed_tenure_accommodation && (
                <div>
                  <span className="text-xs text-muted-foreground">
                    Detailed Accommodation
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.detailed_tenure_accommodation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Commercial Info */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-web-orange">
              <Store className="h-4 w-4" />
              <span className="text-xs font-semibold">
                Commercial Information
              </span>
            </div>

            <div className="space-y-2">
              {opportunity.payment_terms && (
                <div>
                  <span className="text-xs text-muted-foreground">
                    Payment Terms
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.payment_terms}
                  </p>
                </div>
              )}

              {opportunity.vat_position && (
                <div>
                  <span className="text-xs text-muted-foreground">
                    VAT Position
                  </span>
                  <p className="text-sm">{opportunity.vat_position}</p>
                </div>
              )}

              {opportunity.agent_terms && (
                <div>
                  <span className="text-xs text-muted-foreground">
                    Agent Terms
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.agent_terms}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-web-orange">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-semibold">Project Timeline</span>
            </div>

            <div className="space-y-2">
              {opportunity.start_on_site_date && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Start on Site
                  </span>
                  <span className="text-xs font-medium">
                    {new Date(
                      opportunity.start_on_site_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}

              {opportunity.first_handover_date && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    First Handover
                  </span>
                  <span className="text-xs font-medium">
                    {new Date(
                      opportunity.first_handover_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}

              {opportunity.final_handover_date && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Final Handover
                  </span>
                  <span className="text-xs font-medium">
                    {new Date(
                      opportunity.final_handover_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}

              {opportunity.project_programme && (
                <div className="pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Project Programme
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.project_programme}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="p-3 border-t bg-background/95 backdrop-blur-sm">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border hover:bg-web-orange/5 h-8 text-xs"
          >
            <Heart className="h-3 w-3 mr-1.5" />
            Shortlist
          </Button>
          <Button className="flex-1 bg-web-orange hover:bg-web-orange/90 text-white h-8 text-xs">
            <MessageSquareMore className="h-3 w-3 mr-1.5" />
            Confirm Interest
          </Button>
        </div>
      </div>
    </div>
  );
}
