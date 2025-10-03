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
import { locationOutline, navigateOutline, refreshOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import useGeolocation from '../hooks/useGeolocation';
import './AddLocation.css';
import { geolocationService } from '../services/geolocationService';

const AddLocation: React.FC = () => {
  const { location, loading, error, getCurrentLocation } = useGeolocation(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleRefresh = async (event: CustomEvent) => {
    await getCurrentLocation();
    event.detail.complete();
  };

  const handleLocationUpdate = async () => {
    await getCurrentLocation();
    setToastMessage(location ? 'Ubicació actualitzada!' : 'Ubicació obtinguda!');
    setShowToast(true);
  };





  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="nature-header">
          <IonTitle>Afegir Localització</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Afegir Localització</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="container">
          <IonCard className="nature-card">
            <IonCardHeader>
              <IonCardTitle className="title-section">
                <IonIcon icon={locationOutline} style={{ marginRight: '8px' }} />
                La Teva Ubicació
              </IonCardTitle>
            </IonCardHeader>
            
            <IonCardContent>
              {loading && (
                <div className="text-center p-lg">
                  <IonLoading isOpen={loading} message="Obtenint ubicació..." />
                  <p>Obtenint la teva ubicació actual...</p>
                </div>
              )}

              {error && !loading && (
                <div className="text-center p-lg">
                  <IonIcon 
                    icon={locationOutline} 
                    style={{ fontSize: '48px', color: 'var(--ion-color-danger)', marginBottom: '16px' }} 
                  />
                  <p style={{ color: 'var(--ion-color-danger)', marginBottom: '16px' }}>
                    {error?.message}
                  </p>
                  <IonButton 
                    fill="outline" 
                    className="btn-primary"
                    onClick={handleLocationUpdate}
                  >
                    <IonIcon icon={refreshOutline} slot="start" />
                    Tornar a Intentar
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
                  
                  <IonItem>
                    <IonLabel>
                      <h3>Latitud</h3>
                      <p>{location.latitude.toFixed(6)}°</p>
                    </IonLabel>
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel>
                      <h3>Longitud</h3>
                      <p>{location.longitude.toFixed(6)}°</p>
                    </IonLabel>
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel>
                      <h3>Precisió</h3>
                      <p>{geolocationService.formatAccuracy(location.accuracy)}</p>
                    </IonLabel>
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel>
                      <h3>Última Actualització</h3>
                      <p>{geolocationService.formatTimestamp(location.timestamp)}</p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              )}

              <div className="form-actions">
                <IonButton
                  expand="block"
                  className="btn-primary"
                  onClick={handleLocationUpdate}
                  disabled={loading}
                >
                  <IonIcon icon={locationOutline} slot="start" />
                  {location ? 'Actualitzar Ubicació' : 'Obtenir Ubicació'}
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage || (error ? error.message : '')}
          duration={3000}
          position="top"
          color={error ? 'danger' : 'success'}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddLocation;
