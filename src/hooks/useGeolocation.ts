import { useLocationStorage } from "@/hooks/useLocationStorage";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  geolocationService,
  LocationData,
  LocationError,
} from "../services/geolocationService";

interface UseGeolocationResult {
  location: LocationData | null;
  loading: boolean;
  error: LocationError | null;
  accuracy: number | null;
  isHighAccuracy: boolean;
  getCurrentLocation: () => Promise<void>;
  getHighAccuracyLocation: () => Promise<void>;
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
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isHighAccuracy, setIsHighAccuracy] = useState(false);
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
      setAccuracy(locationData.accuracy);
      setIsHighAccuracy(locationData.accuracy <= 20); // Considera alta precisió si és <= 20m

      // Guarda automàticament la ubicació al perfil de l'usuari
      await saveUserLocation(locationData);

      // Avisa si la precisió és baixa
      if (locationData.accuracy > 50) {
        console.warn(
          `⚠️ Precisió baixa: ${locationData.accuracy}m. Considera intentar-ho de nou.`
        );
      }
    } catch (err) {
      const locationError = err as LocationError;
      console.error("❌ Geolocation error in hook:", locationError);
      setError(locationError);
    } finally {
      console.log("🏁 getCurrentLocation finished, setting loading to false");
      setLoading(false);
    }
  }, [saveUserLocation]);

  const getHighAccuracyLocation = useCallback(async () => {
    console.log("🎯 Starting HIGH ACCURACY location request...");
    setLoading(true);
    setError(null);

    try {
      // Força una nova lectura d'alta precisió
      const locationData = await geolocationService.getHighAccuracyPosition();
      console.log("✅ High accuracy location obtained:", locationData);
      setLocation(locationData);
      setAccuracy(locationData.accuracy);
      setIsHighAccuracy(locationData.accuracy <= 20);

      // Guarda automàticament la ubicació al perfil de l'usuari
      await saveUserLocation(locationData);

      console.log(`🎯 Precisió obtinguda: ${locationData.accuracy}m`);
    } catch (err) {
      const locationError = err as LocationError;
      console.error("❌ High accuracy geolocation error:", locationError);
      setError(locationError);
    } finally {
      setLoading(false);
    }
  }, [saveUserLocation]);

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
    accuracy,
    isHighAccuracy,
    getCurrentLocation,
    getHighAccuracyLocation,
    clearError,
  };
};

export default useGeolocation;
