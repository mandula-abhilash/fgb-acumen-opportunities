"use client";

import { useState } from "react";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { Card } from "@/components/ui/card";
import { ExploreMap } from "@/components/explore/explore-map";

import { ActionButtons } from "./sections/action-buttons";
import { AdminControls } from "./sections/admin-controls";
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

export function SiteDetailsView({ site: initialSite }) {
  const { user } = useAuth();
  const [site, setSite] = useState(initialSite);
  const canEdit = user?.role === "admin" || user?.id === site.user_id;
  const isAdmin = user?.role === "admin";

  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSiteUpdated = (updatedSite) => {
    setSite(updatedSite);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header Section */}
      <div className="bg-background border rounded-lg shadow-sm">
        <HeaderSection site={site} canEdit={canEdit} />
        <div className="p-4 sm:p-6">
          <KeyDetailsSection site={site} />
          {isAdmin && site.status === "draft" && (
            <div className="mt-6">
              <AdminControls site={site} onSiteUpdated={handleSiteUpdated} />
            </div>
          )}
          <div className="mt-6">
            <ActionButtons opportunity={site} />
          </div>
        </div>
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
              initialZoom={17}
              enableSidebar={false}
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
