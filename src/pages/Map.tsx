import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/react';
import { locationOutline, refreshOutline } from 'ionicons/icons';
import { useState } from 'react';
import MapView from '../components/MapView';
import useGeolocation from '../hooks/useGeolocation';
import './Map.css';

const Map: React.FC = () => {
  const { location, loading, error, getCurrentLocation } = useGeolocation(true);
  const [showToast, setShowToast] = useState(false);

  const handleRefreshLocation = async () => {
    await getCurrentLocation();
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mapa</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            onClick={handleRefreshLocation}
            disabled={loading}
          >
            {loading ? (
              <IonSpinner name="crescent" />
            ) : (
              <IonIcon icon={refreshOutline} />
            )}
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="map-content">
        
        {error && (
          <div className="error-container">
            <div className="error-message">
              <IonIcon icon={locationOutline} />
              <h3>Error de geolocalització</h3>
              <p>{error.message}</p>
              <IonButton 
                onClick={handleRefreshLocation}
                disabled={loading}
              >
                Tornar a intentar
              </IonButton>
            </div>
          </div>
        )}

        {loading && !location && (
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Obtenint la teva ubicació...</p>
          </div>
        )}

        <MapView 
          userLocation={location} 
          height="100%"
          className="main-map"
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Ubicació actualitzada!"
          duration={2000}
          position="bottom"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default Map;