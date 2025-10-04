import useGeolocation from '@/hooks/useGeolocation';
import MapView from '@components/MapView';
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
import { googleMapsService } from '@services/googleMapsService';
import { layersOutline, locationOutline, refreshOutline, resizeOutline } from 'ionicons/icons';
import { useState } from 'react';
import './Map.css';

const Map: React.FC = () => {
  const { location, loading, error, getCurrentLocation } = useGeolocation(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Mapa actualitzat!');

  const handleRefreshLocation = async () => {
    await getCurrentLocation();
    setToastMessage('Ubicació actualitzada! 📍');
    setShowToast(true);
  };

  const handleFitBounds = () => {
    googleMapsService.fitBoundsToLocations();
    setToastMessage('Mapa ajustat a totes les localitzacions');
    setShowToast(true);
  };

  const handleToggleTerrainMode = () => {
    googleMapsService.toggleTerrainMode();
    const currentType = googleMapsService.getCurrentMapType();
    const isTerrainMode = currentType === 'terrain';
    setToastMessage(isTerrainMode ? 'Mode relleu activat 🏔️' : 'Mode normal activat 🗺️');
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
            onClick={handleToggleTerrainMode}
            title="Canviar entre mode normal i relleu"
          >
            <IonIcon icon={layersOutline} />
          </IonButton>
          <IonButton
            slot="end"
            fill="clear"
            onClick={handleFitBounds}
            title="Ajustar zoom a totes les localitzacions"
          >
            <IonIcon icon={resizeOutline} />
          </IonButton>
          <IonButton
            slot="end"
            fill="clear"
            onClick={handleRefreshLocation}
            disabled={loading}
            title="Actualitzar ubicació"
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
              {/* Exemple d'integració Tailwind + Ionic */}
              <div className="flex items-center justify-center mb-4">
                <IonIcon icon={locationOutline} className="text-4xl text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-center text-gray-800 mb-2">Error de geolocalització</h3>
              <p className="text-center text-gray-600 mb-4">{error.message}</p>
              <div className="flex justify-center">
                <IonButton 
                  onClick={handleRefreshLocation}
                  disabled={loading}
                  className="btn-earth"
                >
                  <IonIcon icon={refreshOutline} slot="start" />
                  Tornar a intentar
                </IonButton>
              </div>
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
          message={toastMessage}
          duration={2000}
          position="bottom"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default Map;