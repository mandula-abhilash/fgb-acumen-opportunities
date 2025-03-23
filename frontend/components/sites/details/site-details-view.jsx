"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import {
  Building2,
  Calendar,
  Clock,
  Edit2,
  FileText,
  Globe2,
  Heart,
  Home,
  Info,
  Landmark,
  MapPin,
  MessageSquareMore,
  PoundSterling,
  ScrollText,
  Store,
  Users,
} from "lucide-react";

import { expressInterest } from "@/lib/api/liveOpportunities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ExploreMap } from "@/components/explore/explore-map";
import { ShortlistButton } from "@/components/opportunities/shortlist-button";

export function SiteDetailsView({ site }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = user?.role === "admin" || user?.id === site.user_id;

  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleEditClick = () => {
    // Store site data in sessionStorage before navigating
    sessionStorage.setItem("editSiteData", JSON.stringify(site));
    router.push(`/dashboard/opportunities/${site.id}/edit`);
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
      <div className="bg-web-orange/5 border rounded-lg p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-web-orange">
                <Building2 className="h-5 w-5 flex-shrink-0" />
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {site.siteName}
                </h1>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <p className="text-base sm:text-lg">
                  {site.customSiteAddress || site.siteAddress}
                </p>
              </div>
            </div>
            {canEdit && (
              <Button
                onClick={handleEditClick}
                size="sm"
                className="bg-web-orange hover:bg-web-orange/90 text-white shadow-lg w-full sm:w-auto"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Site
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-background/40 shadow-md rounded-lg p-4">
              <div className="flex items-center gap-2 text-web-orange mb-2">
                <Store className="h-4 w-4" />
                <h3 className="font-semibold">Opportunity Type</h3>
              </div>
              <Badge variant="outline" className="capitalize">
                {site.opportunityType.replace(/-/g, " ")}
              </Badge>
            </div>

            <div className="bg-background/40 shadow-md rounded-lg p-4">
              <div className="flex items-center gap-2 text-web-orange mb-2">
                <Users className="h-4 w-4" />
                <h3 className="font-semibold">Number of Plots</h3>
              </div>
              <p className="text-lg font-medium">{site.plots} units</p>
            </div>

            <div className="bg-background/40 shadow-md rounded-lg p-4">
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

          <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-6">
            <ShortlistButton
              opportunityId={site.id}
              isShortlisted={site.is_shortlisted}
              className="w-full sm:w-[200px] shadow-lg"
            />
            <Button
              variant="secondary"
              className="w-full sm:w-[200px] shadow-lg bg-background hover:bg-accent"
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
      </div>

      {/* Image and Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Plan Image */}
        <Card className="overflow-hidden shadow-lg">
          <div className="relative h-[400px]">
            <img
              src={
                "https://planning-applications-bucket.s3.eu-west-2.amazonaws.com/65ae31514a033c25afd3487b.jpeg?etag=59248ab241972cc690f857dff37b5c71" ||
                site.sitePlanImage ||
                "https://placehold.in/400"
              }
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
          <h2 className="text-xl font-semibold text-havelock-blue mb-4">
            Developer Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                <Building2 className="h-4 w-4" />
                Developer Name
              </h3>
              <p className="text-foreground">{site.developerName}</p>
            </div>
            {site.developer_region_names?.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <Globe2 className="h-4 w-4" />
                  Developer Regions
                </h3>
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
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <Info className="h-4 w-4" />
                  Additional Information
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {site.developerInfo}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-havelock-blue mb-4">
            Location Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                <Globe2 className="h-4 w-4" />
                Regions
              </h3>
              <div className="flex flex-wrap gap-2">
                {site.region_names?.map((region) => (
                  <Badge key={region} variant="outline">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                <Landmark className="h-4 w-4" />
                Local Planning Authorities
              </h3>
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
          <h2 className="text-xl font-semibold text-havelock-blue mb-4">
            Planning Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                <Store className="h-4 w-4" />
                Land Purchase Status
              </h3>
              <Badge variant="outline" className="text-foreground">
                {site.landPurchaseStatus}
              </Badge>
            </div>
            {site.planningOverview && (
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <ScrollText className="h-4 w-4" />
                  Planning Overview
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {site.planningOverview}
                </p>
              </div>
            )}
            {site.proposedDevelopment && (
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <Building2 className="h-4 w-4" />
                  Proposed Development
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {site.proposedDevelopment}
                </p>
              </div>
            )}
            {site.siteContext && (
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <Info className="h-4 w-4" />
                  Site Context
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {site.siteContext}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-havelock-blue mb-4">
            Timeline
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  Start on Site
                </h3>
                <p className="text-foreground">
                  {formatDate(site.startOnSiteDate)}
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  First Handover
                </h3>
                <p className="text-foreground">
                  {formatDate(site.firstHandoverDate)}
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  Final Handover
                </h3>
                <p className="text-foreground">
                  {formatDate(site.finalHandoverDate)}
                </p>
              </div>
            </div>
            {site.projectProgramme && (
              <div>
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

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-havelock-blue mb-4">
            Tenure Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                <Home className="h-4 w-4" />
                Tenures
              </h3>
              <div className="flex flex-wrap gap-2">
                {site.tenures?.map((tenure) => (
                  <Badge
                    key={tenure}
                    variant="outline"
                    className="text-foreground"
                  >
                    {tenure}
                  </Badge>
                ))}
              </div>
            </div>
            {site.detailedTenureAccommodation && (
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <Info className="h-4 w-4" />
                  Detailed Tenure & Accommodation
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {site.detailedTenureAccommodation}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-havelock-blue mb-4">
            Commercial Information
          </h2>
          <div className="space-y-4">
            {site.paymentTerms && (
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <PoundSterling className="h-4 w-4" />
                  Payment Terms
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {site.paymentTerms}
                </p>
              </div>
            )}
            {site.vatPosition && (
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <PoundSterling className="h-4 w-4" />
                  VAT Position
                </h3>
                <p className="text-foreground">{site.vatPosition}</p>
              </div>
            )}
            {site.agentTerms && (
              <div>
                <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  Agent Terms
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
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
          <h2 className="text-xl font-semibold text-havelock-blue mb-4">
            Documents
          </h2>
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
