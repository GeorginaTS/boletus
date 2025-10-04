import { Location } from '@/types/location';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/react';
import { firestoreService } from '@services/firestoreService';
import { googleMapsService } from '@services/googleMapsService';
import {
  calendarOutline,
  locationOutline,
  mapOutline,
  navigateOutline,
  refreshOutline,
  timeOutline,
  trashOutline
} from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LocationsList.css';

const LocationsList: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();

  const loadLocations = async () => {
    try {
      setLoading(true);
      console.log('📍 Carregant localitzacions...');
      
      const allLocations = await firestoreService.getAllLocations();
      setLocations(allLocations);
      
      console.log(`✅ Carregades ${allLocations.length} localitzacions`);
    } catch (error) {
      console.error('❌ Error carregant localitzacions:', error);
      setToastMessage('Error carregant les localitzacions');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadLocations();
    event.detail.complete();
  };

  const handleDeleteLocation = async (location: Location) => {
    if (!location.id) return;
    
    try {
      console.log(`🗑️ Eliminant localització: ${location.name}`);
      
      await firestoreService.deleteLocation(location.id);
      
      // Eliminar del mapa
      googleMapsService.removeLocation(location.id);
      
      // Actualitzar llista local
      setLocations(prev => prev.filter(loc => loc.id !== location.id));
      
      setToastMessage(`Localització "${location.name}" eliminada`);
      setShowToast(true);
      
    } catch (error) {
      console.error('❌ Error eliminant localització:', error);
      setToastMessage('Error eliminant la localització');
      setShowToast(true);
    }
  };

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

  const handleViewOnMap = (location: Location) => {
    // Navega al mapa i centra en la localització
    googleMapsService.focusOnLocation(location);
    history.push('/map');
    
    setToastMessage(`Mapa centrat en "${location.name}"`);
    setShowToast(true);
  };

  useEffect(() => {
    loadLocations();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="nature-header">
          <IonTitle>Localitzacions</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Localitzacions</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="container">
          {loading && (
            <div className="text-center p-lg">
              <IonLoading isOpen={loading} message="Carregant localitzacions..." />
            </div>
          )}

          {!loading && locations.length === 0 && (
            <IonCard className="nature-card">
              <IonCardContent className="text-center p-lg">
                <IonIcon 
                  icon={locationOutline} 
                  style={{ fontSize: '64px', color: 'var(--ion-color-medium)', marginBottom: '16px' }} 
                />
                <h2>Cap localització trobada</h2>
                <p>Afegeix la teva primera localització des de la pestanya "Afegir lloc"</p>
                <IonButton 
                  fill="outline" 
                  className="btn-primary"
                  routerLink="/add-location"
                >
                  <IonIcon icon={locationOutline} slot="start" />
                  Afegir primera localització
                </IonButton>
              </IonCardContent>
            </IonCard>
          )}

          {!loading && locations.length > 0 && (
            <>
              <IonCard className="nature-card">
                <IonCardHeader>
                  <IonCardTitle className="title-section">
                    <IonIcon icon={locationOutline} style={{ marginRight: '8px' }} />
                    {locations.length} Localització{locations.length !== 1 ? 's' : ''} Guardada{locations.length !== 1 ? 's' : ''}
                  </IonCardTitle>
                </IonCardHeader>
                
                <IonCardContent>
                  <div className="form-actions">
                    <IonButton
                      expand="block"
                      fill="outline"
                      className="btn-secondary"
                      onClick={loadLocations}
                    >
                      <IonIcon icon={refreshOutline} slot="start" />
                      Actualitzar llista
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonList>
                {locations.map((location) => (
                  <IonItemSliding key={location.id}>
                    <IonItem className="location-item">
                      <IonIcon 
                        icon={locationOutline} 
                        slot="start" 
                        color="primary"
                        style={{ fontSize: '24px' }}
                      />
                      
                      <IonLabel>
                        <h2 className="location-name">🍄 {location.name}</h2>
                        
                        {location.description && (
                          <p className="location-description">{location.description}</p>
                        )}
                        
                        <div className="location-details">
                          <div className="detail-item">
                            <IonIcon icon={navigateOutline} />
                            <span>{formatCoordinates(location.lat, location.lng)}</span>
                          </div>
                          
                          <div className="detail-item">
                            <IonIcon icon={calendarOutline} />
                            <span>{formatDate(location.createdAt)}</span>
                          </div>
                          
                          {location.updatedAt && location.updatedAt !== location.createdAt && (
                            <div className="detail-item">
                              <IonIcon icon={timeOutline} />
                              <span>Actualitzat: {formatDate(location.updatedAt)}</span>
                            </div>
                          )}
                        </div>
                      </IonLabel>
                    </IonItem>
                    
                    <IonItemOptions side="end">
                      <IonItemOption 
                        color="primary" 
                        onClick={() => handleViewOnMap(location)}
                      >
                        <IonIcon icon={mapOutline} />
                        Veure al mapa
                      </IonItemOption>
                      <IonItemOption 
                        color="danger" 
                        onClick={() => handleDeleteLocation(location)}
                      >
                        <IonIcon icon={trashOutline} />
                        Eliminar
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                ))}
              </IonList>
            </>
          )}
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
          color={toastMessage.includes('Error') ? 'danger' : 'success'}
        />
      </IonContent>
    </IonPage>
  );
};

export default LocationsList;