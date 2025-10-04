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
    <IonCard className="nature-card mb-4">
      <IonCardContent>
        <div className="flex items-start gap-3">
          {/* Foto de la localització si existeix */}
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={location.name}
              className="w-20 h-20 rounded-lg object-cover border-2 border-primary-500 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
              <IonIcon 
                icon={locationOutline} 
                color="primary"
                className="text-3xl"
              />
            </div>
          )}
          
          {/* Contingut principal */}
          <div className="flex-1 min-w-0">
            <h2 className="location-name m-0 mb-2 text-lg font-bold">
              🍄 {location.name}
            </h2>
            
            {location.description && (
              <p>
                {location.description}
              </p>
            )}
            
            <div className="location-details mb-4 gap-2">
              <div>
                <IonIcon icon={navigateOutline} />
                <span className='ml-4'>{formatCoordinates(location.lat, location.lng)}</span>
              </div>
              
              <div>
                <IonIcon icon={calendarOutline} />
                <span className='ml-4'>{formatDate(location.createdAt)}</span>
              </div>
              
              {location.updatedAt && location.updatedAt !== location.createdAt && (
                <div>
                  <IonIcon icon={timeOutline} />
                  <span className='ml-4'>Updated: {formatDate(location.updatedAt)}</span>
                </div>
              )}
            </div>
            
            {/* Botons d'acció sempre visibles */}
            <div className="flex gap-2">
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
                fill="clear"
                className="btn-delete-icon"
                onClick={() => onDelete(location)}
                title="Eliminar localització"
              >
                <IonIcon icon={trashOutline} />
              </IonButton>
            </div>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default LocationCard;