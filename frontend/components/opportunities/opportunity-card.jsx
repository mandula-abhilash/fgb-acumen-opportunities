"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  FileText,
  Globe2,
  Home,
  Landmark,
  MapPin,
  MessageSquareMore,
  ScrollText,
  Store,
  Users,
} from "lucide-react";

import { expressInterest } from "@/lib/api/liveOpportunities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { ShortlistButton } from "@/components/opportunities/shortlist-button";

export function OpportunityCard({ opportunity, onRemove }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmInterest = async () => {
    try {
      setIsSubmitting(true);
      await expressInterest(opportunity.id);
      toast({
        title: "Success",
        description:
          "Your interest has been registered. The site owner will be notified.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to register interest. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to clean LPA names
  const cleanLpaName = (lpa) => {
    return lpa.replace(/ LPA$/, "");
  };

  return (
    <Card className="p-4 shadow-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Column with Overlay */}
          <div className="w-full lg:w-[350px] flex-shrink-0">
            <Link
              href={`/dashboard/opportunities/${opportunity.id}`}
              className="group cursor-pointer"
            >
              <div className="h-[250px] lg:h-[350px] relative rounded-lg overflow-hidden bg-muted">
                <img
                  src={
                    "https://planning-applications-bucket.s3.eu-west-2.amazonaws.com/65ae31514a033c25afd3487b.jpeg?etag=59248ab241972cc690f857dff37b5c71" ||
                    opportunity.site_plan_image ||
                    "https://placehold.in/400"
                  }
                  alt={opportunity.site_name}
                  className="object-cover w-full h-full"
                />
                {/* Overlay Content */}
                <div className="absolute top-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4">
                  <h3 className="text-xl font-semibold mb-2 text-white transition-colors">
                    {opportunity.site_name}
                  </h3>
                  <div className="flex items-center text-white/90">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">
                      {opportunity.site_address}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Content Column */}
          <div className="flex-1 flex flex-col">
            {/* Details Section */}
            <div className="flex-1 bg-muted/50 rounded-lg px-4 py-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">Developer</span>
                    </div>
                    <p className="font-medium text-sm">
                      {opportunity.developer_name}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Globe2 className="h-4 w-4" />
                      <span className="text-sm">Region</span>
                    </div>
                    <p className="font-medium text-sm">
                      {opportunity.region_names?.join(", ") || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Landmark className="h-4 w-4" />
                      <span className="text-sm">LPA</span>
                    </div>
                    <p className="font-medium text-sm">
                      {opportunity.lpa_names?.map(cleanLpaName).join(", ") ||
                        "Not specified"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Opportunity Type</span>
                    </div>
                    <p className="font-medium text-sm">
                      {opportunity.opportunity_type}
                    </p>
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
                    <Badge variant="outline">
                      {opportunity.planning_status}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Store className="h-4 w-4" />
                      <span className="text-sm">Purchase Stage</span>
                    </div>
                    <Badge variant="outline">
                      {opportunity.land_purchase_status}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Home className="h-4 w-4" />
                      <span className="text-sm">Tenures</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(opportunity.tenures) &&
                        opportunity.tenures.map((tenure) => (
                          <Badge key={tenure} variant="outline">
                            {tenure}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-auto justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShortlistButton
                        opportunityId={opportunity.id}
                        isShortlisted={opportunity.is_shortlisted}
                        onRemove={onRemove}
                        className="w-full sm:w-[200px]"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Add this site to your shortlisted opportunities</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full sm:w-[200px] bg-web-orange hover:bg-web-orange/90 text-white"
                        onClick={handleConfirmInterest}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : (
                          <MessageSquareMore className="h-4 w-4 mr-2" />
                        )}
                        {isSubmitting ? "Processing..." : "Confirm Interest"}
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
        </div>
      </div>
    </Card>
  );
}
