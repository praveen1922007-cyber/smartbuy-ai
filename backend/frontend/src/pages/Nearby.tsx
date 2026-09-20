import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const TRICHY = { lat: 10.7905, lng: 78.7047 };

export default function Nearby() {
  const { data: stores, isLoading } = useQuery(['nearby-stores'], async () => {
    const res = await api.get('/stores/nearby?lon=78.7047&lat=10.7905&radius=5000');
    return res.data;
  });

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<any | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Try to get user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLoc(null)
      );
    }
  }, []);

  const handleMarkerClick = (store: any) => {
    setSelectedStore(store);
    setDirectionsResponse(null);
  };

  const requestDirections = useCallback((destination: { lat: number; lng: number }) => {
    const origin = userLoc || TRICHY;
    const serviceRequest = {
      origin,
      destination,
      travelMode: 'DRIVING'
    };

    // Use DirectionsService via component by setting a state that will render it
    // We'll store the request in state and let DirectionsService component execute
    // Instead we'll programmatically call the DirectionsService using window.google.maps.DirectionsService
    if ((window as any).google && (window as any).google.maps) {
      const ds = new (window as any).google.maps.DirectionsService();
      ds.route(
        {
          origin: serviceRequest.origin,
          destination: serviceRequest.destination,
          travelMode: (window as any).google.maps.TravelMode.DRIVING
        },
        (result: any, status: any) => {
          if (status === 'OK') {
            setDirectionsResponse(result);
          } else {
            console.error('Directions request failed', status);
          }
        }
      );
    }
  }, [userLoc]);

  return (
    <div className="h-[80vh] w-full rounded shadow overflow-hidden">
      {isLoading ? (
        <div className="p-6">Loading map...</div>
      ) : (
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            zoom={13}
            center={userLoc || TRICHY}
            onLoad={(map) => (mapRef.current = map)}
          >
            {Array.isArray(stores) && stores.map((s: any) => (
              <Marker
                key={s._id}
                position={{ lat: s.location?.coordinates[1] || TRICHY.lat, lng: s.location?.coordinates[0] || TRICHY.lng }}
                title={s.name}
                onClick={() => handleMarkerClick(s)}
              />
            ))}

            {selectedStore && (
              <InfoWindow
                position={{ lat: selectedStore.location?.coordinates[1] || TRICHY.lat, lng: selectedStore.location?.coordinates[0] || TRICHY.lng }}
                onCloseClick={() => setSelectedStore(null)}
              >
                <div className="max-w-xs">
                  <h3 className="font-semibold">{selectedStore.name}</h3>
                  <p className="text-sm text-slate-600">{selectedStore.address}</p>
                  <p className="text-sm">Rating: {selectedStore.rating ?? 'N/A'}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      onClick={() => requestDirections({ lat: selectedStore.location?.coordinates[1], lng: selectedStore.location?.coordinates[0] })}
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}

            {directionsResponse && (
              <DirectionsRenderer
                options={{ directions: directionsResponse }}
              />
            )}

          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
}
