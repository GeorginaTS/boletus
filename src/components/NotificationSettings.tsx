import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import {
  checkmark,
  close,
  informationCircle,
  notifications,
  notificationsOutline,
  warning,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationSettings as NotificationSettingsType } from "../services/notificationService";
import "./NotificationSettings.css";

const NotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const {
    isInitialized,
    hasPermission,
    loading,
    error,
    settings,
    initialize,
    updateSettings,
    sendTestNotification,
    getStatus,
  } = useNotifications();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<
    "success" | "warning" | "danger"
  >("success");
  const [presentAlert] = useIonAlert();

  // Inicialitzar notificacions si l'usuari està autenticat
  useEffect(() => {
    if (user && !isInitialized) {
      initialize(user.uid).catch((err) => {
        console.error("Error initializing notifications:", err);
      });
    }
  }, [user, isInitialized, initialize]);

  const handleSettingChange = async (
    setting: keyof NotificationSettingsType,
    value: boolean
  ) => {
    if (!settings) return;

    try {
      await updateSettings({ [setting]: value });
      showToastMessage("Configuració actualitzada correctament", "success");
    } catch (err) {
      console.error("Error updating setting:", err);
      showToastMessage("Error actualitzant la configuració", "danger");
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      showToastMessage("Notificació de prova enviada!", "success");
    } catch (err) {
      console.error("Error sending test notification:", err);
      showToastMessage("Error enviant la notificació de prova", "danger");
    }
  };

  const showToastMessage = (
    message: string,
    color: "success" | "warning" | "danger"
  ) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const showPermissionInfo = () => {
    presentAlert({
      header: "Permisos de Notificacions",
      message: `
        <p><strong>Estat actual:</strong> ${
          hasPermission ? "Concedit" : "Denegat"
        }</p>
        <p><strong>Plataforma:</strong> ${getStatus().platform}</p>
        <p><strong>Inicialitzat:</strong> ${isInitialized ? "Sí" : "No"}</p>
        <br>
        <p>Les notificacions push et permeten rebre alertes sobre noves localitzacions de bolets, descobriments propers i actualitzacions importants.</p>
        <br>
        <p>Si els permisos estan denegats, pots activar-los des de la configuració del teu dispositiu o navegador.</p>
      `,
      buttons: ["D'acord"],
    });
  };

  if (!user) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Configuració de Notificacions</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle className="card-title">
                <IonIcon icon={warning} />
                Autenticació requerida
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              Has d'estar autenticat per configurar les notificacions.
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon icon={notifications} />
            Notificacions
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={loading} message="Configurant notificacions..." />

        {/* Error State */}
        {error && (
          <IonCard color="danger">
            <IonCardContent>
              <div className="error-row">
                <IonIcon icon={warning} />
                <span>{error}</span>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Status Card */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="card-title">
              <IonIcon
                icon={hasPermission ? checkmark : close}
                color={hasPermission ? "success" : "danger"}
              />
              Estat de les Notificacions
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="status-list">
              <div className="status-row">
                <span>Permisos:</span>
                <IonIcon
                  icon={hasPermission ? checkmark : close}
                  color={hasPermission ? "success" : "danger"}
                />
              </div>
              <div className="status-row">
                <span>Inicialitzat:</span>
                <IonIcon
                  icon={isInitialized ? checkmark : close}
                  color={isInitialized ? "success" : "danger"}
                />
              </div>
              <div className="status-row">
                <span>Plataforma:</span>
                <span className="capitalize">{getStatus().platform}</span>
              </div>
            </div>
            <div className="status-actions">
              <IonButton
                expand="block"
                fill="outline"
                onClick={showPermissionInfo}
              >
                <IonIcon icon={informationCircle} slot="start" />
                Informació dels Permisos
              </IonButton>

              {hasPermission && (
                <IonButton
                  expand="block"
                  onClick={handleTestNotification}
                  disabled={loading || !isInitialized}
                >
                  <IonIcon icon={notificationsOutline} slot="start" />
                  Enviar Notificació de Prova
                </IonButton>
              )}
            </div>
          </IonCardContent>
        </IonCard>

        {/* Settings Card */}
        {settings && hasPermission && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle className="card-title">
                <IonIcon icon={notifications} />
                Preferències de Notificacions
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h3>Notificacions generals</h3>
                    <p>Activa o desactiva totes les notificacions</p>
                  </IonLabel>
                  <IonToggle
                    checked={settings.enabled}
                    onIonChange={(e) =>
                      handleSettingChange("enabled", e.detail.checked)
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Noves localitzacions</h3>
                    <p>
                      Notifica quan altres usuaris afegeixen noves
                      localitzacions prop teu
                    </p>
                  </IonLabel>
                  <IonCheckbox
                    checked={settings.newLocations}
                    disabled={!settings.enabled}
                    onIonChange={(e) =>
                      handleSettingChange("newLocations", e.detail.checked)
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Descobriments propers</h3>
                    <p>
                      Alerta quan hi ha activitat de bolets prop de la teva
                      ubicació
                    </p>
                  </IonLabel>
                  <IonCheckbox
                    checked={settings.nearbyDiscoveries}
                    disabled={!settings.enabled}
                    onIonChange={(e) =>
                      handleSettingChange("nearbyDiscoveries", e.detail.checked)
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Temporada de bolets</h3>
                    <p>
                      Informació sobre les millors èpoques per buscar bolets
                    </p>
                  </IonLabel>
                  <IonCheckbox
                    checked={settings.mushroomSeason}
                    disabled={!settings.enabled}
                    onIonChange={(e) =>
                      handleSettingChange("mushroomSeason", e.detail.checked)
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Alertes meteorològiques</h3>
                    <p>
                      Notificacions sobre condicions meteorològiques favorables
                    </p>
                  </IonLabel>
                  <IonCheckbox
                    checked={settings.weatherAlerts}
                    disabled={!settings.enabled}
                    onIonChange={(e) =>
                      handleSettingChange("weatherAlerts", e.detail.checked)
                    }
                  />
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* No Permission Card */}
        {!hasPermission && (
          <IonCard color="warning">
            <IonCardHeader>
              <IonCardTitle className="card-title">
                <IonIcon icon={warning} />
                Permisos requerits
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                Per rebre notificacions push, necessites concedir permisos al
                teu dispositiu o navegador.
              </p>
              <br />
              <p>
                <strong>Com activar els permisos:</strong>
              </p>
              <ul className="permission-list">
                <li>
                  • <strong>Android:</strong> Configuració → Apps → Mushroom
                  Finder → Notificacions
                </li>
                <li>
                  • <strong>iOS:</strong> Configuració → Notificacions →
                  Mushroom Finder
                </li>
                <li>
                  • <strong>Web:</strong> Icona del cadenat a la barra d'adreces
                  → Notificacions
                </li>
              </ul>
            </IonCardContent>
          </IonCard>
        )}

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default NotificationSettings;
