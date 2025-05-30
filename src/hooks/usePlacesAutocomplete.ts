
import { useEffect, useRef, useState } from 'react';

interface AddressComponents {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface UsePlacesAutocompleteProps {
  onPlaceSelect: (address: AddressComponents) => void;
}

export const usePlacesAutocomplete = ({ onPlaceSelect }: UsePlacesAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        // Load the Google Maps Places library
        // @ts-ignore
        await google.maps.importLibrary("places");
        
        if (inputRef.current) {
          // @ts-ignore
          const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            fields: ['address_components', 'formatted_address']
          });

          // @ts-ignore
          autocomplete.addListener('place_changed', () => {
            // @ts-ignore
            const place = autocomplete.getPlace();
            
            if (place.address_components) {
              const addressComponents: AddressComponents = {
                street: '',
                city: '',
                state: '',
                zipCode: ''
              };

              // Parse the address components
              place.address_components.forEach((component: any) => {
                const types = component.types;
                
                if (types.includes('street_number')) {
                  addressComponents.street = component.long_name + ' ';
                }
                if (types.includes('route')) {
                  addressComponents.street += component.long_name;
                }
                if (types.includes('locality')) {
                  addressComponents.city = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                  addressComponents.state = component.short_name;
                }
                if (types.includes('postal_code')) {
                  addressComponents.zipCode = component.long_name;
                }
              });

              onPlaceSelect(addressComponents);
            }
          });
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load Google Places API:', error);
      }
    };

    // Check if Google Maps is available
    // @ts-ignore
    if (typeof google !== 'undefined' && google.maps) {
      initAutocomplete();
    } else {
      // Load Google Maps script if not already loaded
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    }
  }, [onPlaceSelect]);

  return { inputRef, isLoaded };
};
