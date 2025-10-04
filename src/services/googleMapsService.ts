import { LocationData } from "@services/geolocationService";

// Tipus per a callback functions dinàmiques de Google Maps
type GoogleMapsCallbackFunction = () => void;

// Helper function per accedir a window amb callbacks dinàmics de forma segura
const getWindowWithCallback = () =>
  window as unknown as Window & Record<string, GoogleMapsCallbackFunction>;

// Configuració per defecte de Google Maps
const DEFAULT_MAP_CONFIG = {
  center: { lat: 41.3851, lng: 2.1734 }, // Barcelona per defecte
  zoom: 13,
  mapTypeId: "roadmap" as google.maps.MapTypeId,
  mapId: "MUSHROOM_FINDER_MAP", // Necessari per AdvancedMarkerElement
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  gestureHandling: "auto",
  clickableIcons: true,
};

// Configuració de l'API key
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

if (!API_KEY) {
  console.warn(
    "⚠️ VITE_GOOGLE_MAPS_API_KEY no està definida. El mapa pot no funcionar correctament."
  );
}

interface GoogleMapsServiceConfig {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  mapTypeId?: google.maps.MapTypeId;
  mapId?: string;
  disableDefaultUI?: boolean;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  scaleControl?: boolean;
  streetViewControl?: boolean;
  rotateControl?: boolean;
  gestureHandling?: string;
  clickableIcons?: boolean;
}

interface MarkerInfo {
  marker: google.maps.marker.AdvancedMarkerElement;
  accuracyCircle?: google.maps.Circle;
}

class GoogleMapsService {
  private map: google.maps.Map | null = null;
  private isLoaded = false;
  private userMarker: MarkerInfo | null = null;

  async initialize(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Comprova si Google Maps ja està carregada
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        console.log("✅ Google Maps API ja estava carregada");
        return;
      }

      console.log("📦 Carregant Google Maps API...");
      await this.loadGoogleMapsScript();

      // Verificació final
      if (!window.google || !window.google.maps) {
        throw new Error("Google Maps API no s'ha carregat correctament");
      }

      this.isLoaded = true;
      console.log("✅ Google Maps API carregada i verificada");
    } catch (error) {
      console.error("❌ Error carregant Google Maps API:", error);
      this.isLoaded = false;
      throw error;
    }
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById("google-maps-script");
      if (existingScript) {
        if (window.google && window.google.maps) {
          resolve();
        } else {
          this.waitForGoogleMaps(resolve, reject);
        }
        return;
      }

      const callbackName = "initGoogleMaps" + Date.now();
      const windowWithCallback = getWindowWithCallback();
      windowWithCallback[callbackName] = () => {
        console.log("🔄 Callback de Google Maps executat");
        delete windowWithCallback[callbackName];
        this.waitForGoogleMaps(resolve, reject);
      };

      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,marker&loading=async&callback=${callbackName}`;
      script.async = true;

      script.onerror = (error) => {
        delete getWindowWithCallback()[callbackName];
        reject(new Error("Failed to load Google Maps script: " + error));
      };

      console.log("📦 Carregant script de Google Maps...");
      document.head.appendChild(script);
    });
  }

  private waitForGoogleMaps(
    resolve: () => void,
    reject: (error: Error) => void,
    attempts = 0
  ): void {
    const maxAttempts = 50;

    if (window.google && window.google.maps && window.google.maps.marker) {
      console.log("✅ Google Maps completament carregat");
      resolve();
      return;
    }

    if (attempts >= maxAttempts) {
      reject(new Error("Timeout esperant que Google Maps es carregui"));
      return;
    }

    setTimeout(() => {
      this.waitForGoogleMaps(resolve, reject, attempts + 1);
    }, 100);
  }

  async createMap(
    container: HTMLElement,
    config: GoogleMapsServiceConfig = {}
  ): Promise<google.maps.Map> {
    await this.initialize();

    if (!window.google || !window.google.maps) {
      throw new Error(
        "Google Maps API no està disponible després d'inicialitzar"
      );
    }

    const mapConfig = { ...DEFAULT_MAP_CONFIG, ...config };
    this.map = new google.maps.Map(container, mapConfig);

    console.log("🗺️ Mapa de Google Maps creat");
    return this.map;
  }

  private createStyledMarkerElement(): HTMLElement {
    // Contenidor principal - amb tots els estils resetejats
    const wrapper = document.createElement("div");

    // Reseteja TOTS els estils possibles per evitar interferències
    wrapper.style.cssText = `
      all: initial;
      position: relative !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      cursor: pointer !important;
      background: none !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      outline: none !important;
    `;

    // Icona de persona
    const markerPin = document.createElement("div");
    markerPin.textContent = "🙋";
    markerPin.style.cssText = `
      font-size: 20px !important;
      background-color: #ffffff !important;
      border-radius: 50% !important;
      border: 2px solid #dc2626 !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
      margin: 0 0 2px 0 !important;
      padding: 1rem !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 1.4rem !important;
      height: 1.4rem !important;
    `;

    // Títol "Ets aquí"
    const title = document.createElement("div");
    title.textContent = "Ets aquí";
    title.style.cssText = `
      font-size: 20px !important;
      font-weight: 600 !important;
      color: #374151 !important;
      background-color: #ffffff !important;
      padding: 1px 4px !important;
      border-radius: 4px !important;
      border: 1px solid #d1d5db !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
      white-space: nowrap !important;
      user-select: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      margin: 0 !important;
    `;

    wrapper.appendChild(markerPin);
    wrapper.appendChild(title);
    return wrapper;
  }

  updateUserLocation(location: LocationData): void {
    if (!this.map) {
      console.warn("⚠️ El mapa no està inicialitzat");
      return;
    }

    const { latitude, longitude, accuracy } = location;
    const position = { lat: latitude, lng: longitude };

    this.clearUserMarker();

    const markerElement = this.createStyledMarkerElement();

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      map: this.map,
      title: "Tu ets aquí",
      content: markerElement,
      zIndex: 1000,
    });

    const accuracyCircle = new google.maps.Circle({
      center: position,
      radius: accuracy,
      strokeColor: "#4a7c3c",
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: "#4a7c3c",
      fillOpacity: 0.06,
      map: this.map,
      clickable: false,
      zIndex: 100,
    });

    this.userMarker = {
      marker,
      accuracyCircle,
    };

    this.map.setCenter(position);
    this.map.setZoom(15);

    console.log("📍 Ubicació de l'usuari actualitzada:", location);
  }

  clearUserMarker(): void {
    if (this.userMarker) {
      this.userMarker.marker.map = null;
      if (this.userMarker.accuracyCircle) {
        this.userMarker.accuracyCircle.setMap(null);
      }
      this.userMarker = null;
    }
  }

  resize(): void {
    if (this.map) {
      google.maps.event.trigger(this.map, "resize");
    }
  }

  destroy(): void {
    // Neteja el marcador d'usuari
    this.clearUserMarker();

    // Reseteja l'estat del servei
    this.map = null;
    this.isLoaded = false;

    console.log("🗑️ GoogleMapsService destruït");
  }
}

export const googleMapsService = new GoogleMapsService();
