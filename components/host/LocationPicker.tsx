'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialCenter = { lat: 25.1932, lng: 55.4144 }, // Dubai center
  initialZoom = 12
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const mapOptions = useMemo(() => ({
    zoom: initialZoom,
    center: initialCenter,
    minZoom: 8,
    maxZoom: 18,
    styles: [
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }, { lightness: 17 }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }, { lightness: 18 }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }, { lightness: 16 }]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }, { lightness: 21 }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#dedede' }, { lightness: 21 }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }]
      },
      {
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#f2f2f2' }, { lightness: 19 }]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{ color: '#fefefe' }, { lightness: 20 }]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }]
      }
    ]
  }), [initialCenter, initialZoom]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedLocation({ lat, lng });
      
      // Automatically process the location selection
      try {
        const geocoder = new google.maps.Geocoder();
        const result = await geocoder.geocode({
          location: { lat, lng }
        });

        if (result.results && result.results.length > 0) {
          const address = result.results[0].formatted_address;
          // Small delay to show feedback message
          setTimeout(() => {
            onLocationSelect({
              lat,
              lng,
              address
            });
          }, 1000);
        } else {
          // Fallback to coordinates if geocoding fails
          setTimeout(() => {
            onLocationSelect({
              lat,
              lng,
              address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            });
          }, 1000);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        // Fallback to coordinates
        setTimeout(() => {
          onLocationSelect({
            lat,
            lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          });
        }, 1000);
      }
    }
  }, [onLocationSelect]);


  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Google Maps API Key Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            To use the interactive map, you need to set up a Google Maps API key.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <strong>Setup Instructions:</strong>
            </p>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Get API key from Google Cloud Console</li>
              <li>Enable Maps JavaScript API</li>
              <li>Enable Geocoding API</li>
              <li>Add to .env.local: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key</li>
            </ol>
          </div>
          <button
            onClick={() => {
              // Fallback to demo location
              onLocationSelect({
                lat: 25.1932,
                lng: 55.4144,
                address: 'Downtown Dubai, Dubai, UAE'
              });
            }}
            className="mt-4 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors text-sm font-medium"
          >
            Use Demo Location (Downtown Dubai)
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699] mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#006699" stroke="#ffffff" stroke-width="4"/>
                  <path d="M20 8C15.6 8 12 11.6 12 16C12 22 20 32 20 32C20 32 28 22 28 16C28 11.6 24.4 8 20 8Z" fill="#ffffff"/>
                  <circle cx="20" cy="16" r="3" fill="#006699"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            }}
          />
        )}
      </GoogleMap>
      
      {/* Location selection feedback */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-green-500 text-white rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium">
                Location selected! Processing address...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      {!selectedLocation && (
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Click anywhere on the map</strong> to automatically select your property location
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              The map will close automatically after selection
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
