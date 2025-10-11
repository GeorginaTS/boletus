import { firestoreService } from "@/services/firestoreService";
import {
  geolocationService,
  LocationData,
} from "@/services/geolocationService";
import { notificationService } from "@/services/notificationService";
import { Location } from "@/types/location";
import { useEffect, useRef, useState } from "react";

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
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [debugToast, setDebugToast] = useState<{
    show: boolean;
    message: string;
  }>({
    show: false,
    message: "",
  });

  useEffect(() => {
    if (!userId) return;

    const checkProximity = async () => {
      try {
        setDebugToast({
          show: true,
          message: "[DEBUG] Comprovant ubicació i proximitat...",
        });
        // 1. Obtenir ubicació actual
        let location: LocationData;
        try {
          location = await geolocationService.getCurrentPosition();
        } catch (geoErr) {
          setToast({
            show: true,
            message: "Error de geolocalització: " + geoErr,
          });
          return;
        }
        // 2. Recuperar localitzacions guardades de l'usuari
        let locations: Location[];
        try {
          locations = await firestoreService.getUserLocations(userId);
        } catch (dbErr) {
          setToast({
            show: true,
            message: "Error accedint a Firestore: " + dbErr,
          });
          return;
        }
        // 3. Comprovar distància amb cada localització
        for (const loc of locations) {
          const dist = getDistanceMeters(
            location.latitude,
            location.longitude,
            loc.lat,
            loc.lng
          );
          if (dist <= 100 && !lastNotifiedRef.current.includes(loc.id || "")) {
            // Mostra toast per pantalla
            setToast({
              show: true,
              message: `Estàs a prop de ${loc.name} (${Math.round(dist)}m)`,
            });
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
        // Error inesperat
        setToast({
          show: true,
          message: "Error inesperat comprovant la proximitat: " + err,
        });
      }
    };

    // Inicia el bucle de comprovació
    checkProximity();
    const interval = setInterval(checkProximity, intervalMs);
    return () => clearInterval(interval);
  }, [userId, intervalMs]);

  return { toast, debugToast };
}
