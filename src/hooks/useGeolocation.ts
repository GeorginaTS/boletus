import { useCallback, useEffect, useRef, useState } from "react";
import {
  geolocationService,
  LocationData,
  LocationError,
} from "../services/geolocationService";
import { useLocationStorage } from "./useLocationStorage";

interface UseGeolocationResult {
  location: LocationData | null;
  loading: boolean;
  error: LocationError | null;
  getCurrentLocation: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook personalitzat per gestionar la geolocalització
 */
export const useGeolocation = (
  autoFetch: boolean = false
): UseGeolocationResult => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);
  const hasInitialized = useRef(false);
  const { saveUserLocation } = useLocationStorage();

  const getCurrentLocation = useCallback(async () => {
    console.log("🎯 Starting getCurrentLocation in hook...");
    setLoading(true);
    setError(null);

    try {
      const locationData = await geolocationService.getCurrentPosition();
      console.log("✅ Location obtained in hook:", locationData);
      setLocation(locationData);

      // Guarda automàticament la ubicació al perfil de l'usuari
      await saveUserLocation(locationData);
    } catch (err) {
      const locationError = err as LocationError;
      console.error("❌ Geolocation error in hook:", locationError);
      setError(locationError);
    } finally {
      console.log("🏁 getCurrentLocation finished, setting loading to false");
      setLoading(false);
    }
  }, [saveUserLocation]); // Afegim saveUserLocation com a dependència

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (autoFetch && !hasInitialized.current) {
      console.log("🔄 useEffect triggered, calling getCurrentLocation...");
      hasInitialized.current = true;
      getCurrentLocation();
    }
  }, [autoFetch, getCurrentLocation]);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    clearError,
  };
};

export default useGeolocation;
