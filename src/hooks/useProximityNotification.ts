import { firestoreService } from "@/services/firestoreService";
import {
  geolocationService,
  LocationData,
} from "@/services/geolocationService";
import { notificationService } from "@/services/notificationService";
import { Location } from "@/types/location";
import { useEffect, useRef } from "react";

// Calcula la distància entre dos punts (Haversine formula)
function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // metres
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Hook que comprova cada X segons si l'usuari està a prop d'una localització guardada
 * i mostra una notificació local si està a menys de 100m
 */
export function useProximityNotification(
  userId: string,
  intervalMs: number = 120000
) {
  const lastNotifiedRef = useRef<string[]>([]); // IDs de localitzacions ja notificades

  useEffect(() => {
    if (!userId) return;
    // interval només es declara i assigna una vegada

    const checkProximity = async () => {
      try {
        // 1. Obtenir ubicació actual
        const location: LocationData =
          await geolocationService.getCurrentPosition();
        // 2. Recuperar localitzacions guardades de l'usuari
        const locations: Location[] = await firestoreService.getUserLocations(
          userId
        );
        // 3. Comprovar distància amb cada localització
        for (const loc of locations) {
          const dist = getDistanceMeters(
            location.latitude,
            location.longitude,
            loc.lat,
            loc.lng
          );
          if (dist <= 100 && !lastNotifiedRef.current.includes(loc.id || "")) {
            // 4. Notificació local
            await notificationService.sendLocalNotification({
              title: "Estàs a prop de " + loc.name,
              body: `A menys de ${Math.round(
                dist
              )} metres de la ubicació guardada!`,
              icon: "/favicon.svg",
              data: {
                locationId: loc.id ? String(loc.id) : "",
                type: "proximity",
              },
            });
            lastNotifiedRef.current.push(loc.id || "");
          }
        }
      } catch (err) {
        // No bloqueja l'app si falla la geolocalització o la consulta
        console.warn("Proximity notification error:", err);
      }
    };

    // Inicia el bucle de comprovació
    checkProximity();
    const interval = setInterval(checkProximity, intervalMs);
    return () => clearInterval(interval);
  }, [userId, intervalMs]);
}
