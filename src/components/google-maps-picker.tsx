"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import googleMapsLoader from '@/lib/google-maps-loader';

interface LatLng {
  lat: number;
  lng: number;
}

interface GoogleMapsPickerProps {
  onLocationSelect: (location: LatLng, address: string) => void;
  initialLocation?: LatLng;
  apiKey: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
    googleMapsScriptLoading?: boolean;
    googleMapsScriptLoaded?: boolean;
  }
}

const GoogleMapsPicker: React.FC<GoogleMapsPickerProps> = ({
  onLocationSelect,
  initialLocation = { lat: 17.3850, lng: 78.4867 }, // Hyderabad center
  apiKey
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [geocoder, setGeocoder] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mapListeners, setMapListeners] = useState<any[]>([]);

  useEffect(() => {
    // Check for placeholder or invalid API key
    if (!apiKey || apiKey === 'your_google_maps_api_key_here' || apiKey.length < 30) {
      setError('invalid_api_key');
      setLoading(false);
      return;
    }

    // Use the improved loader to prevent multiple script loads
    googleMapsLoader.loadScript(apiKey)
      .then(() => {
        initializeMap();
      })
      .catch((error) => {
        console.error('Failed to load Google Maps:', error);
        
        // Check for specific API key errors
        if (error.message && error.message.includes('InvalidKeyMapError')) {
          setError('invalid_api_key');
        } else {
          setError('Failed to load Google Maps. Please check your internet connection and try again.');
        }
        setLoading(false);
      });

    // Cleanup function
    return () => {
      // Remove all event listeners
      mapListeners.forEach(listener => {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      });
      setMapListeners([]);
    };
  }, [apiKey]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
      });

      // Use AdvancedMarkerElement instead of deprecated Marker
      let markerInstance;
      if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
        // Use new AdvancedMarkerElement
        markerInstance = new window.google.maps.marker.AdvancedMarkerElement({
          position: initialLocation,
          map: mapInstance,
          gmpDraggable: true,
          title: 'Select location for your issue report'
        });
      } else {
        // Fallback to legacy Marker if AdvancedMarkerElement not available
        markerInstance = new window.google.maps.Marker({
          position: initialLocation,
          map: mapInstance,
          draggable: true,
          title: 'Select location for your issue report'
        });
      }

      const geocoderInstance = new window.google.maps.Geocoder();

      // Store listeners for cleanup
      const listeners: any[] = [];

      // Handle map click
      const clickListener = mapInstance.addListener('click', (event: any) => {
        const clickedLocation = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        
        // Set position differently for AdvancedMarkerElement vs legacy Marker
        if (window.google.maps.marker && markerInstance instanceof window.google.maps.marker.AdvancedMarkerElement) {
          markerInstance.position = clickedLocation;
        } else {
          markerInstance.setPosition(clickedLocation);
        }
        setSelectedLocation(clickedLocation);
        reverseGeocode(clickedLocation, geocoderInstance);
      });
      listeners.push(clickListener);

      // Handle marker drag - different for AdvancedMarkerElement
      let dragListener;
      if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement && markerInstance instanceof window.google.maps.marker.AdvancedMarkerElement) {
        // AdvancedMarkerElement uses 'gmp-click' and different drag events
        dragListener = markerInstance.addListener('dragend', (event: any) => {
          const draggedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          
          setSelectedLocation(draggedLocation);
          reverseGeocode(draggedLocation, geocoderInstance);
        });
      } else {
        // Legacy Marker drag event
        dragListener = markerInstance.addListener('dragend', (event: any) => {
          const draggedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          
          setSelectedLocation(draggedLocation);
          reverseGeocode(draggedLocation, geocoderInstance);
        });
      }
      listeners.push(dragListener);

      // Store listeners in state for cleanup
      setMapListeners(listeners);

      // Get current location if possible
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            mapInstance.setCenter(currentLocation);
            // Set position differently for AdvancedMarkerElement vs legacy Marker
            if (window.google.maps.marker && markerInstance instanceof window.google.maps.marker.AdvancedMarkerElement) {
              markerInstance.position = currentLocation;
            } else {
              markerInstance.setPosition(currentLocation);
            }
            setSelectedLocation(currentLocation);
            reverseGeocode(currentLocation, geocoderInstance);
          },
          (error) => {
            console.warn('Geolocation not available:', error);
            // Use default Hyderabad location
            setSelectedLocation(initialLocation);
            reverseGeocode(initialLocation, geocoderInstance);
          }
        );
      } else {
        setSelectedLocation(initialLocation);
        reverseGeocode(initialLocation, geocoderInstance);
      }

      setMap(mapInstance);
      setMarker(markerInstance);
      setGeocoder(geocoderInstance);
      setLoading(false);

    } catch (err) {
      setError('Failed to initialize map');
      setLoading(false);
    }
  };

  const reverseGeocode = (location: LatLng, geocoderInstance: any) => {
    geocoderInstance.geocode(
      { location: location },
      (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          setSelectedAddress(address);
        } else {
          setSelectedAddress(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
        }
      }
    );
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation, selectedAddress);
    }
  };

  const searchLocation = (query: string) => {
    if (!geocoder || !query.trim()) return;

    geocoder.geocode({ address: query }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        
        map.setCenter(location);
        map.setZoom(15);
        // Set position differently for AdvancedMarkerElement vs legacy Marker
        if (window.google.maps.marker && marker instanceof window.google.maps.marker.AdvancedMarkerElement) {
          marker.position = location;
        } else {
          marker.setPosition(location);
        }
        setSelectedLocation(location);
        setSelectedAddress(results[0].formatted_address);
      }
    });
  };

  if (error === 'invalid_api_key') {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">🗺️ Google Maps Setup Required</h4>
        <p className="text-blue-700 text-sm mb-3">
          To use interactive map selection, please set up Google Maps API:
        </p>
        <ol className="text-blue-700 text-sm space-y-1 mb-3 ml-4">
          <li>1. Visit <a href="https://console.cloud.google.com/" target="_blank" className="underline">Google Cloud Console</a></li>
          <li>2. Enable Maps JavaScript API & Geocoding API</li>
          <li>3. Create an API key with domain restrictions</li>
          <li>4. Add key to .env.local file</li>
          <li>5. Restart development server</li>
        </ol>
        <div className="bg-blue-100 p-2 rounded text-xs text-blue-600 mb-2">
          <strong>Free Tier:</strong> 28,000 map loads/month at no cost
        </div>
        <p className="text-blue-600 text-sm font-medium">
          📍 For now, please use manual address entry below.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h4 className="font-semibold text-red-800 mb-2">❌ Google Maps Error</h4>
        <p className="text-red-600 text-sm mb-2">{error}</p>
        <p className="text-sm text-gray-600">
          Please check your internet connection or use manual address entry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search for a location..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              searchLocation(e.currentTarget.value);
            }
          }}
        />
        <Button
          type="button"
          onClick={() => {
            const input = document.querySelector('input[placeholder="Search for a location..."]') as HTMLInputElement;
            if (input) searchLocation(input.value);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </Button>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        
        <div
          ref={mapRef}
          className="w-full h-96 border border-gray-300 rounded-lg"
          style={{ minHeight: '400px' }}
        />
      </div>

      {selectedAddress && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800">Selected Location:</p>
          <p className="text-sm text-blue-700">{selectedAddress}</p>
          {selectedLocation && (
            <p className="text-xs text-blue-600 mt-1">
              Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleConfirmLocation}
          disabled={!selectedLocation}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          Confirm Location
        </Button>
        
        <Button
          type="button"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  
                  if (map && marker) {
                    map.setCenter(currentLocation);
                    map.setZoom(16);
                    // Set position differently for AdvancedMarkerElement vs legacy Marker
                    if (window.google.maps.marker && marker instanceof window.google.maps.marker.AdvancedMarkerElement) {
                      marker.position = currentLocation;
                    } else {
                      marker.setPosition(currentLocation);
                    }
                    setSelectedLocation(currentLocation);
                    reverseGeocode(currentLocation, geocoder);
                  }
                },
                () => alert('Unable to get your current location')
              );
            }
          }}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          📍 Use Current Location
        </Button>
      </div>

      <div className="text-xs text-gray-500">
        💡 <strong>Tip:</strong> Click anywhere on the map or drag the marker to select the exact location of the issue.
      </div>
    </div>
  );
};

export default GoogleMapsPicker;
