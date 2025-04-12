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

export function ExploreMap({
  opportunities,
  enableSidebar = true,
  initialCenter = defaultCenter,
  initialZoom = 7,
}) {
  const { isLoaded } = useGoogleMaps();
  const [map, setMap] = useState(null);
  const [mapType, setMapType] = useState("hybrid");
  const [zoomLevel, setZoomLevel] = useState(initialZoom);
  const [selectedOpportunityDetails, setSelectedOpportunityDetails] =
    useState(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialBoundsFitted, setInitialBoundsFitted] = useState(false);

  const handleMapLoad = (map) => {
    setMap(map);
    window.map = map;

    // If we have a single opportunity and initialZoom is provided, use those
    if (opportunities?.length === 1 && initialZoom) {
      map.setZoom(initialZoom);
      map.setCenter(opportunities[0].coordinates);
    }
    // Otherwise fit bounds if we have multiple opportunities
    else if (opportunities?.length > 0) {
      fitBoundsToMarkers(map, opportunities);
    }
    // If no opportunities, center on initialCenter
    else {
      map.setCenter(initialCenter);
      map.setZoom(initialZoom);
    }

    setInitialBoundsFitted(true);
  };

  // Function to fit map bounds to all markers
  const fitBoundsToMarkers = (map, markers) => {
    if (!map || !markers?.length) return;

    const bounds = new google.maps.LatLngBounds();

    // Extend bounds with each marker position
    markers.forEach((marker) => {
      if (marker.coordinates?.lat && marker.coordinates?.lng) {
        bounds.extend(
          new google.maps.LatLng(marker.coordinates.lat, marker.coordinates.lng)
        );
      }
    });

    // Fit the map to the bounds
    map.fitBounds(bounds);

    // Add some padding
    const padding = {
      top: 50,
      right: isSidebarOpen ? 500 : 50, // Account for sidebar if open
      bottom: 50,
      left: 50,
    };

    map.panToBounds(bounds, padding);

    // Update zoom level state
    setZoomLevel(map.getZoom());
  };

  // Effect to refit bounds on initial load
  useEffect(() => {
    if (map && opportunities?.length > 0 && !initialBoundsFitted) {
      fitBoundsToMarkers(map, opportunities);
      setInitialBoundsFitted(true);
    }
  }, [opportunities, map, initialBoundsFitted]);

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

  const centerMapOnMarker = (map, coordinates, isSidebarOpening) => {
    const sidebarWidth = 450; // Width of sidebar in pixels
    const mapWidth = map.getDiv().offsetWidth;

    // Calculate offset based on sidebar state change
    let offset = 0;

    if (isSidebarOpening && !isSidebarOpen) {
      // Sidebar will open, move center left by half of sidebar width
      offset = sidebarWidth / 2;
    } else if (!isSidebarOpening && isSidebarOpen) {
      // Sidebar will close, move center right by half of sidebar width
      offset = -sidebarWidth / 2;
    }

    if (offset !== 0 && enableSidebar) {
      // Get current bounds to calculate lng per pixel
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const lngSpan = ne.lng() - sw.lng();
        const lngPerPixel = lngSpan / mapWidth;

        // Calculate new center with offset
        const newCenter = new google.maps.LatLng(
          coordinates.lat,
          coordinates.lng - offset * lngPerPixel
        );

        map.panTo(newCenter);
      } else {
        // Fallback if bounds not available
        map.panTo(new google.maps.LatLng(coordinates.lat, coordinates.lng));
      }
    } else {
      // No offset needed, just center on the marker
      map.panTo(new google.maps.LatLng(coordinates.lat, coordinates.lng));
    }
  };

  const handleMarkerClick = async (opportunity) => {
    if (!enableSidebar) return;

    setIsLoading(true);
    setSelectedCoordinates(opportunity.coordinates);

    try {
      // Center the map on the clicked marker with sidebar offset
      if (map && opportunity.coordinates) {
        centerMapOnMarker(map, opportunity.coordinates, true);
      }

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

    // Re-center the map considering the sidebar is now closed
    if (map && selectedCoordinates) {
      centerMapOnMarker(map, selectedCoordinates, false);
    }
  };

  if (!isLoaded) {
    return <MapLoading />;
  }

  return (
    <div className="h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoomLevel}
        center={initialCenter}
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

      {enableSidebar && (
        <OpportunitySidebar
          opportunity={selectedOpportunityDetails}
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
