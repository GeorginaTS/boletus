import { SimpleWeatherData } from "@/types/weather";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { weatherService } from "@services/weatherService";
import {
  cloudyOutline,
  leafOutline,
  speedometerOutline,
  waterOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import "./WeatherInfo.css";

interface WeatherInfoProps {
  latitude: number;
  longitude: number;
  showMushroomForecast?: boolean; // Mostra predicció per bolets
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({
  latitude,
  longitude,
  showMushroomForecast = true,
}) => {
  const [weather, setWeather] = useState<SimpleWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeather();
  }, [latitude, longitude]);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await weatherService.getCurrentWeather(latitude, longitude);

      if (data) {
        setWeather(data);
      } else {
        setError("No s'han pogut carregar les dades meteorològiques");
      }
    } catch (err) {
      setError("Error carregant el temps");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <IonCard>
        <IonCardContent className="ion-text-center">
          <IonSpinner />
          <p>Carregant informació meteorològica...</p>
        </IonCardContent>
      </IonCard>
    );
  }

  if (error || !weather) {
    return (
      <IonCard>
        <IonCardContent className="ion-text-center">
          <p>⚠️ {error || "No disponible"}</p>
        </IonCardContent>
      </IonCard>
    );
  }

  const mushroomForecast = showMushroomForecast
    ? weatherService.isGoodForMushrooms(weather)
    : null;

  const weatherEmoji = weatherService.getWeatherEmoji(weather.icon);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{weatherEmoji} Temps Actual</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {/* Temperatura i descripció */}
        <div className="weather-main">
          <div>
            <span className="temp-value">{weather.temperature}°</span>
            <div className="temp-feels">Sensació: {weather.feelsLike}°</div>
          </div>
          <div className="weather-description">
            <p>
              {weather.description.charAt(0).toUpperCase() +
                weather.description.slice(1)}
            </p>
            {weather.cityName && (
              <p className="ion-text-muted">📍 {weather.cityName}</p>
            )}
          </div>
        </div>

        {/* Detalls meteorològics - Utilitzant card-info global */}
        <ul className="card-info weather-details">
          <li className="card-info-item">
            <IonIcon icon={waterOutline} />
            <div>
              <strong>Humitat</strong>
              <p>{weather.humidity}%</p>
            </div>
          </li>

          <li className="card-info-item">
            <IonIcon icon={cloudyOutline} />
            <div>
              <strong>Núvols</strong>
              <p>{weather.cloudCoverage}%</p>
            </div>
          </li>

          <li className="card-info-item">
            <IonIcon icon={speedometerOutline} />
            <div>
              <strong>Vent</strong>
              <p>{weather.windSpeed.toFixed(1)} m/s</p>
            </div>
          </li>

          {weather.precipitation !== undefined && weather.precipitation > 0 && (
            <li className="card-info-item">
              <span style={{ fontSize: "1.5rem" }}>💧</span>
              <div>
                <strong>Precipitació</strong>
                <p>{weather.precipitation} mm/h</p>
              </div>
            </li>
          )}
        </ul>

        {/* Predicció per bolets */}
        {mushroomForecast && (
          <div className="info-section">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              <IonIcon icon={leafOutline} />
              <strong>Condicions per bolets</strong>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${mushroomForecast.score}%` }}
                ></div>
              </div>
              <span
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 600,
                  minWidth: "50px",
                  textAlign: "right",
                }}
              >
                {mushroomForecast.score}/100
              </span>
            </div>
            <ul className="forecast-reasons">
              {mushroomForecast.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default WeatherInfo;
