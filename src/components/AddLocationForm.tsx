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
  IonTextarea,
} from "@ionic/react";
import { checkmarkOutline } from "ionicons/icons";
import React from "react";
import "./AddLocationForm.css";
import PhotoManager from "./PhotoManager";

interface AddLocationFormProps {
  formData: {
    name: string;
    description: string;
  };
  photoPreviewUrl: string | null;
  isSubmitting: boolean;
  isUploadingPhoto: boolean;
  onInputChange: (field: "name" | "description", value: string) => void;
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
  onSubmit,
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle className="card-title">
          Afegir Nova Localització
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <div className="form-group">
          <IonItem lines="none">
            <IonLabel position="stacked">Nom de la localització *</IonLabel>
            <IonInput
              value={formData.name}
              placeholder="Exemple: Rovelló gran"
              onIonInput={(e) => onInputChange("name", e.detail.value!)}
              required
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Descripció</IonLabel>
            <IonTextarea
              value={formData.description}
              placeholder="Descripció de la localització, tipus de bolets trobats, etc."
              rows={3}
              onIonInput={(e) => onInputChange("description", e.detail.value!)}
            />
          </IonItem>

          {/* Secció de foto */}
          <PhotoManager
            photoPreviewUrl={photoPreviewUrl}
            isUploadingPhoto={isUploadingPhoto}
            onTakePhoto={onTakePhoto}
            onRemovePhoto={onRemovePhoto}
          />
        </div>

        <div className="form-actions">
          <IonButton
            expand="block"
            onClick={onSubmit}
            disabled={isSubmitting || !formData.name.trim()}
          >
            <IonIcon icon={checkmarkOutline} slot="start" />
            {isUploadingPhoto
              ? "Pujant foto..."
              : isSubmitting
              ? "Guardant..."
              : "Guardar Localització"}
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default AddLocationForm;
