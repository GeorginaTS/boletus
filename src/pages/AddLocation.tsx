import useGeolocation from '@/hooks/useGeolocation';
import { CreateLocation } from '@/types/location';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/react';
import { firestoreService } from '@services/firestoreService';
import { geolocationService } from '@services/geolocationService';
import { googleMapsService } from '@services/googleMapsService';
import { photoService } from '@services/photoService';
import { addOutline, cameraOutline, checkmarkOutline, closeOutline, listOutline, locationOutline, navigateOutline, refreshOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './AddLocation.css';

const AddLocation: React.FC = () => {
  const { location, loading, error, getCurrentLocation } = useGeolocation(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();
  
  // Estat del formulari
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estat per la foto
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleRefresh = async (event: CustomEvent) => {
    await getCurrentLocation();
    event.detail.complete();
  };

  const handleLocationUpdate = async () => {
    await getCurrentLocation();
    setToastMessage(location ? 'Ubicació actualitzada!' : 'Ubicació obtinguda!');
    setShowToast(true);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTakePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath) {
        // Converteix la imatge a File per pujar-la
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        setSelectedPhoto(file);
        
        // Neteja la URL anterior si existeix
        if (photoPreviewUrl) {
          photoService.revokePreviewUrl(photoPreviewUrl);
        }
        
        // Usa la webPath directament per a la previsualització
        setPhotoPreviewUrl(image.webPath);
      }
    } catch (error) {
      console.error('Error fent la foto:', error);
      setToastMessage('Error accedint a la càmera. Comprova els permisos.');
      setShowToast(true);
    }
  };

  const handleRemovePhoto = () => {
    if (photoPreviewUrl) {
      // Només revoca si és una URL creada amb createObjectURL
      if (photoPreviewUrl.startsWith('blob:')) {
        photoService.revokePreviewUrl(photoPreviewUrl);
      }
    }
    setSelectedPhoto(null);
    setPhotoPreviewUrl(null);
  };

  const handleSubmitLocation = async () => {
    if (!location) {
      setToastMessage('Primer has d\'obtenir la teva ubicació!');
      setShowToast(true);
      return;
    }

    if (!formData.name.trim()) {
      setToastMessage('El nom de la localització és obligatori!');
      setShowToast(true);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Primer crea la localització sense foto
      const newLocation: CreateLocation = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        lat: location.latitude,
        lng: location.longitude,
        hasPhoto: !!selectedPhoto
      };

      const savedLocation = await firestoreService.createLocation(newLocation);
      
      // Després puja la foto amb la ID de la localització si n'hi ha una
      if (selectedPhoto && savedLocation.id) {
        setIsUploadingPhoto(true);
        try {
          await photoService.uploadPhotoForLocation(selectedPhoto, savedLocation.id);
          console.log('Foto pujada amb èxit per localització:', savedLocation.id);
        } catch (photoError) {
          console.error('Error pujant foto:', photoError);
          setToastMessage('Localització guardada, però error pujant la foto.');
          setShowToast(true);
        } finally {
          setIsUploadingPhoto(false);
        }
      }
      
      console.log('Localització guardada:', savedLocation);
      
      // Afegir el marker al mapa immediatament
      googleMapsService.addLocation(savedLocation);
      
      // Resetear formulari
      setFormData({ name: '', description: '' });
      handleRemovePhoto();
      
      setToastMessage('Localització guardada amb èxit! 🍄');
      setShowToast(true);
      
      // Opcional: navegar a la llista després d'un temps
      setTimeout(() => {
        if (window.confirm('Vols veure totes les localitzacions guardades?')) {
          history.push('/locations');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error guardant localització:', error);
      setToastMessage('Error guardant la localització. Torna-ho a provar.');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Loading component fora del contenidor condicional */}
        <IonLoading isOpen={loading} message="Obtenint ubicació..." />

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

          {/* Formulari per afegir localització */}
          {location && !loading && (
            <IonCard className="nature-card">
              <IonCardHeader>
                <IonCardTitle className="title-section">
                  <IonIcon icon={addOutline} style={{ marginRight: '8px' }} />
                  Afegir Nova Localització
                </IonCardTitle>
              </IonCardHeader>
              
              <IonCardContent>
                <div className="form-container">
                  <IonItem>
                    <IonLabel position="stacked">Nom de la localització *</IonLabel>
                    <IonInput
                      value={formData.name}
                      placeholder="Exemple: Bosc de pins del parc"
                      onIonInput={(e) => handleInputChange('name', e.detail.value!)}
                      required
                    />
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel position="stacked">Descripció</IonLabel>
                    <IonTextarea
                      value={formData.description}
                      placeholder="Descripció de la localització, tipus de bolets trobats, etc."
                      rows={4}
                      onIonInput={(e) => handleInputChange('description', e.detail.value!)}
                    />
                  </IonItem>
                  
                  {/* Secció de foto */}
                  <IonItem>
                    <IonLabel position="stacked">Foto (opcional)</IonLabel>
                    <div style={{ width: '100%', marginTop: '8px' }}>
                      {/* Botó per fer foto */}
                      {!photoPreviewUrl && (
                        <IonButton
                          expand="block"
                          fill="outline"
                          onClick={handleTakePhoto}
                        >
                          <IonIcon icon={cameraOutline} slot="start" />
                          Fer Foto
                        </IonButton>
                      )}
                      
                      {/* Previsualització de la foto */}
                      {photoPreviewUrl && (
                        <div className="photo-preview-container">
                          <img
                            src={photoPreviewUrl}
                            alt="Previsualització"
                            className="photo-preview"
                          />
                          <IonButton
                            fill="clear"
                            size="small"
                            color="danger"
                            onClick={handleRemovePhoto}
                            className="photo-remove-button"
                          >
                            <IonIcon icon={closeOutline} />
                          </IonButton>
                          
                          {/* Botó per fer nova foto */}
                          <IonButton
                            expand="block"
                            fill="outline"
                            size="small"
                            onClick={handleTakePhoto}
                            className="photo-select-button"
                          >
                            <IonIcon icon={cameraOutline} slot="start" />
                            Fer Nova Foto
                          </IonButton>
                        </div>
                      )}
                    </div>
                  </IonItem>
                </div>
                
                <div className="form-actions">
                  <IonButton
                    expand="block"
                    className="btn-primary"
                    onClick={handleSubmitLocation}
                    disabled={isSubmitting || !formData.name.trim()}
                  >
                    <IonIcon icon={checkmarkOutline} slot="start" />
                    {isUploadingPhoto 
                      ? 'Pujant foto...' 
                      : isSubmitting 
                        ? 'Guardant...' 
                        : 'Guardar Localització'}
                  </IonButton>
                  
                  <IonButton
                    expand="block"
                    fill="outline"
                    className="btn-secondary"
                    routerLink="/locations"
                    style={{ marginTop: '12px' }}
                  >
                    <IonIcon icon={listOutline} slot="start" />
                    Veure totes les localitzacions
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          )}
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
