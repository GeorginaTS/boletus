import { SimpleWeatherData, WeatherData } from "@/types/weather";

/**
 * Servei per obtenir dades meteorològiques utilitzant OpenWeather API
 * API gratuïta: https://openweathermap.org/api
 * Límit gratuït: 1,000 crides/dia
 */

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = OPENWEATHER_API_KEY || "";

    if (!this.apiKey) {
      console.warn(
        "⚠️ VITE_OPENWEATHER_API_KEY no està definida. Les dades meteorològiques no funcionaran."
      );
    }
  }

  /**
   * Obté les dades meteorològiques actuals per coordenades
   */
  async getCurrentWeather(
    latitude: number,
    longitude: number
  ): Promise<SimpleWeatherData | null> {
    if (!this.apiKey) {
      console.error("OpenWeather API key no configurada");
      return null;
    }

    try {
      const url = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&lang=ca`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: WeatherData = await response.json();

      return this.transformWeatherData(data);
    } catch (error) {
      console.error("Error obtenint dades meteorològiques:", error);
      return null;
    }
  }

  /**
   * Transforma les dades de l'API a un format més simple
   */
  private transformWeatherData(data: WeatherData): SimpleWeatherData {
    const precipitation = data.rain?.["1h"] || data.snow?.["1h"] || 0;

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0]?.description || "Desconegut",
      icon: data.weather[0]?.icon || "01d",
      windSpeed: data.wind.speed,
      precipitation,
      cloudCoverage: data.clouds.all,
      pressure: data.main.pressure,
      cityName: data.name,
    };
  }

  /**
   * Retorna la URL de l'icona del temps
   */
  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  /**
   * Determina si les condicions són bones per buscar bolets
   * Basant-se en humitat, precipitació recent i temperatura
   */
  isGoodForMushrooms(weather: SimpleWeatherData): {
    isGood: boolean;
    score: number;
    reasons: string[];
  } {
    let score = 0;
    const reasons: string[] = [];

    // Humitat ideal: 70-95%
    if (weather.humidity >= 70 && weather.humidity <= 95) {
      score += 35;
      reasons.push("✓ Humitat ideal");
    } else if (weather.humidity >= 60) {
      score += 20;
      reasons.push("~ Humitat acceptable");
    } else {
      reasons.push("✗ Humitat baixa");
    }

    // Temperatura ideal: 10-25°C
    if (weather.temperature >= 10 && weather.temperature <= 25) {
      score += 30;
      reasons.push("✓ Temperatura ideal");
    } else if (weather.temperature >= 5 && weather.temperature <= 30) {
      score += 15;
      reasons.push("~ Temperatura acceptable");
    } else {
      reasons.push("✗ Temperatura no ideal");
    }

    // Precipitació recent és bona
    if (weather.precipitation && weather.precipitation > 0) {
      score += 20;
      reasons.push("✓ Pluja recent");
    }

    // Núvols (millor si hi ha alguns núvols)
    if (weather.cloudCoverage >= 30 && weather.cloudCoverage <= 80) {
      score += 15;
      reasons.push("✓ Núvols moderat");
    } else if (weather.cloudCoverage > 80) {
      score += 5;
      reasons.push("~ Molt núvol");
    }

    return {
      isGood: score >= 60,
      score,
      reasons,
    };
  }

  /**
   * Retorna un emoji representatiu del temps
   */
  getWeatherEmoji(iconCode: string): string {
    const emojiMap: Record<string, string> = {
      "01d": "☀️", // clear sky day
      "01n": "🌙", // clear sky night
      "02d": "🌤️", // few clouds day
      "02n": "☁️", // few clouds night
      "03d": "☁️", // scattered clouds
      "03n": "☁️",
      "04d": "☁️", // broken clouds
      "04n": "☁️",
      "09d": "🌧️", // shower rain
      "09n": "🌧️",
      "10d": "🌦️", // rain day
      "10n": "🌧️", // rain night
      "11d": "⛈️", // thunderstorm
      "11n": "⛈️",
      "13d": "🌨️", // snow
      "13n": "🌨️",
      "50d": "🌫️", // mist
      "50n": "🌫️",
    };

    return emojiMap[iconCode] || "🌡️";
  }
}

export const weatherService = new WeatherService();
