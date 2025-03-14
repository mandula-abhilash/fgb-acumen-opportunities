"use client";

import { useState } from "react";
import { useGoogleMaps } from "@/contexts/google-maps-context";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { Building2, MapPin } from "lucide-react";

import { getLiveOpportunitySite } from "@/lib/api/liveOpportunities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OpportunitySidebar } from "@/components/explore/opportunity-sidebar";
import { MapLoading } from "@/components/site-map/loading";
import { MapControls } from "@/components/site-map/map-controls";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 53.4808,
  lng: -2.2426,
};

const defaultMapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  rotateControl: false,
  zoomControl: false,
  scrollwheel: true,
  gestureHandling: "greedy",
  minZoom: 6,
  mapTypeId: "hybrid",
};

export function ExploreMap({ opportunities }) {
  const { isLoaded } = useGoogleMaps();
  const [map, setMap] = useState(null);
  const [mapType, setMapType] = useState("hybrid");
  const [zoomLevel, setZoomLevel] = useState(7);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedOpportunityDetails, setSelectedOpportunityDetails] =
    useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMapLoad = (map) => {
    setMap(map);
  };

  const handleMapTypeChange = (type) => {
    setMapType(type);
    if (map) {
      map.setMapTypeId(type);
    }
  };

  const handleZoomChange = (action) => {
    if (map) {
      const currentZoom = map.getZoom();
      const newZoom = action === "in" ? currentZoom + 1 : currentZoom - 1;
      if (newZoom >= 6) {
        map.setZoom(newZoom);
        setZoomLevel(newZoom);
      }
    }
  };

  const handleMarkerClick = async (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsLoading(true);

    try {
      const response = await getLiveOpportunitySite(opportunity.id);
      setSelectedOpportunityDetails(response.data);
      setIsSidebarOpen(true);
    } catch (error) {
      console.error("Error fetching opportunity details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedOpportunity(null);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
    setSelectedOpportunityDetails(null);
    setSelectedOpportunity(null);
  };

  if (!isLoaded) {
    return <MapLoading />;
  }

  return (
    <div className="h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoomLevel}
        center={defaultCenter}
        onLoad={handleMapLoad}
        options={defaultMapOptions}
      >
        {opportunities?.map((opportunity) => (
          <Marker
            key={opportunity.id}
            position={opportunity.coordinates}
            onClick={() => handleMarkerClick(opportunity)}
          />
        ))}

        {selectedOpportunity && !isSidebarOpen && (
          <InfoWindow
            position={selectedOpportunity.coordinates}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="p-2 max-w-sm">
              <h3 className="font-semibold mb-2">
                {selectedOpportunity.site_name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{selectedOpportunity.site_address}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span>{selectedOpportunity.plots} plots</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <Button
                    size="sm"
                    className="bg-web-orange hover:bg-web-orange/90 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkerClick(selectedOpportunity);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}

        <MapControls
          mapType={mapType}
          zoomLevel={zoomLevel}
          onMapTypeChange={handleMapTypeChange}
          onZoomChange={handleZoomChange}
        />
      </GoogleMap>

      <OpportunitySidebar
        opportunity={selectedOpportunityDetails}
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        isLoading={isLoading}
      />
    </div>
  );
}
