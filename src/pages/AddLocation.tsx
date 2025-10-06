import SectionHeader from '@/components/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
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
  IonToast,
  IonToolbar
} from '@ionic/react';
import { firestoreService } from '@services/firestoreService';
import { geolocationService } from '@services/geolocationService';
import { googleMapsService } from '@services/googleMapsService';
import { photoService } from '@services/photoService';
import { addOutline, cameraOutline, checkmarkOutline, closeOutline,  locationOutline, navigateOutline, refreshOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import './AddLocation.css';

const AddLocation: React.FC = () => {
  const { user } = useAuth();
  const { location, loading, error, accuracy, isHighAccuracy, getCurrentLocation, getHighAccuracyLocation } = useGeolocation(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'warning' | 'danger'>('success');

  
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

  const handleHighAccuracyLocation = async () => {
    await getHighAccuracyLocation();
        // Determinar el color del toast segons la precisió
    let color: 'success' | 'warning' | 'danger' = 'success';
    let accuracyMsg : 'alta' | "mitjana" |'baixa' = 'alta';
    if (accuracy && accuracy > 50) {
      color = 'danger';
      accuracyMsg = 'baixa';
    } else if (accuracy && accuracy >= 25) {
      color = 'warning';
      accuracyMsg = 'mitjana';
    }
    setToastColor(color);
    setToastMessage(`Ubicació obtinguda amb ${accuracyMsg} precisió! (${accuracy}m)`);
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
    } catch {
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
      
      // Verificar que l'usuari està autenticat
      if (!user) {
        setToastMessage('Has d\'estar autenticat per afegir localitzacions!');
        setShowToast(true);
        return;
      }

      // Primer crea la localització sense foto
      const newLocation: CreateLocation = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        lat: location.latitude,
        lng: location.longitude,
        hasPhoto: !!selectedPhoto,
        userId: user.uid
      };

      const savedLocation = await firestoreService.createLocation(newLocation);
      
      // Després puja la foto amb la ID de la localització si n'hi ha una
      if (selectedPhoto && savedLocation.id) {
        setIsUploadingPhoto(true);
        try {
          await photoService.uploadPhotoForLocation(selectedPhoto, savedLocation.id);
        } catch {
          setToastMessage('Localització guardada, però error pujant la foto.');
          setShowToast(true);
        } finally {
          setIsUploadingPhoto(false);
        }
      }
      
      // Afegir el marker al mapa immediatament
      googleMapsService.addLocation(savedLocation);
      
      // Resetear formulari
      setFormData({ name: '', description: '' });
      handleRemovePhoto();
      
      setToastMessage('Localització guardada amb èxit! 🍄');
      setShowToast(true);
      
    } catch {
      setToastMessage('Error guardant la localització. Torna-ho a provar.');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };





  return (
    <IonPage>
      <IonHeader>
        <SectionHeader icon={addOutline} title="Afegir Localització" />
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Loading component fora del contenidor condicional */}
        <IonLoading isOpen={loading} message="Obtenint ubicació..." />

        <div>
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
                  <IonButton 
                    fill="outline" 
                    onClick={handleLocationUpdate}
                    size="small"
                  >
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
                  {accuracy && (
                    <IonItem>
                      <IonIcon 
                        icon={locationOutline} 
                        slot="start" 
                        color={isHighAccuracy ? "success" : accuracy > 50 ? "danger" : "warning"} 
                      />
                      <IonLabel>
                        <h3>Precisió GPS</h3>
                        <p>
                          ±{accuracy.toFixed(0)}m 
                          {accuracy <= 20 && " (Excel·lent)"}
                          {accuracy > 20 && accuracy <= 50 && " (OK)"}
                          {accuracy > 50 && " (Baixa)"}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}            
                </IonList>
              )}
              <div className="form-actions">
                <IonButton
                  onClick={handleLocationUpdate}
                  disabled={loading}
                  size="small"
                >
                  <IonIcon icon={refreshOutline} slot="start" />
                  {location ? 'Actualitzar' : 'Obtenir'}
                </IonButton>
                
                {location && accuracy && accuracy > 20 && (
                  <IonButton
                    fill="outline"
                    color="warning"
                    onClick={handleHighAccuracyLocation}
                    disabled={loading}
                    size="small"
                  >
                    <IonIcon icon={locationOutline} slot="start" />
                    Precisió
                  </IonButton>
                )}
              </div>
            </IonCardContent>
          </IonCard>

          {/* Formulari per afegir localització */}
          {location && !loading && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle className="card-title">
                  <IonIcon icon={addOutline} />
                  Afegir Nova Localització
                </IonCardTitle>
              </IonCardHeader>
              
              <IonCardContent>
                <div className="form-container">
                  <IonItem>
                    <IonLabel position="stacked">Nom de la localització *</IonLabel>
                    <IonInput
                      value={formData.name}
                      placeholder="Exemple: Rovelló gran"
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
                    <div className="photo-section">
                      {/* Botó per fer foto */}
                      {!photoPreviewUrl && (
                        <IonButton
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
                          <IonButton onClick={handleTakePhoto}>
                            <IonIcon icon={cameraOutline} slot="start" />
                            Fer Nova Foto
                          </IonButton>
                        </div>
                      )}
                    </div>
                  </IonItem>
                </div>
                <div className='form-actions'>
                  <IonButton
                    expand="block"
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
          position="bottom"
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddLocation;
