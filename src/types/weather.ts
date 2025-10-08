// Tipus per dades meteorològiques

export interface WeatherCondition {
  id: number;
  main: string; // "Clear", "Clouds", "Rain", etc.
  description: string; // "clear sky", "few clouds", etc.
  icon: string; // codi de l'icona d'OpenWeather
}

export interface WeatherMain {
  temp: number; // Temperatura en Celsius
  feels_like: number; // Sensació tèrmica
  temp_min: number;
  temp_max: number;
  pressure: number; // Pressió atmosfèrica en hPa
  humidity: number; // Humitat en %
}

export interface WeatherWind {
  speed: number; // Velocitat del vent en m/s
  deg: number; // Direcció del vent en graus
  gust?: number; // Ràfegues de vent (opcional)
}

export interface WeatherClouds {
  all: number; // Percentatge de núvols
}

export interface WeatherRain {
  "1h"?: number; // Precipitació en l'última hora (mm)
  "3h"?: number; // Precipitació en les últimes 3 hores (mm)
}

export interface WeatherSnow {
  "1h"?: number; // Neu en l'última hora (mm)
  "3h"?: number; // Neu en les últimes 3 hores (mm)
}

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: WeatherMain;
  visibility: number; // Visibilitat en metres
  wind: WeatherWind;
  clouds: WeatherClouds;
  rain?: WeatherRain;
  snow?: WeatherSnow;
  dt: number; // Timestamp Unix
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number; // Timestamp Unix
    sunset: number; // Timestamp Unix
  };
  timezone: number; // Desplaçament UTC en segons
  id: number; // ID de la ciutat
  name: string; // Nom de la ciutat
  cod: number; // Codi de resposta
}

// Tipus simplificat per l'app
export interface SimpleWeatherData {
  temperature: number; // Temperatura actual en °C
  feelsLike: number; // Sensació tèrmica en °C
  humidity: number; // Humitat en %
  description: string; // Descripció del temps
  icon: string; // Codi de l'icona
  windSpeed: number; // Velocitat del vent en m/s
  precipitation?: number; // Precipitació en mm (si hi ha)
  cloudCoverage: number; // Percentatge de núvols
  pressure: number; // Pressió atmosfèrica
  cityName: string; // Nom de la ciutat
}
