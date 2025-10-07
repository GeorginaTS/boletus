import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import {
  geolocationService,
  LocationData,
  LocationError,
} from "@services/geolocationService";
import {
  locateOutline,
  locationOutline,
  navigateOutline,
  refreshOutline,
} from "ionicons/icons";
import React from "react";
import "../pages/AddLocation.css";

interface LocationInfoCardProps {
  location: LocationData | null;
  loading: boolean;
  error: LocationError | null;
  accuracy: number | null;
  isHighAccuracy: boolean;
  cityName: string | null;
  provinceName: string | null;
  countryName: string | null;
  isLoadingCity: boolean;
  onUpdateLocation: () => void;
  onHighAccuracyLocation: () => void;
}

const LocationInfoCard: React.FC<LocationInfoCardProps> = ({
  location,
  loading,
  error,
  accuracy,
  isHighAccuracy,
  cityName,
  provinceName,
  countryName,
  isLoadingCity,
  onUpdateLocation,
  onHighAccuracyLocation,
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>La Teva Ubicació</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {loading && (
          <div>
            <p>Obtenint ubicació...</p>
          </div>
        )}

        {error && !loading && (
          <div>
            <IonIcon icon={locationOutline} color="danger" />
            <p>{error?.message}</p>
            <IonButton fill="outline" onClick={onUpdateLocation} size="small">
              <IonIcon icon={refreshOutline} slot="start" />
              Reintentar
            </IonButton>
          </div>
        )}

        {location && !loading && (
          <IonList>
            <IonItem lines="none">
              <IonIcon icon={navigateOutline} slot="start" color="primary" />
              <IonLabel>
                <h3>Coordenades</h3>
                <p>{geolocationService.formatCoordinates(location)}</p>
                {/* Mostrar ciutat, província i país si estan disponibles */}
                {(cityName || provinceName || countryName || isLoadingCity) && (
                  <p>
                    {isLoadingCity
                      ? "Obtenint població..."
                      : [cityName, provinceName, countryName]
                          .filter(Boolean)
                          .join(", ")}
                  </p>
                )}
              </IonLabel>
            </IonItem>
            {accuracy && (
              <IonItem lines="none">
                <IonIcon
                  icon={locateOutline}
                  slot="start"
                  color={
                    isHighAccuracy
                      ? "success"
                      : accuracy > 50
                      ? "danger"
                      : "warning"
                  }
                />
                <IonLabel>
                  <h3>Precisió GPS</h3>
                  <p>
                    ±{accuracy.toFixed(0)}m{accuracy <= 20 && " (Excel·lent)"}
                    {accuracy > 20 && accuracy <= 50 && " (OK)"}
                    {accuracy > 50 && " (Baixa)"}
                  </p>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
        )}
        <div className="form-actions">
          <IonButton onClick={onUpdateLocation} disabled={loading} size="small">
            <IonIcon icon={refreshOutline} slot="start" />
            {location ? "Actualitzar" : "Obtenir"}
          </IonButton>

          {location && accuracy && accuracy > 20 && (
            <IonButton
              onClick={onHighAccuracyLocation}
              disabled={loading}
              size="small"
              fill="outline"
              color="primary"
            >
              <IonIcon icon={locateOutline} slot="start" />
              Precisió
            </IonButton>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default LocationInfoCard;
