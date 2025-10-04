import LocationCard from '@/components/LocationCard';
import { useAuth } from '@/contexts/AuthContext';
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
    locationOutline,
    refreshOutline
} from 'ionicons/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LocationsList.css';

const LocationsList: React.FC = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();

  const loadLocations = useCallback(async () => {
    if (!user) {
      console.log('⚠️ Usuari no autenticat');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📍 Carregant localitzacions de l\'usuari:', user.uid);
      
      const userLocations = await firestoreService.getUserLocations(user.uid);
      setLocations(userLocations);
      
      console.log(`✅ Carregades ${userLocations.length} localitzacions de l'usuari`);
    } catch (error) {
      console.error('❌ Error carregant localitzacions:', error);
      setToastMessage('Error carregant les teves localitzacions');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

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



  const handleViewOnMap = (location: Location) => {
    // Navega al mapa i centra en la localització
    googleMapsService.focusOnLocation(location);
    history.push('/map');
    
    setToastMessage(`Mapa centrat en "${location.name}"`);
    setShowToast(true);
  };

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

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

        {/* Loading component fora del contenidor condicional */}
        <IonLoading isOpen={loading} message="Carregant localitzacions..." />

        <div className="container">
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

              <div>
                {locations.map((location) => (
                  <LocationCard
                    key={location.id}
                    data={{
                      location,
                      onViewOnMap: handleViewOnMap,
                      onDelete: handleDeleteLocation
                    }}
                  />
                ))}
              </div>
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