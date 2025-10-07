import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";
import { navigateOutline } from "ionicons/icons";
import React from "react";

interface LastLocationCardProps {
  latitude: number;
  longitude: number;
  lastLocationUpdate?: Date;
}

const LastLocationCard: React.FC<LastLocationCardProps> = ({
  latitude,
  longitude,
  lastLocationUpdate,
}) => {
  return (
    <IonCard className="location-card">
      <IonCardHeader>
        <IonCardTitle className="card-title">
          <IonIcon icon={navigateOutline} />
          Última Ubicació
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="data-display">
          <div className="data-group">
            <h3>Coordenades GPS</h3>
            <p className="data-value">
              {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
            </p>
          </div>

          {lastLocationUpdate && (
            <div className="data-timestamp">
              <h4>Última actualització</h4>
              <p>
                {lastLocationUpdate.toLocaleString("ca-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default LastLocationCard;
