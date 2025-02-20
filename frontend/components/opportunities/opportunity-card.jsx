"use client";

import Link from "next/link";
import { Building2, MapPin } from "lucide-react";

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
              src={opportunity.image || "https://via.placeholder.com/400x300"}
              alt={opportunity.title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Data Column */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{opportunity.type}</Badge>
              <Badge
                variant="outline"
                className="border-web-orange text-web-orange"
              >
                {opportunity.planningStatus}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{opportunity.location}</span>
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
              <p className="font-medium">{opportunity.purchaseStatus}</p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">LPA</div>
              <p className="font-medium">{opportunity.lpa}</p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Region</div>
              <p className="font-medium">{opportunity.region}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Tenures</div>
            <div className="flex flex-wrap gap-2">
              {opportunity.tenures.map((tenure) => (
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
            <div className="text-sm text-muted-foreground mb-1">
              Guide Price
            </div>
            <p className="text-xl font-bold text-web-orange">
              {opportunity.price}
            </p>
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
