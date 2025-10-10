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
  infoWindow?: google.maps.InfoWindow;
  isClickedOpen?: boolean; // Per controlar si l'InfoWindow està oberta per clic
}

class GoogleMapsService {
  private map: google.maps.Map | null = null;
  private isLoaded = false;
  private userMarker: MarkerInfo | null = null;
  private locationMarkers: LocationMarkerInfo[] = [];
  private onLocationClickCallback?: (location: Location) => void;

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

    // Afegir event listener per tancar InfoWindows quan es clica al mapa
    this.map.addListener("click", () => {
      this.closeAllInfoWindows();
    });

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

    wrapper.className = "user-marker";

    // Pin amb icona de persona
    const markerPin = document.createElement("div");
    markerPin.className = "user-marker-pin";
    markerPin.innerHTML = `<span class="user-marker-icon">🙋</span>`;

    // Títol "Ets aquí"
    const title = document.createElement("div");
    title.className = "user-marker-title";
    title.textContent = "Ets aquí";
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

    wrapper.className = "mushroom-marker";

    // Pin amb icona de bolet
    const markerPin = document.createElement("div");
    markerPin.className = "mushroom-marker-pin";
    markerPin.innerHTML = `<span class="mushroom-marker-icon">🍄</span>`;

    // Títol amb el nom de la localització
    const title = document.createElement("div");
    title.className = "mushroom-marker-title";
    title.textContent = location.name;
    wrapper.appendChild(markerPin);
    wrapper.appendChild(title);
    return wrapper;
  }

  private createInfoWindowContent(location: Location): string {
    const formattedDate = location.createdAt
      ? new Date(location.createdAt).toLocaleDateString("ca-ES", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Data desconeguda";

    // Icones d'Ionic com SVG (nutritionOutline, locationOutline, navigateCircleOutline, calendarOutline)
    const mushroomIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 20px; height: 20px;"><path fill="currentColor" d="M336,192a16,16,0,1,0,16,16A16,16,0,0,0,336,192Z"/><path fill="currentColor" d="M336,256a16,16,0,1,0,16,16A16,16,0,0,0,336,256Z"/><path fill="currentColor" d="M256,416c-21.12,0-41.05-8.29-56.08-23.33S176,361.12,176,340V308H160a16,16,0,0,1,0-32h16V245.31c-8.61-.89-15.93-7.39-16-16.11V192c0-17.67,14.33-45.33,32-48,14.25-2.14,23,12.87,30.42,24.14l9.68,14.71h73.8l9.68-14.71C323,156.87,331.75,141.86,346,144c17.67,2.67,32,30.33,32,48v37.2c-.07,8.72-7.39,15.22-16,16.11V276h16a16,16,0,0,1,0,32H362v32c0,21.12-8.29,41.05-23.33,56.08S277.12,416,256,416Z"/><path fill="currentColor" d="M416,112H96c-26.47,0-48,21.53-48,48s21.53,48,48,48h16c0-17.64,14.36-32,32-32s32,14.36,32,32h48c0-17.64,14.36-32,32-32s32,14.36,32,32h48c0-17.64,14.36-32,32-32s32,14.36,32,32h16c26.47,0,48-21.53,48-48S442.47,112,416,112Z"/></svg>`;
    const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 16px; height: 16px;"><path fill="currentColor" d="M256,48c-79.5,0-144,61.39-144,137,0,87,96,224.87,131.25,272.49a15.77,15.77,0,0,0,25.5,0C304,409.89,400,272.07,400,185,400,109.39,335.5,48,256,48Zm0,207a64,64,0,1,1,64-64A64.07,64.07,0,0,1,256,255Z"/></svg>`;
    const compassIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 16px; height: 16px;"><path fill="currentColor" d="M256,464C141.31,464,48,370.69,48,256S141.31,48,256,48s208,93.31,208,208S370.69,464,256,464Zm88.67-206.71L300,199.65a16,16,0,0,0-7.65-7.65l-57.64-44.67a16,16,0,0,0-19.43,0L157.64,192a16,16,0,0,0-7.65,7.65l-44.67,57.64a16,16,0,0,0,0,19.43L160,334.36a16,16,0,0,0,7.65,7.65l57.64,44.67a16,16,0,0,0,19.43,0L302.36,342a16,16,0,0,0,7.65-7.65l44.67-57.64A16,16,0,0,0,344.67,257.29Z"/></svg>`;
    const calendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 16px; height: 16px;"><path fill="currentColor" d="M480,128a64,64,0,0,0-64-64H400V48a16,16,0,0,0-32,0V64H144V48a16,16,0,0,0-32,0V64H96a64,64,0,0,0-64,64v12a4,4,0,0,0,4,4H476a4,4,0,0,0,4-4Z"/><path fill="currentColor" d="M32,416a64,64,0,0,0,64,64H416a64,64,0,0,0,64-64V179a3,3,0,0,0-3-3H35a3,3,0,0,0-3,3Zm344-168a24,24,0,1,1-24,24A24,24,0,0,1,376,248Zm0,80a24,24,0,1,1-24,24A24,24,0,0,1,376,328Zm-96-80a24,24,0,1,1-24,24A24,24,0,0,1,280,248Zm0,80a24,24,0,1,1-24,24A24,24,0,0,1,280,328Zm-96-80a24,24,0,1,1-24,24A24,24,0,0,1,184,248Zm0,80a24,24,0,1,1-24,24A24,24,0,0,1,184,328Zm-88-80a24,24,0,1,1-24,24A24,24,0,0,1,96,248Zm0,80a24,24,0,1,1-24,24A24,24,0,0,1,96,328Z"/></svg>`;

    return `
      <div class="map-info-window" onclick="window.navigateToLocation('${
        location.id
      }')" style="cursor: pointer;">
        <div class="map-info-header">
          <h3 class="map-info-title">
            ${mushroomIcon}
            ${location.name}
          </h3>
        </div>
        
        <div class="map-info-body">
          ${
            location.description
              ? `<p class="map-info-description">${location.description}</p>`
              : ""
          }
          
          <div class="map-info-metadata">
            ${
              location.city
                ? `
              <div class="map-info-row">
                ${locationIcon}
                <span class="map-info-value">${location.city}</span>
              </div>
            `
                : ""
            }
            
            <div class="map-info-row">
              ${compassIcon}
              <span class="map-info-value">${location.lat.toFixed(
                6
              )}°, ${location.lng.toFixed(6)}°</span>
            </div>
            
            <div class="map-info-row">
              ${calendarIcon}
              <span class="map-info-value">${formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    `;
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

  async loadAndDisplayLocations(
    userId?: string,
    onLocationClick?: (location: Location) => void
  ): Promise<void> {
    // Guardar el callback per utilitzar-lo a les InfoWindows
    this.onLocationClickCallback = onLocationClick;

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

    // Crear InfoWindow amb les dades de la localització
    const infoWindow = new google.maps.InfoWindow({
      content: this.createInfoWindowContent(location),
      disableAutoPan: false,
    });

    // Mostrar InfoWindow quan el ratolí passa per sobre (només si no està oberta per clic)
    marker.addListener("mouseenter", () => {
      const markerInfo = this.locationMarkers.find((m) => m.marker === marker);
      if (markerInfo && !markerInfo.isClickedOpen) {
        // Tancar totes les altres InfoWindows abans d'obrir aquesta
        this.closeAllInfoWindows();
        infoWindow.open({
          anchor: marker,
          map: this.map!,
        });
      }
    });

    // Tancar InfoWindow quan el ratolí surt (només si no està oberta per clic)
    marker.addListener("mouseleave", () => {
      const markerInfo = this.locationMarkers.find((m) => m.marker === marker);
      if (markerInfo && !markerInfo.isClickedOpen) {
        infoWindow.close();
      }
    });

    // Afegir click listener per obrir la InfoWindow de forma permanent
    marker.addListener("click", () => {
      console.log("🍄 Obrint InfoWindow de la localització:", location);
      // Tancar totes les altres InfoWindows abans d'obrir aquesta
      this.closeAllInfoWindows();

      // Marcar que aquesta InfoWindow està oberta per clic
      const markerInfo = this.locationMarkers.find((m) => m.marker === marker);
      if (markerInfo) {
        markerInfo.isClickedOpen = true;
      }

      infoWindow.open({
        anchor: marker,
        map: this.map!,
      });
      // Centra en la localització amb un petit zoom
      if (this.map) {
        this.map.setCenter(position);
        this.map.setZoom(15);
      }
    });

    this.locationMarkers.push({
      marker,
      location,
      infoWindow,
      isClickedOpen: false,
    });

    console.log(`🍄 Marker afegit per: ${location.name}`);
  }

  private closeAllInfoWindows(): void {
    this.locationMarkers.forEach((markerInfo) => {
      if (markerInfo.infoWindow) {
        markerInfo.infoWindow.close();
      }
      // Resetejar l'estat de clic quan es tanca
      markerInfo.isClickedOpen = false;
    });
  }

  clearLocationMarkers(): void {
    this.locationMarkers.forEach(({ marker, infoWindow }) => {
      if (infoWindow) {
        infoWindow.close();
      }
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
      const { marker, infoWindow } = this.locationMarkers[index];
      if (infoWindow) {
        infoWindow.close();
      }
      marker.map = null;
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

// Funció global per navegar des de les InfoWindows
declare global {
  interface Window {
    navigateToLocation?: (locationId: string) => void;
  }
}

// Crear una instància singleton del servei
const googleMapsServiceInstance = new GoogleMapsService();

// Funció global que pot ser cridada des de l'HTML de les InfoWindows
window.navigateToLocation = (locationId: string) => {
  // Buscar la localització amb aquest ID entre els markers actuals
  const markerInfo = googleMapsServiceInstance["locationMarkers"].find(
    (marker) => marker.location.id === locationId
  );

  if (markerInfo && googleMapsServiceInstance["onLocationClickCallback"]) {
    googleMapsServiceInstance["onLocationClickCallback"](markerInfo.location);
  }
};

export { googleMapsServiceInstance as googleMapsService };
