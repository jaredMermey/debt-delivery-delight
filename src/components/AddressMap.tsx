
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressMapProps {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export const AddressMap = ({ address }: AddressMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;

  const initializeMap = async () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      // Geocode the address
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${mapboxToken}`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;

        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: 15
        });

        // Add marker
        marker.current = new mapboxgl.Marker({
          color: '#ef4444'
        })
          .setLngLat([lng, lat])
          .addTo(map.current);

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    if (mapboxToken && fullAddress.trim()) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, fullAddress]);

  if (showTokenInput) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-5 h-5 text-green-600" />
          <span className="font-semibold">Map Setup Required</span>
        </div>
        <div className="space-y-3">
          <div>
            <Label htmlFor="mapboxToken">Mapbox Public Token</Label>
            <Input
              id="mapboxToken"
              type="password"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="Enter your Mapbox public token"
              className="mt-1"
            />
          </div>
          <button
            onClick={() => {
              if (mapboxToken) {
                setShowTokenInput(false);
              }
            }}
            disabled={!mapboxToken}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            Load Map
          </button>
          <p className="text-xs text-gray-600">
            Get your free token at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center space-x-2 mb-3">
        <MapPin className="w-5 h-5 text-green-600" />
        <span className="font-semibold">Address Verification</span>
      </div>
      <div 
        ref={mapContainer} 
        className="w-full h-64 rounded-lg"
        style={{ minHeight: '256px' }}
      />
      <div className="mt-2 text-center">
        <div className="text-sm font-medium text-gray-700">
          {address.street}
          <br />
          {address.city}, {address.state} {address.zipCode}
        </div>
      </div>
    </div>
  );
};
