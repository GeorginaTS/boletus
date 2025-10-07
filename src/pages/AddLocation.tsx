import AddLocationForm from '@/components/AddLocationForm';
import LocationInfoCard from '@/components/LocationInfoCard';
import SectionHeader from '@/components/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import useGeolocation from '@/hooks/useGeolocation';
import { CreateLocation } from '@/types/location';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonContent,
  IonHeader,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToast
} from '@ionic/react';
import { firestoreService } from '@services/firestoreService';
import { geocodingService } from '@services/geocodingService';
import { googleMapsService } from '@services/googleMapsService';
import { photoService } from '@services/photoService';
import { addOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
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
  const [cityName, setCityName] = useState<string | null>(null);
  const [provinceName, setProvinceName] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  
  // Estat per la foto
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Obtenir ciutat, província i país automàticament quan canvia la ubicació
  useEffect(() => {
    const fetchCityAndCountry = async () => {
      if (location && !loading) {
        setIsLoadingCity(true);
        try {
          console.log('Obtenint ciutat, província i país per:', location.latitude, location.longitude);
          const locationData = await geocodingService.getCityAndCountry(location.latitude, location.longitude);
          console.log('Dades obtingudes:', locationData);
          setCityName(locationData?.city || null);
          setProvinceName(locationData?.province || null);
          setCountryName(locationData?.country || null);
        } catch (error) {
          console.error('Error obtenint la ubicació:', error);
          setCityName(null);
          setProvinceName(null);
          setCountryName(null);
        } finally {
          setIsLoadingCity(false);
        }
      } else if (!location) {
        // Si no hi ha ubicació, netejar la ciutat, província i país
        setCityName(null);
        setProvinceName(null);
        setCountryName(null);
        setIsLoadingCity(false);
      }
    };

    fetchCityAndCountry();
  }, [location, loading]);

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
        city: cityName || undefined, // Afegir ciutat si està disponible
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
      setCityName(null);
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Loading component fora del contenidor condicional */}
        <IonLoading isOpen={loading} message="Obtenint ubicació..." />

        <div className="container">
          {/* Component de la ubicació */}
          <LocationInfoCard
            location={location}
            loading={loading}
            error={error}
            accuracy={accuracy}
            isHighAccuracy={isHighAccuracy}
            cityName={cityName}
            provinceName={provinceName}
            countryName={countryName}
            isLoadingCity={isLoadingCity}
            onUpdateLocation={handleLocationUpdate}
            onHighAccuracyLocation={handleHighAccuracyLocation}
          />

          {/* Component del formulari */}
          {location && !loading && (
            <AddLocationForm
              formData={formData}
              photoPreviewUrl={photoPreviewUrl}
              isSubmitting={isSubmitting}
              isUploadingPhoto={isUploadingPhoto}
              onInputChange={handleInputChange}
              onTakePhoto={handleTakePhoto}
              onRemovePhoto={handleRemovePhoto}
              onSubmit={handleSubmitLocation}
            />
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
