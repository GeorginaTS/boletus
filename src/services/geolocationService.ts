import {
  Geolocation,
  PermissionStatus,
  Position,
} from "@capacitor/geolocation";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface LocationError {
  code: string;
  message: string;
}

class GeolocationService {
  /**
   * Comprova si els permisos de geolocalització estan concedits
   */
  async checkPermissions(): Promise<PermissionStatus> {
    try {
      const permissions = await Geolocation.checkPermissions();
      console.log("🔐 Geolocation permissions:", permissions);
      return permissions;
    } catch (error) {
      console.error("❌ Error checking geolocation permissions:", error);
      throw error;
    }
  }

  /**
   * Demana permisos de geolocalització a l'usuari
   */
  async requestPermissions(): Promise<PermissionStatus> {
    try {
      const permissions = await Geolocation.requestPermissions();
      console.log("🔐 Requested geolocation permissions:", permissions);
      return permissions;
    } catch (error) {
      console.error("❌ Error requesting geolocation permissions:", error);
      throw error;
    }
  }

  /**
   * Obté la posició actual de l'usuari
   */
  async getCurrentPosition(): Promise<LocationData> {
    console.log("🗺️ Starting getCurrentPosition...");
    try {
      // Comprova permisos primer
      console.log("🔐 Checking permissions...");
      const permissions = await this.checkPermissions();
      console.log("🔐 Permissions result:", permissions);

      // En el navegador web, si els permisos són "prompt", procedim directament
      // ja que requestPermissions() no està implementat en web
      if (permissions.location === "denied") {
        throw {
          code: "PERMISSION_DENIED",
          message: "Els permisos de geolocalització han estat denegats",
        } as LocationError;
      }

      if (
        permissions.location !== "granted" &&
        permissions.location !== "prompt"
      ) {
        // Només intenta demanar permisos si no estem en web
        try {
          console.log("🔄 Attempting to request permissions...");
          const requestedPermissions = await this.requestPermissions();
          console.log("🔐 Requested permissions result:", requestedPermissions);

          if (requestedPermissions.location !== "granted") {
            throw {
              code: "PERMISSION_DENIED",
              message: "Els permisos de geolocalització han estat denegats",
            } as LocationError;
          }
        } catch (permissionError: unknown) {
          // Si requestPermissions falla (com en web), continuem
          const errorObj = permissionError as { message?: string };
          console.log(
            "⚠️ Permission request failed, continuing with getCurrentPosition:",
            errorObj.message || "Unknown error"
          );
        }
      }

      console.log("✅ Proceeding to get position with high accuracy...");
      // Obté la posició actual amb configuració d'alta precisió
      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true, // Activat per màxima precisió GPS
        timeout: 30000, // 30 segons per donar temps al GPS a fixar-se
        maximumAge: 10000, // Només 10 segons per forçar dades fresques
      });
      console.log("📍 Position obtained:", position);

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      };

      console.log("✅ Current position obtained successfully:", locationData);
      return locationData;
    } catch (error: unknown) {
      console.error("❌ Error getting current position:", error);

      // Gestiona diferents tipus d'errors
      const errorObj = error as { code?: number; message?: string };
      console.log("🔍 Error details:", {
        code: errorObj.code,
        message: errorObj.message,
      });

      if (errorObj.code) {
        switch (errorObj.code) {
          case 1: // PERMISSION_DENIED
            throw {
              code: "PERMISSION_DENIED",
              message: "Els permisos de geolocalització han estat denegats",
            } as LocationError;

          case 2: // POSITION_UNAVAILABLE
            throw {
              code: "POSITION_UNAVAILABLE",
              message:
                "La posició no està disponible. Comprova la connexió GPS.",
            } as LocationError;

          case 3: // TIMEOUT
            throw {
              code: "TIMEOUT",
              message: "S'ha esgotat el temps d'espera per obtenir la ubicació",
            } as LocationError;

          default:
            throw {
              code: "UNKNOWN_ERROR",
              message: `Error desconegut: ${errorObj.message}`,
            } as LocationError;
        }
      }

      // Si no té codi, és un error genèric
      throw {
        code: "UNKNOWN_ERROR",
        message: "Error desconegut en obtenir la geolocalització",
      } as LocationError;
    }
  }

  /**
   * Inicia el seguiment de la posició de l'usuari
   */
  async watchPosition(
    onSuccess: (location: LocationData) => void,
    onError: (error: LocationError) => void,
    options?: {
      enableHighAccuracy?: boolean;
      timeout?: number;
      maximumAge?: number;
    }
  ): Promise<string> {
    try {
      // Comprova permisos primer
      const permissions = await this.checkPermissions();

      if (permissions.location !== "granted") {
        const requestedPermissions = await this.requestPermissions();

        if (requestedPermissions.location !== "granted") {
          onError({
            code: "PERMISSION_DENIED",
            message: "Els permisos de geolocalització han estat denegats",
          });
          return "";
        }
      }

      // Inicia el seguiment
      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: options?.enableHighAccuracy ?? true,
          timeout: options?.timeout ?? 10000,
          maximumAge: options?.maximumAge ?? 300000,
        },
        (position, error) => {
          if (error) {
            console.error("Watch position error:", error);
            onError({
              code: "WATCH_ERROR",
              message: `Error en el seguiment: ${error.message}`,
            });
          } else if (position) {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            };
            onSuccess(locationData);
          }
        }
      );

      return watchId;
    } catch (error) {
      console.error("Error starting watch position:", error);
      onError({
        code: "WATCH_START_ERROR",
        message: "Error en iniciar el seguiment de la posició",
      });
      return "";
    }
  }

  /**
   * Atura el seguiment de la posició
   */
  async clearWatch(watchId: string): Promise<void> {
    try {
      await Geolocation.clearWatch({ id: watchId });
      console.log("Watch position cleared:", watchId);
    } catch (error) {
      console.error("Error clearing watch position:", error);
    }
  }

  /**
   * Formata les coordenades per mostrar-les de forma llegible
   */
  formatCoordinates(location: LocationData): string {
    const lat = location.latitude.toFixed(6);
    const lng = location.longitude.toFixed(6);
    return `${lat}°, ${lng}°`;
  }

  /**
   * Formata la precisió de la geolocalització
   */
  formatAccuracy(accuracy: number): string {
    if (accuracy < 1000) {
      return `${Math.round(accuracy)}m`;
    } else {
      return `${(accuracy / 1000).toFixed(1)}km`;
    }
  }

  /**
   * Converteix timestamp a data llegible
   */
  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString("ca-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  /**
   * Calcula la distància entre dues coordenades en metres
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371e3; // Radi de la Terra en metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distància en metres
  }

  /**
   * Obté la posició actual amb configuració d'alta precisió i múltiples intents
   */
  async getHighAccuracyPosition(): Promise<LocationData> {
    console.log(
      "🎯 Starting getHighAccuracyPosition with multiple attempts..."
    );

    let bestLocation: LocationData | null = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(
        `🔄 Intent ${attempts}/${maxAttempts} per obtenir alta precisió...`
      );

      try {
        const position: Position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 45000, // 45 segons per intent
          maximumAge: 0, // Sempre fresh data
        });

        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        console.log(
          `📍 Intent ${attempts}: Precisió ${locationData.accuracy}m`
        );

        // Si és la primera lectura o és més precisa que l'anterior
        if (!bestLocation || locationData.accuracy < bestLocation.accuracy) {
          bestLocation = locationData;
          console.log(`✅ Nova millor precisió: ${locationData.accuracy}m`);
        }

        // Si hem aconseguit precisió acceptable (<=15m), aturem
        if (locationData.accuracy <= 15) {
          console.log(
            `🎯 Precisió excel·lent aconseguida: ${locationData.accuracy}m`
          );
          break;
        }

        // Si és acceptable (<=30m) i no és el primer intent, aturem
        if (locationData.accuracy <= 30 && attempts > 1) {
          console.log(
            `✅ Precisió acceptable aconseguida: ${locationData.accuracy}m`
          );
          break;
        }
      } catch (error) {
        console.warn(`⚠️ Intent ${attempts} fallit:`, error);

        // Si és l'últim intent i no tenim cap ubicació, llancem l'error
        if (attempts === maxAttempts && !bestLocation) {
          throw error;
        }
      }

      // Espera 2 segons entre intents (excepte l'últim)
      if (attempts < maxAttempts) {
        console.log("⏱️ Esperant 2 segons abans del següent intent...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (!bestLocation) {
      throw {
        code: "LOCATION_UNAVAILABLE",
        message:
          "No s'ha pogut obtenir cap ubicació després de múltiples intents",
      } as LocationError;
    }

    console.log(
      `🏆 Millor precisió obtinguda: ${bestLocation.accuracy}m després de ${attempts} intents`
    );
    return bestLocation;
  }
}

// Exporta una instància única del servei
export const geolocationService = new GeolocationService();
