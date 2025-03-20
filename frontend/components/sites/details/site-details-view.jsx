"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Edit2,
  ExternalLink,
  FileText,
  Globe2,
  GripHorizontal,
  Home,
  Info,
  Landmark,
  MapPin,
  MessageSquareMore,
  Pencil,
  PoundSterling,
  ScrollText,
  Store,
  Users,
} from "lucide-react";

import { expressInterest } from "@/lib/api/liveOpportunities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { ExploreMap } from "@/components/explore/explore-map";
import { ShortlistButton } from "@/components/opportunities/shortlist-button";

export function SiteDetailsView({ site }) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = user?.role === "admin" || user?.id === site.user_id;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleConfirmInterest = async () => {
    try {
      setIsSubmitting(true);
      await expressInterest(site.id);
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

  return (
    <div className="flex flex-col space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-web-orange/10 via-web-orange/5 to-transparent border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-web-orange">
              <Building2 className="h-5 w-5" />
              <h1 className="text-3xl font-bold">{site.siteName}</h1>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <p className="text-lg">
                {site.customSiteAddress || site.siteAddress}
              </p>
            </div>
          </div>
          {canEdit && (
            <Button
              onClick={() =>
                router.push(`/dashboard/opportunities/${site.id}/edit`)
              }
              className="bg-web-orange hover:bg-web-orange/90 text-white shadow-lg"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Site
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-background/40 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 text-web-orange mb-2">
              <GripHorizontal className="h-4 w-4" />
              <h3 className="font-semibold">Opportunity Type</h3>
            </div>
            <Badge variant="outline" className="capitalize">
              {site.opportunityType.replace(/-/g, " ")}
            </Badge>
          </div>

          <div className="bg-background/40 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 text-web-orange mb-2">
              <Users className="h-4 w-4" />
              <h3 className="font-semibold">Number of Plots</h3>
            </div>
            <p className="text-lg font-medium">{site.plots} units</p>
          </div>

          <div className="bg-background/40 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 text-web-orange mb-2">
              <ScrollText className="h-4 w-4" />
              <h3 className="font-semibold">Planning Status</h3>
            </div>
            <Badge
              variant="outline"
              className="border-web-orange text-web-orange"
            >
              {site.planningStatus}
            </Badge>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <ShortlistButton
            opportunityId={site.id}
            isShortlisted={site.is_shortlisted}
            className="flex-1 shadow-lg"
          />
          <Button
            variant="secondary"
            className="flex-1 shadow-lg bg-background hover:bg-accent"
            onClick={handleConfirmInterest}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <MessageSquareMore className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? "Confirming..." : "Confirm Interest"}
          </Button>
        </div>
      </div>

      {/* Image and Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Plan Image */}
        <Card className="overflow-hidden shadow-lg">
          <div className="relative h-[400px]">
            <img
              src={site.sitePlanImage || "https://placehold.in/600x400"}
              alt={site.siteName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold mb-1">Site Plan</h3>
                <p className="text-sm opacity-90">
                  Visual representation of the development
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Map */}
        <Card className="overflow-hidden shadow-lg">
          <div className="h-[400px]">
            <ExploreMap
              opportunities={[site]}
              initialCenter={site.coordinates}
              initialZoom={15}
            />
          </div>
        </Card>
      </div>

      {/* Key Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-havelock-blue mb-4">
            <Building2 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Developer Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                <h3 className="font-medium">Developer Name</h3>
              </div>
              <p>{site.developerName}</p>
            </div>
            {site.developer_region_names?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Globe2 className="h-4 w-4" />
                  <h3 className="font-medium">Developer Regions</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {site.developer_region_names.map((region) => (
                    <Badge key={region} variant="secondary" className="text-xs">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {site.developerInfo && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Info className="h-4 w-4" />
                  <h3 className="font-medium">Additional Information</h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {site.developerInfo}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-havelock-blue mb-4">
            <Globe2 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Location Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <h3 className="font-medium">Regions</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {site.region_names?.map((region) => (
                  <Badge key={region} variant="outline">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Landmark className="h-4 w-4" />
                <h3 className="font-medium">Local Planning Authorities</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {site.lpa_names?.map((lpa) => (
                  <Badge key={lpa} variant="secondary" className="text-xs">
                    {lpa}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-havelock-blue mb-4">
            <ScrollText className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Planning Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Store className="h-4 w-4" />
                <h3 className="font-medium">Land Purchase Status</h3>
              </div>
              <Badge variant="outline">{site.landPurchaseStatus}</Badge>
            </div>
            {site.planningOverview && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Info className="h-4 w-4" />
                  <h3 className="font-medium">Planning Overview</h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {site.planningOverview}
                </p>
              </div>
            )}
            {site.proposedDevelopment && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Building2 className="h-4 w-4" />
                  <h3 className="font-medium">Proposed Development</h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {site.proposedDevelopment}
                </p>
              </div>
            )}
            {site.siteContext && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Info className="h-4 w-4" />
                  <h3 className="font-medium">Site Context</h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {site.siteContext}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-havelock-blue mb-4">
            <Calendar className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Timeline</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <h3 className="font-medium">Start on Site</h3>
                </div>
                <p>{formatDate(site.startOnSiteDate)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <h3 className="font-medium">First Handover</h3>
                </div>
                <p>{formatDate(site.firstHandoverDate)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <h3 className="font-medium">Final Handover</h3>
                </div>
                <p>{formatDate(site.finalHandoverDate)}</p>
              </div>
            </div>
            {site.projectProgramme && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <h3 className="font-medium">Project Programme</h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {site.projectProgramme}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-havelock-blue mb-4">
            <Home className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Tenure Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Home className="h-4 w-4" />
                <h3 className="font-medium">Tenures</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {site.tenures?.map((tenure) => (
                  <Badge key={tenure} variant="outline">
                    {tenure}
                  </Badge>
                ))}
              </div>
            </div>
            {site.detailedTenureAccommodation && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Info className="h-4 w-4" />
                  <h3 className="font-medium">
                    Detailed Tenure & Accommodation
                  </h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {site.detailedTenureAccommodation}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-havelock-blue mb-4">
            <PoundSterling className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Commercial Information</h2>
          </div>
          <div className="space-y-4">
            {site.paymentTerms && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <PoundSterling className="h-4 w-4" />
                  <h3 className="font-medium">Payment Terms</h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {site.paymentTerms}
                </p>
              </div>
            )}
            {site.vatPosition && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <PoundSterling className="h-4 w-4" />
                  <h3 className="font-medium">VAT Position</h3>
                </div>
                <p className="text-muted-foreground">{site.vatPosition}</p>
              </div>
            )}
            {site.agentTerms && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  <h3 className="font-medium">Agent Terms</h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {site.agentTerms}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Documents Section */}
      {(site.proposedSpecification || site.s106Agreement) && (
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-havelock-blue mb-4">
            <FileText className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Documents</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {site.proposedSpecification && (
              <Link
                href={site.proposedSpecification}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border rounded-lg hover:bg-accent group transition-colors"
              >
                <FileText className="h-5 w-5 mr-2 text-web-orange group-hover:text-web-orange/80" />
                <span>View Proposed Specification</span>
              </Link>
            )}
            {site.s106Agreement && (
              <Link
                href={site.s106Agreement}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border rounded-lg hover:bg-accent group transition-colors"
              >
                <FileText className="h-5 w-5 mr-2 text-web-orange group-hover:text-web-orange/80" />
                <span>View Section 106 Agreement</span>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
