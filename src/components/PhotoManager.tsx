import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/react";
import { cameraOutline } from "ionicons/icons";
import React from "react";
import DeleteButton from "./DeleteButton";
import "./PhotoManager.css";

interface PhotoManagerProps {
  photoPreviewUrl: string | null;
  isUploadingPhoto: boolean;
  onTakePhoto: () => void;
  onRemovePhoto: () => void;
}

const PhotoManager: React.FC<PhotoManagerProps> = ({
  photoPreviewUrl,
  isUploadingPhoto,
  onTakePhoto,
  onRemovePhoto,
}) => {
  return (
    <IonItem>
      <IonLabel position="stacked">Foto (opcional)</IonLabel>
      <div className="photo-section">
        {/* Botó per fer foto */}
        {!photoPreviewUrl && (
          <IonButton onClick={onTakePhoto} disabled={isUploadingPhoto}>
            <IonIcon icon={cameraOutline} slot="start" />
            {isUploadingPhoto ? "Pujant foto..." : "Fer Foto"}
          </IonButton>
        )}

        {/* Previsualització de la foto */}
        {photoPreviewUrl && (
          <div className="photo-preview-container">
            <div style={{ position: "relative", width: "100%" }}>
              <img
                src={photoPreviewUrl}
                alt="Previsualització"
                className="photo-preview"
              />
              <DeleteButton
                itemName="aquesta foto"
                onDelete={onRemovePhoto}
                buttonTitle="Eliminar foto"
                alertHeader="Eliminar foto?"
                alertMessage="Estàs segur que vols eliminar aquesta foto?"
                className="photo-remove-button"
              />
            </div>

            {/* Botó per fer nova foto */}
            <IonButton onClick={onTakePhoto} disabled={isUploadingPhoto}>
              <IonIcon icon={cameraOutline} slot="start" />
              {isUploadingPhoto ? "Pujant foto..." : "Fer Nova Foto"}
            </IonButton>
          </div>
        )}
      </div>
    </IonItem>
  );
};

export default PhotoManager;
