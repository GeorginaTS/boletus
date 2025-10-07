/**
 * Servei de Geocodificació Inversa amb Google Geocoding API
 *
 * Converteix coordenades (lat, lng) en informació d'ubicació llegible
 * (ciutat, província, país, etc.)
 */

const GOOGLE_GEOCODING_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_GEOCODING_API_URL =
  "https://maps.googleapis.com/maps/api/geocode/json";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeocodingResult {
  city?: string; // Població/ciutat
  province?: string; // Província/comarca
  country?: string; // País
  formattedAddress?: string; // Adreça completa formatada
}

class GeocodingService {
  /**
   * Obté la informació d'ubicació des de coordenades
   * @param lat Latitud
   * @param lng Longitud
   * @returns Informació d'ubicació o null si falla
   */
  async getLocationInfo(
    lat: number,
    lng: number
  ): Promise<GeocodingResult | null> {
    try {
      if (!GOOGLE_GEOCODING_API_KEY) {
        console.error("VITE_GOOGLE_MAPS_API_KEY no està definida");
        return null;
      }

      const url = `${GOOGLE_GEOCODING_API_URL}?latlng=${lat},${lng}&key=${GOOGLE_GEOCODING_API_KEY}&language=ca`;
      console.log(
        "Cridant Geocoding API:",
        url.replace(GOOGLE_GEOCODING_API_KEY, "HIDDEN")
      );

      const response = await fetch(url);
      const data = await response.json();

      console.log("Resposta Geocoding API:", data);

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        console.warn(
          "Geocoding API no ha retornat resultats:",
          data.status,
          data.error_message
        );
        return null;
      }

      // Processar el primer resultat
      const result = data.results[0];
      const addressComponents: AddressComponent[] = result.address_components;

      // Extreure informació rellevant
      const locationInfo: GeocodingResult = {
        formattedAddress: result.formatted_address,
      };

      // Buscar ciutat/població (locality o postal_town)
      const locality = addressComponents.find(
        (component: AddressComponent) =>
          component.types.includes("locality") ||
          component.types.includes("postal_town")
      );
      if (locality) {
        locationInfo.city = locality.long_name;
      }

      // Si no hi ha locality, buscar administrative_area_level_3 (pobles petits)
      if (!locationInfo.city) {
        const adminLevel3 = addressComponents.find(
          (component: AddressComponent) =>
            component.types.includes("administrative_area_level_3")
        );
        if (adminLevel3) {
          locationInfo.city = adminLevel3.long_name;
        }
      }

      // Província/comarca (administrative_area_level_2)
      const province = addressComponents.find((component: AddressComponent) =>
        component.types.includes("administrative_area_level_2")
      );
      if (province) {
        locationInfo.province = province.long_name;
      }

      // País
      const country = addressComponents.find((component: AddressComponent) =>
        component.types.includes("country")
      );
      if (country) {
        locationInfo.country = country.long_name;
      }

      return locationInfo;
    } catch (error) {
      console.error("Error al cridar Google Geocoding API:", error);
      return null;
    }
  }

  /**
   * Obté només el nom de la ciutat/població
   * @param lat Latitud
   * @param lng Longitud
   * @returns Nom de la ciutat o null
   */
  async getCityName(lat: number, lng: number): Promise<string | null> {
    const locationInfo = await this.getLocationInfo(lat, lng);
    return locationInfo?.city || null;
  }

  /**
   * Obté la ciutat, província i el país
   * @param lat Latitud
   * @param lng Longitud
   * @returns Objecte amb ciutat, província i país o null
   */
  async getCityAndCountry(
    lat: number,
    lng: number
  ): Promise<{
    city: string | null;
    province: string | null;
    country: string | null;
  } | null> {
    const locationInfo = await this.getLocationInfo(lat, lng);
    if (!locationInfo) return null;

    return {
      city: locationInfo.city || null,
      province: locationInfo.province || null,
      country: locationInfo.country || null,
    };
  }

  /**
   * Obté una descripció curta de la ubicació (ciutat, província)
   * @param lat Latitud
   * @param lng Longitud
   * @returns Descripció curta o null
   */
  async getShortLocation(lat: number, lng: number): Promise<string | null> {
    const locationInfo = await this.getLocationInfo(lat, lng);

    if (!locationInfo) return null;

    const parts: string[] = [];

    if (locationInfo.city) {
      parts.push(locationInfo.city);
    }

    if (locationInfo.province && locationInfo.province !== locationInfo.city) {
      parts.push(locationInfo.province);
    }

    return parts.length > 0 ? parts.join(", ") : null;
  }
}

export const geocodingService = new GeocodingService();
