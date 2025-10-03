import { useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { firestoreService } from "../services/firestoreService";
import { LocationData } from "../services/geolocationService";

interface UseLocationStorageResult {
  saveUserLocation: (location: LocationData) => Promise<void>;
  isLoading: boolean;
}

export const useLocationStorage = (): UseLocationStorageResult => {
  const { user } = useAuth();

  const saveUserLocation = useCallback(
    async (location: LocationData) => {
      if (!user) {
        console.warn(
          "⚠️ No hi ha usuari autenticat, no es pot guardar la ubicació"
        );
        return;
      }

      try {
        console.log("💾 Guardant ubicació de l'usuari a Firestore...");

        await firestoreService.updateUserLocation(
          user.uid,
          location.latitude,
          location.longitude
        );

        console.log("✅ Ubicació guardada amb èxit!");
      } catch (error) {
        console.error("❌ Error guardant la ubicació:", error);
        // No llançem l'error perquè no volem que afecti la funcionalitat principal
        // de geolocalització, només registrem l'error
      }
    },
    [user]
  );

  return {
    saveUserLocation,
    isLoading: false, // Podríem afegir un state per tracking si cal
  };
};

export default useLocationStorage;
