"use client";

import { useState } from "react";
import { useGoogleMaps } from "@/contexts/google-maps-context";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { Building2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapLoading } from "@/components/site-map/loading";
import { MapControls } from "@/components/site-map/map-controls";

// Dummy data for demonstration
const opportunities = [
  {
    id: 1,
    title: "Riverside Development Site",
    location: "Manchester City Center",
    coordinates: { lat: 53.4808, lng: -2.2426 },
    plots: 120,
    planningStatus: "Outline Approval",
    purchaseStatus: "Land Offer Stage",
    price: "£4.2M",
  },
  {
    id: 2,
    title: "Urban Regeneration Project",
    location: "Liverpool Docklands",
    coordinates: { lat: 53.4084, lng: -2.9916 },
    plots: 85,
    planningStatus: "Full Approval",
    purchaseStatus: "Heads of Terms Agreed",
    price: "£3.8M",
  },
  {
    id: 3,
    title: "City Center Development",
    location: "Leeds City Square",
    coordinates: { lat: 53.7967, lng: -1.5483 },
    plots: 150,
    planningStatus: "Full Approval",
    purchaseStatus: "Purchase Completed",
    price: "£5.2M",
  },
];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.375rem",
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

export function ExploreMap() {
  const { isLoaded } = useGoogleMaps();
  const [map, setMap] = useState(null);
  const [mapType, setMapType] = useState("hybrid");
  const [zoomLevel, setZoomLevel] = useState(7);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

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

  if (!isLoaded) {
    return <MapLoading />;
  }

  return (
    <Card className="h-full relative rounded-md overflow-hidden">
      <div className="h-full">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoomLevel}
          center={defaultCenter}
          onLoad={handleMapLoad}
          options={defaultMapOptions}
        >
          {opportunities.map((opportunity) => (
            <Marker
              key={opportunity.id}
              position={opportunity.coordinates}
              onClick={() => setSelectedOpportunity(opportunity)}
            />
          ))}

          {selectedOpportunity && (
            <InfoWindow
              position={selectedOpportunity.coordinates}
              onCloseClick={() => setSelectedOpportunity(null)}
            >
              <div className="p-2 max-w-sm">
                <h3 className="font-semibold mb-2">
                  {selectedOpportunity.title}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{selectedOpportunity.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span>{selectedOpportunity.plots} plots</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-web-orange">
                      {selectedOpportunity.price}
                    </span>
                    <Button
                      size="sm"
                      className="bg-web-orange hover:bg-web-orange/90 text-white"
                      onClick={() => {
                        // Handle view details
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
      </div>
    </Card>
  );
}
