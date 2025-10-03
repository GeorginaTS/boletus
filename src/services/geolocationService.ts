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

      console.log("✅ Proceeding to get position...");
      // Obté la posició actual amb configuració més permissiva
      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false, // Canviat a false per ser més ràpid
        timeout: 15000, // Augmentat a 15 segons
        maximumAge: 60000, // Reduït a 1 minut per tenir dades més fresques
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
}

// Exporta una instància única del servei
export const geolocationService = new GeolocationService();
