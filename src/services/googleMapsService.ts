import { Location } from "@/types/location";
import { firestoreService } from "@services/firestoreService";
import { LocationData } from "@services/geolocationService";

// Tipus per a callback functions dinàmiques de Google Maps
type GoogleMapsCallbackFunction = () => void;

// Helper function per accedir a window amb callbacks dinàmics de forma segura
const getWindowWithCallback = () =>
  window as unknown as Window & Record<string, GoogleMapsCallbackFunction>;

// Configuració per defecte de Google Maps (sense referències a google.maps que no està carregat encara)
const DEFAULT_MAP_CONFIG = {
  center: { lat: 41.3851, lng: 2.1734 }, // Barcelona per defecte
  zoom: 13,
  mapTypeId: "terrain", // Mapa en relleu per defecte - mostra topografia i elevació
  mapId: "MUSHROOM_FINDER_MAP", // Necessari per AdvancedMarkerElement
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true, // Controls per canviar tipus de mapa (roadmap, satellite, hybrid, terrain)
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
  mapTypeId?: string; // Canviat per acceptar strings abans que Google Maps es carregui
  mapId?: string;
  disableDefaultUI?: boolean;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  scaleControl?: boolean;
  streetViewControl?: boolean;
  rotateControl?: boolean;
  gestureHandling?: string;
  clickableIcons?: boolean;
  mapTypeControlOptions?: {
    style?: google.maps.MapTypeControlStyle;
    position?: google.maps.ControlPosition;
    mapTypeIds?: string[];
  };
}

interface MarkerInfo {
  marker: google.maps.marker.AdvancedMarkerElement;
  accuracyCircle?: google.maps.Circle;
}

interface LocationMarkerInfo {
  marker: google.maps.marker.AdvancedMarkerElement;
  location: Location;
}

class GoogleMapsService {
  private map: google.maps.Map | null = null;
  private isLoaded = false;
  private userMarker: MarkerInfo | null = null;
  private locationMarkers: LocationMarkerInfo[] = [];

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

    // Afegeix configuració avançada dels controls de tipus de mapa
    if (mapConfig.mapTypeControl) {
      mapConfig.mapTypeControlOptions = {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT,
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP, // Mapa de carreteres tradicional
          google.maps.MapTypeId.SATELLITE, // Vista de satèl·lit
          google.maps.MapTypeId.HYBRID, // Satèl·lit amb etiquetes
          google.maps.MapTypeId.TERRAIN, // Mapa topogràfic amb relleu
        ],
        ...config.mapTypeControlOptions,
      };
    }

    this.map = new google.maps.Map(container, mapConfig);

    console.log("🗺️ Mapa de Google Maps creat amb mode terrain (relleu)");
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

  private createMushroomMarkerElement(location: Location): HTMLElement {
    // Contenidor principal
    const wrapper = document.createElement("div");
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

    // Icona de bolet
    const markerPin = document.createElement("div");
    markerPin.textContent = "🍄";
    markerPin.style.cssText = `
      font-size: 24px !important;
      background-color: #ffffff !important;
      border-radius: 50% !important;
      border: 2px solid #7c3aed !important;
      box-shadow: 0 3px 6px rgba(0,0,0,0.4) !important;
      margin: 0 0 2px 0 !important;
      padding: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 1.8rem !important;
      height: 1.8rem !important;
      transition: transform 0.2s ease !important;
    `;

    // Efecte hover
    markerPin.addEventListener("mouseenter", () => {
      markerPin.style.transform = "scale(1.1)";
    });
    markerPin.addEventListener("mouseleave", () => {
      markerPin.style.transform = "scale(1)";
    });

    // Títol amb el nom de la localització
    const title = document.createElement("div");
    title.textContent = location.name;
    title.style.cssText = `
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #374151 !important;
      background-color: #ffffff !important;
      padding: 2px 6px !important;
      border-radius: 4px !important;
      border: 1px solid #d1d5db !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
      white-space: nowrap !important;
      user-select: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      margin: 0 !important;
      max-width: 120px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
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

    // Ajusta el zoom per incloure la nova posició de l'usuari i totes les localitzacions
    this.fitBoundsToAllLocations();

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

  async loadAndDisplayLocations(userId?: string): Promise<void> {
    if (!this.map) {
      console.warn("⚠️ El mapa no està inicialitzat");
      return;
    }

    try {
      console.log("📍 Carregant localitzacions de Firestore...");

      // Neteja markers existents
      this.clearLocationMarkers();

      // Carrega localitzacions de Firestore (de l'usuari o totes)
      const locations = userId
        ? await firestoreService.getUserLocations(userId)
        : await firestoreService.getAllLocations();

      console.log(
        `✅ Carregades ${locations.length} localitzacions${
          userId ? " de l'usuari" : ""
        }`
      );

      // Crea markers per cada localització
      locations.forEach((location) => {
        this.addLocationMarker(location);
      });

      // Ajusta el zoom per incloure totes les localitzacions i la posició de l'usuari
      this.fitBoundsToAllLocations();
    } catch (error) {
      console.error("❌ Error carregant localitzacions:", error);
    }
  }

  private addLocationMarker(location: Location): void {
    if (!this.map || !location.lat || !location.lng) {
      console.warn("⚠️ Dades insuficients per crear marker:", location);
      return;
    }

    const position = { lat: location.lat, lng: location.lng };
    const markerElement = this.createMushroomMarkerElement(location);

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      map: this.map,
      title: location.name,
      content: markerElement,
      zIndex: 500,
    });

    // Afegir click listener per mostrar informació
    marker.addListener("click", () => {
      console.log("🍄 Localització seleccionada:", location);
      // Aquí es podria obrir un modal o tooltip amb més informació
    });

    this.locationMarkers.push({
      marker,
      location,
    });

    console.log(`🍄 Marker afegit per: ${location.name}`);
  }

  clearLocationMarkers(): void {
    this.locationMarkers.forEach(({ marker }) => {
      marker.map = null;
    });
    this.locationMarkers = [];
    console.log("🧹 Markers de localitzacions netejats");
  }

  addLocation(location: Location): void {
    this.addLocationMarker(location);
    // Ajusta el zoom per incloure la nova localització
    this.fitBoundsToAllLocations();
  }

  removeLocation(locationId: string): void {
    const index = this.locationMarkers.findIndex(
      ({ location }) => location.id === locationId
    );

    if (index !== -1) {
      this.locationMarkers[index].marker.map = null;
      this.locationMarkers.splice(index, 1);
      console.log(`🗑️ Marker eliminat per localització: ${locationId}`);

      // Ajusta el zoom després d'eliminar la localització
      this.fitBoundsToAllLocations();
    }
  }

  focusOnLocation(location: Location): void {
    if (!this.map) {
      console.warn("⚠️ El mapa no està inicialitzat");
      return;
    }

    const position = { lat: location.lat, lng: location.lng };

    // Centra el mapa en la localització
    this.map.setCenter(position);
    this.map.setZoom(16);

    // Troba el marker corresponent i fes un efecte visual
    const locationMarker = this.locationMarkers.find(
      ({ location: loc }) => loc.id === location.id
    );

    if (locationMarker) {
      // Simula un click per mostrar la informació
      google.maps.event.trigger(locationMarker.marker, "click");
    }

    console.log(`🎯 Mapa centrat en: ${location.name}`);
  }

  /**
   * Ajusta el zoom del mapa per incloure totes les localitzacions i la posició de l'usuari
   */
  fitBoundsToAllLocations(): void {
    if (!this.map) {
      console.warn("⚠️ El mapa no està inicialitzat");
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    let hasLocations = false;

    // Afegeix la posició de l'usuari als bounds
    if (this.userMarker) {
      const userPosition = this.userMarker.marker.position;
      if (userPosition) {
        bounds.extend(userPosition);
        hasLocations = true;
        console.log("📍 Posició de l'usuari afegida als bounds");
      }
    }

    // Afegeix totes les localitzacions als bounds
    this.locationMarkers.forEach(({ marker }) => {
      const position = marker.position;
      if (position) {
        bounds.extend(position);
        hasLocations = true;
      }
    });

    if (hasLocations) {
      // Aplica els bounds amb padding
      this.map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });

      // Limita el zoom màxim per evitar que sigui massa proper
      const maxZoom = 16;
      const listener = google.maps.event.addListener(
        this.map,
        "bounds_changed",
        () => {
          if (this.map && this.map.getZoom()! > maxZoom) {
            this.map.setZoom(maxZoom);
          }
          google.maps.event.removeListener(listener);
        }
      );

      console.log(
        `🗺️ Mapa ajustat per incloure ${this.locationMarkers.length} localitzacions i la posició de l'usuari`
      );
    } else {
      // Si no hi ha localitzacions, centra en Barcelona per defecte
      this.map.setCenter(DEFAULT_MAP_CONFIG.center);
      this.map.setZoom(DEFAULT_MAP_CONFIG.zoom);
      console.log(
        "🗺️ No hi ha localitzacions, utilitzant configuració per defecte"
      );
    }
  }
  resize(): void {
    if (this.map) {
      google.maps.event.trigger(this.map, "resize");
    }
  }

  /**
   * Canvia el tipus de mapa dinàmicament
   */
  setMapType(mapType: google.maps.MapTypeId): void {
    if (!this.map) {
      console.warn("⚠️ El mapa no està inicialitzat");
      return;
    }

    this.map.setMapTypeId(mapType);

    const mapTypeNames = {
      [google.maps.MapTypeId.ROADMAP]: "Mapa de carreteres",
      [google.maps.MapTypeId.SATELLITE]: "Vista de satèl·lit",
      [google.maps.MapTypeId.HYBRID]: "Híbrid (satèl·lit + etiquetes)",
      [google.maps.MapTypeId.TERRAIN]: "Mapa topogràfic (relleu)",
    };

    console.log(
      `🗺️ Tipus de mapa canviat a: ${mapTypeNames[mapType] || mapType}`
    );
  }

  /**
   * Obté el tipus de mapa actual
   */
  getCurrentMapType(): string | null {
    if (!this.map) {
      return null;
    }
    return this.map.getMapTypeId() || null;
  }

  /**
   * Activa/desactiva el mode relleu (terrain)
   */
  toggleTerrainMode(): void {
    if (!this.map) {
      console.warn("⚠️ El mapa no està inicialitzat");
      return;
    }

    const currentType = this.map.getMapTypeId();
    if (currentType === google.maps.MapTypeId.TERRAIN) {
      this.setMapType(google.maps.MapTypeId.ROADMAP);
    } else {
      this.setMapType(google.maps.MapTypeId.TERRAIN);
    }
  }

  /**
   * Mètode públic per ajustar manualment el zoom del mapa
   */
  fitBoundsToLocations(): void {
    this.fitBoundsToAllLocations();
  }

  destroy(): void {
    // Neteja tots els marcadors
    this.clearUserMarker();
    this.clearLocationMarkers();

    // Reseteja l'estat del servei
    this.map = null;
    this.isLoaded = false;

    console.log("🗑️ GoogleMapsService destruït");
  }
}

export const googleMapsService = new GoogleMapsService();
