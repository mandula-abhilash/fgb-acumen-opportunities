"use client";

import { useEffect, useState } from "react";
import { useGoogleMaps } from "@/contexts/google-maps-context";
import { GoogleMap } from "@react-google-maps/api";

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
  mapTypeId: "satellite",
};

function CustomMarker({ position, plots, onClick }) {
  const [marker, setMarker] = useState(null);

  const createCustomMarker = () => {
    const div = document.createElement("div");
    div.className = "relative";

    const markerContent = `
      <div class="relative cursor-pointer">
        <div class="absolute -top-8 -left-4 transform-gpu">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#F09C00" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"/>
              <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2"/>
              <path d="M18 22v-3"/>
              <circle cx="10" cy="10" r="3"/>
            </svg>
          </div>
          <div class="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded">
            ${plots} homes
          </div>
        </div>
      </div>
    `;

    div.innerHTML = markerContent;

    // Create the actual marker
    const marker = new google.maps.Marker({
      position,
      map: window.map,
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent('<svg width="1" height="1"></svg>'),
        anchor: new google.maps.Point(0, 0),
      },
    });

    // Create an overlay
    const overlay = new google.maps.OverlayView();
    overlay.setMap(window.map);

    overlay.onAdd = function () {
      overlay.getPanes().overlayMouseTarget.appendChild(div);
    };

    overlay.draw = function () {
      const projection = overlay.getProjection();
      const point = projection.fromLatLngToDivPixel(marker.getPosition());

      if (point) {
        div.style.left = point.x + "px";
        div.style.top = point.y + "px";
      }
    };

    // Add click handler
    div.addEventListener("click", onClick);

    return marker;
  };

  useEffect(() => {
    if (window.google && window.map) {
      const newMarker = createCustomMarker();
      setMarker(newMarker);

      return () => {
        if (marker) {
          marker.setMap(null);
        }
      };
    }
  }, [window.google, window.map, position]);

  return null;
}

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
    window.map = map;
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
          <CustomMarker
            key={opportunity.id}
            position={opportunity.coordinates}
            plots={opportunity.plots}
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
