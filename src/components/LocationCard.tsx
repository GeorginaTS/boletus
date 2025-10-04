import { Location } from '@/types/location';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon
} from '@ionic/react';
import { photoService } from '@services/photoService';
import {
  calendarOutline,
  locationOutline,
  mapOutline,
  navigateOutline,
  timeOutline,
  trashOutline
} from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

export interface LocationCardData {
  location: Location;
  onViewOnMap: (location: Location) => void;
  onDelete: (location: Location) => void;
}

interface LocationCardProps {
  data: LocationCardData;
}

const LocationCard: React.FC<LocationCardProps> = ({ data }) => {
  const { location, onViewOnMap, onDelete } = data;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Carrega la foto si la localització en té una
  useEffect(() => {
    const loadPhoto = async () => {
      if (location.hasPhoto && location.id) {
        try {
          const url = await photoService.getPhotoUrl(location.id);
          if (url) {
            setPhotoUrl(url);
          }
        } catch {
          console.log(`No s'ha pogut carregar la foto per ${location.name}`);
        }
      }
    };

    loadPhoto();
  }, [location.id, location.hasPhoto, location.name]);
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ca-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCoordinates = (lat: number, lng: number): string => {
    return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;
  };

  return (
    <IonCard className="nature-card" style={{ marginBottom: '16px' }}>
      <IonCardContent>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {/* Foto de la localització si existeix */}
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={location.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '2px solid var(--ion-color-primary)',
                flexShrink: 0
              }}
            />
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '8px',
              backgroundColor: 'var(--ion-color-primary-tint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <IonIcon 
                icon={locationOutline} 
                color="primary"
                style={{ fontSize: '32px' }}
              />
            </div>
          )}
          
          {/* Contingut principal */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="location-name" style={{ margin: '0 0 8px 0', fontSize: '1.2em', fontWeight: 'bold' }}>
              🍄 {location.name}
            </h2>
            
            {location.description && (
              <p className="location-description" style={{ margin: '0 0 12px 0', color: 'var(--ion-color-medium)', fontSize: '0.9em' }}>
                {location.description}
              </p>
            )}
            
            <div className="location-details" style={{ marginBottom: '16px' }}>
              <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.85em', color: 'var(--ion-color-medium)' }}>
                <IonIcon icon={navigateOutline} />
                <span>{formatCoordinates(location.lat, location.lng)}</span>
              </div>
              
              <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.85em', color: 'var(--ion-color-medium)' }}>
                <IonIcon icon={calendarOutline} />
                <span>{formatDate(location.createdAt)}</span>
              </div>
              
              {location.updatedAt && location.updatedAt !== location.createdAt && (
                <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85em', color: 'var(--ion-color-medium)' }}>
                  <IonIcon icon={timeOutline} />
                  <span>Actualitzat: {formatDate(location.updatedAt)}</span>
                </div>
              )}
            </div>
            
            {/* Botons d'acció sempre visibles */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <IonButton
                size="small"
                fill="outline"
                color="primary"
                onClick={() => onViewOnMap(location)}
              >
                <IonIcon icon={mapOutline} slot="start" />
                Veure al Mapa
              </IonButton>
              
              <IonButton
                size="small"
                fill="outline"
                color="danger"
                onClick={() => onDelete(location)}
              >
                <IonIcon icon={trashOutline} slot="start" />
                Eliminar
              </IonButton>
            </div>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default LocationCard;