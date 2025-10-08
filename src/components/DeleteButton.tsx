import { IonAlert, IonButton, IonIcon } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import React, { useState } from "react";

interface DeleteButtonProps {
  itemName: string;
  onDelete: () => void;
  buttonTitle?: string;
  alertHeader?: string;
  alertMessage?: string;
  className?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  itemName,
  onDelete,
  buttonTitle = "Eliminar",
  alertHeader = "Confirmar eliminació",
  alertMessage,
  className = "",
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const defaultMessage = `Estàs segur que vols eliminar "${itemName}"? Aquesta acció no es pot desfer.`;

  return (
    <>
      <IonButton
        size="small"
        fill="clear"
        className={`btn-delete-icon ${className}`.trim()}
        onClick={() => setShowDeleteAlert(true)}
        title={buttonTitle}
      >
        <IonIcon icon={trashOutline} />
      </IonButton>

      {/* Alert de confirmació d'eliminació */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header={alertHeader}
        message={alertMessage || defaultMessage}
        buttons={[
          {
            text: "Cancel·lar",
            role: "cancel",
            cssClass: "alert-button-cancel",
          },
          {
            text: "Eliminar",
            role: "confirm",
            cssClass: "alert-button-confirm",
            handler: () => {
              onDelete();
            },
          },
        ]}
      />
    </>
  );
};

export default DeleteButton;
