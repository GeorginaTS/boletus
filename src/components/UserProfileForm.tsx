import { useAuth } from '@/contexts/AuthContext';
import { CreateUserProfileData, UpdateUserProfileData } from '@/types/user';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonInput,
    IonItem,

    IonLoading,

    IonToast
} from '@ionic/react';
import { person, save } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

interface UserProfileFormProps {
  isNew?: boolean;
  onSave?: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ isNew = false, onSave }) => {
  const { user, userProfile, createUserProfile, updateUserProfile, loading } = useAuth();
  
  const [formData, setFormData] = useState<CreateUserProfileData>({
    displayName: '',
    email: '',
    city: '',
    country: '',
    photoURL: ''
  });
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar dades existents quan no és nou
  useEffect(() => {
    if (!isNew && userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        email: userProfile.email || '',
        city: userProfile.city || '',
        country: userProfile.country || '',
        photoURL: userProfile.photoURL || ''
      });
    } else if (user) {
      // Pre-omplir amb dades de Firebase Auth si està disponible
      setFormData(prev => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || ''
      }));
    }
  }, [isNew, userProfile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName || !formData.email || !formData.city || !formData.country) {
      setToastMessage('Omple tots els camps obligatoris');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isNew) {
        await createUserProfile(formData);
        setToastMessage('Perfil creat correctament!');
        setShowToast(true);
        
        // Esperar un moment abans de canviar de vista per mostrar el toast
        setTimeout(() => {
          onSave?.();
        }, 1500);
        
      } else {
        const updateData: UpdateUserProfileData = {
          displayName: formData.displayName,
          city: formData.city,
          country: formData.country,
          photoURL: formData.photoURL
        };
        await updateUserProfile(updateData);
        
        // Per actualitzacions, només cridem onSave sense mostrar toast aquí
        // El toast es mostra al component pare
        onSave?.();
      }
      
    } catch (error) {
      setToastMessage((error as Error).message);
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <IonCard className="nature-card form-container">
      <IonCardHeader>
        <IonCardTitle className="title-section">
          <IonIcon icon={person} style={{ marginRight: '8px' }} />
          {isNew ? 'Crear Perfil' : 'Editar Perfil'}
        </IonCardTitle>
      </IonCardHeader>
      
      <IonCardContent>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonInput
              type="text"
              fill="outline"
              label="Nom *"
              labelPlacement="floating"
              value={formData.displayName}
              onIonInput={(e) => setFormData(prev => ({ ...prev, displayName: e.detail.value! }))}
              required
            />
          </IonItem>

          <IonItem>
            <IonInput
              type="email"
              fill="outline"
              label="Email *"
              labelPlacement="floating"
              value={formData.email}
              disabled={!isNew} // No permet canviar email si ja existeix
              onIonInput={(e) => setFormData(prev => ({ ...prev, email: e.detail.value! }))}
              required
            />
          </IonItem>

          <IonItem>
            <IonInput
              type="text"
              fill="outline"
              label="Ciutat *"
              labelPlacement="floating"
              value={formData.city}
              onIonInput={(e) => setFormData(prev => ({ ...prev, city: e.detail.value! }))}
              required
            />
          </IonItem>

          <IonItem>
            <IonInput
              type="text"
              fill="outline"
              label="País *"
              labelPlacement="floating"
              value={formData.country}
              onIonInput={(e) => setFormData(prev => ({ ...prev, country: e.detail.value! }))}
              required
            />
          </IonItem>

          <div className="form-actions">
            <IonButton
              expand="block"
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || loading}
            >
              <IonIcon icon={save} slot="start" />
              {isNew ? 'Crear Perfil' : 'Guardar Canvis'}
            </IonButton>
          </div>
        </form>

        <IonLoading isOpen={isSubmitting} message="Guardant..." />
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
        />
      </IonCardContent>
    </IonCard>
  );
};

export default UserProfileForm;