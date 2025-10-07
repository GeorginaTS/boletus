import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonItem,
    IonLabel,
    IonList
} from '@ionic/react';
import { geolocationService, LocationData, LocationError } from '@services/geolocationService';
import { locateOutline, locationOutline, navigateOutline, refreshOutline } from 'ionicons/icons';
import React from 'react';

interface LocationInfoCardProps {
  location: LocationData | null;
  loading: boolean;
  error: LocationError | null;
  accuracy: number | null;
  isHighAccuracy: boolean;
  cityName: string | null;
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
  isLoadingCity,
  onUpdateLocation,
  onHighAccuracyLocation
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={locationOutline} />
          La Teva Ubicació
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {loading && (
          <div className="text-center">
            <p>Obtenint ubicació...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center">
            <IonIcon
              icon={locationOutline}
              className="icon-danger mb-2"
              style={{ fontSize: '1.5rem' }}
            />
            <p className="text-red-500 mb-2" style={{ fontSize: '0.9rem' }}>
              {error?.message}
            </p>
            <IonButton fill="outline" onClick={onUpdateLocation} size="small">
              <IonIcon icon={refreshOutline} slot="start" />
              Reintentar
            </IonButton>
          </div>
        )}

        {location && !loading && (
          <IonList>
            <IonItem>
              <IonIcon icon={navigateOutline} slot="start" color="primary" />
              <IonLabel>
                <h3>Coordenades</h3>
                <p>{geolocationService.formatCoordinates(location)}</p>
              </IonLabel>
            </IonItem>

            {/* Mostrar ciutat si està disponible */}
            {(cityName || isLoadingCity) && (
              <IonItem>
                <IonIcon icon={locationOutline} slot="start" color="secondary" />
                <IonLabel>
                  <h3>Població</h3>
                  <p>{isLoadingCity ? 'Obtenint població...' : cityName}</p>
                </IonLabel>
              </IonItem>
            )}

            {accuracy && (
              <IonItem>
                <IonIcon
                  icon={locateOutline}
                  slot="start"
                  color={isHighAccuracy ? 'success' : accuracy > 50 ? 'danger' : 'warning'}
                />
                <IonLabel>
                  <h3>Precisió GPS</h3>
                  <p>
                    ±{accuracy.toFixed(0)}m
                    {accuracy <= 20 && ' (Excel·lent)'}
                    {accuracy > 20 && accuracy <= 50 && ' (OK)'}
                    {accuracy > 50 && ' (Baixa)'}
                  </p>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
        )}

        <div className="form-actions">
          <IonButton onClick={onUpdateLocation} disabled={loading} size="small">
            <IonIcon icon={refreshOutline} slot="start" />
            {location ? 'Actualitzar' : 'Obtenir'}
          </IonButton>

          {location && accuracy && accuracy > 20 && (
            <IonButton
              fill="outline"
              color="warning"
              onClick={onHighAccuracyLocation}
              disabled={loading}
              size="small"
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
