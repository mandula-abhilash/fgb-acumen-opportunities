"use client";

import { useState } from "react";
import { useGoogleMaps } from "@/contexts/google-maps-context";
import { GoogleMap, Marker } from "@react-google-maps/api";

import { getLiveOpportunitySite } from "@/lib/api/liveOpportunities";
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

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
    setSelectedOpportunityDetails(null);
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
