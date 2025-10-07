import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonTextarea
} from '@ionic/react';
import { addOutline, cameraOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';
import React from 'react';

interface AddLocationFormProps {
  formData: {
    name: string;
    description: string;
  };
  photoPreviewUrl: string | null;
  isSubmitting: boolean;
  isUploadingPhoto: boolean;
  onInputChange: (field: 'name' | 'description', value: string) => void;
  onTakePhoto: () => void;
  onRemovePhoto: () => void;
  onSubmit: () => void;
}

const AddLocationForm: React.FC<AddLocationFormProps> = ({
  formData,
  photoPreviewUrl,
  isSubmitting,
  isUploadingPhoto,
  onInputChange,
  onTakePhoto,
  onRemovePhoto,
  onSubmit
}) => {
  return (
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
              onIonInput={(e) => onInputChange('name', e.detail.value!)}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Descripció</IonLabel>
            <IonTextarea
              value={formData.description}
              placeholder="Descripció de la localització, tipus de bolets trobats, etc."
              rows={4}
              onIonInput={(e) => onInputChange('description', e.detail.value!)}
            />
          </IonItem>

          {/* Secció de foto */}
          <IonItem>
            <IonLabel position="stacked">Foto (opcional)</IonLabel>
            <div className="photo-section">
              {/* Botó per fer foto */}
              {!photoPreviewUrl && (
                <IonButton onClick={onTakePhoto}>
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
                    onClick={onRemovePhoto}
                    className="photo-remove-button"
                  >
                    <IonIcon icon={closeOutline} />
                  </IonButton>

                  {/* Botó per fer nova foto */}
                  <IonButton onClick={onTakePhoto}>
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
            onClick={onSubmit}
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
  );
};

export default AddLocationForm;
