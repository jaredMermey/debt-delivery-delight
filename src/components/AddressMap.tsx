
import { MapPin, CheckCircle } from 'lucide-react';

interface AddressMapProps {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export const AddressMap = ({ address }: AddressMapProps) => {
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  const encodedAddress = encodeURIComponent(fullAddress);
  
  // Google Maps embed URL - no API key required
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=&q=${encodedAddress}`;
  
  // Fallback Google Maps search URL for direct linking
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center space-x-2 mb-3">
        <MapPin className="w-5 h-5 text-green-600" />
        <span className="font-semibold">Address Verification</span>
        <CheckCircle className="w-4 h-4 text-green-600" />
      </div>
      
      <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-200">
        <iframe
          src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Address Location"
          className="rounded-lg"
        />
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          {address.street}
          <br />
          {address.city}, {address.state} {address.zipCode}
        </div>
        <a
          href={googleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          View in Google Maps
        </a>
      </div>
    </div>
  );
};
