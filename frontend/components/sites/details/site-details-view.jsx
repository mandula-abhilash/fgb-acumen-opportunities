"use client";

import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { Card } from "@/components/ui/card";
import { ExploreMap } from "@/components/explore/explore-map";

import { ActionButtons } from "./sections/action-buttons";
import { CommercialInformation } from "./sections/commercial-information";
import { DeveloperInformation } from "./sections/developer-information";
import { DocumentsSection } from "./sections/documents-section";
import { HeaderSection } from "./sections/header-section";
import { ImageSection } from "./sections/image-section";
import { KeyDetailsSection } from "./sections/key-details-section";
import { LocationInformation } from "./sections/location-information";
import { PlanningInformation } from "./sections/planning-information";
import { ProjectTimeline } from "./sections/project-timeline";
import { TenureInformation } from "./sections/tenure-information";

export function SiteDetailsView({ site }) {
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.id === site.user_id;

  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header Section */}
      <div className="bg-web-orange/5 border rounded-lg p-4 sm:p-6">
        <HeaderSection site={site} canEdit={canEdit} />
        <KeyDetailsSection site={site} />
        <ActionButtons site={site} />
      </div>

      {/* Image and Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Plan Image */}
        <Card className="overflow-hidden shadow-lg">
          <div className="relative h-[400px]">
            <ImageSection site={site} />
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
        <DeveloperInformation site={site} />
        <LocationInformation site={site} />
        <PlanningInformation site={site} />
        <ProjectTimeline site={site} formatDate={formatDate} />
        <TenureInformation site={site} />
        <CommercialInformation site={site} />
      </div>

      {/* Documents Section */}
      {(site.proposedSpecification || site.s106Agreement) && (
        <DocumentsSection site={site} />
      )}
    </div>
  );
}
