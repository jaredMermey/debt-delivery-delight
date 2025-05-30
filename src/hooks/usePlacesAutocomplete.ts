
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
        // For now, we'll create a simple fallback that doesn't require Google Maps API
        // This prevents the field from locking up
        console.log('Places autocomplete initialized in fallback mode');
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load Google Places API:', error);
        setIsLoaded(true); // Still set to loaded to prevent blocking
      }
    };

    initAutocomplete();
  }, [onPlaceSelect]);

  return { inputRef, isLoaded };
};
