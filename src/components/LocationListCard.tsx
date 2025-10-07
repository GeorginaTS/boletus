import { Location } from '@/types/location';
import {
    IonAlert,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonIcon
} from '@ionic/react';
import { photoService } from '@services/photoService';
import {
    calendarOutline,
    locationOutline,
    mapOutline,
    navigateOutline,
    trashOutline
} from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import './LocationListCard.css';
export interface LocationListCardData {
  location: Location;
  onViewOnMap: (location: Location) => void;
  onDelete: (location: Location) => void;
}

interface LocationListCardProps {
  data: LocationListCardData;
}

const LocationListCard: React.FC<LocationListCardProps> = ({ data }) => {
  const { location, onViewOnMap, onDelete } = data;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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
    <IonCard>
      <IonCardContent>
      <article>
          {/* Foto de la localització si existeix */}
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={location.name}
            />
          ) : (
            <div className='no-image'>
              <IonIcon 
                icon={locationOutline} 
              />
            </div>
          )}
          
          {/* Contingut principal */}
          <div>
            <IonCardTitle>
              🍄 {location.name}
            </IonCardTitle>
            <ul className='card-info'>
              <li className='card-info-item'>
                <IonIcon icon={navigateOutline} />
                <span>{formatCoordinates(location.lat, location.lng)}</span>
              </li>

              {/* Mostrar ciutat si està disponible */}
              {location.city && (
                <li className='card-info-item'>
                  <IonIcon icon={locationOutline} />
                  <span>{location.city}</span>
                </li>
              )}

              <li className='card-info-item'>
                <IonIcon icon={calendarOutline} />
                <span>{formatDate(location.createdAt)}</span>
              </li>
            </ul>
          </div>
        </article>
      </IonCardContent>
      {/* Botons d'acció sempre visibles */}
            <div className="form-actions">
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
                onClick={() => setShowDeleteAlert(true)}
                title="Eliminar localització"
              >
                <IonIcon icon={trashOutline} />
              </IonButton>
            </div>

      {/* Alert de confirmació d'eliminació */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Confirmar eliminació"
        message={`Estàs segur que vols eliminar la localització "${location.name}"? Aquesta acció no es pot desfer.`}
        buttons={[
          {
            text: 'Cancel·lar',
            role: 'cancel',
            cssClass: 'alert-button-cancel'
          },
          {
            text: 'Eliminar',
            role: 'confirm',
            cssClass: 'alert-button-confirm',
            handler: () => {
              onDelete(location);
            }
          }
        ]}
      />
    </IonCard>
  );
};

export default LocationListCard;