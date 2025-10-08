import DeleteButton from "@/components/DeleteButton";
import SectionHeader from "@/components/SectionHeader";
import WeatherInfo from "@/components/WeatherInfo";
import { useAuth } from "@/contexts/AuthContext";
import { Location } from "@/types/location";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { firestoreService } from "@services/firestoreService";
import { photoService } from "@services/photoService";
import {
  calendarOutline,
  locationOutline,
  mapOutline,
  navigateOutline,
  personOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./LocationDetail.css";

interface LocationDetailParams {
  id: string;
}

const LocationDetail: React.FC = () => {
  const { id } = useParams<LocationDetailParams>();
  const { user } = useAuth();
  const history = useHistory();

  const [location, setLocation] = useState<Location | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const loadLocation = async () => {
      try {
        setLoading(true);
        const locationData = await firestoreService.getLocation(id);

        if (!locationData) {
          setError("Localització no trobada");
          return;
        }

        setLocation(locationData);

        // Carregar foto si existeix
        if (locationData.hasPhoto) {
          const url = await photoService.getPhotoUrl(id);
          if (url) {
            setPhotoUrl(url);
          }
        }
      } catch (err) {
        console.error("Error carregant localització:", err);
        setError("Error carregant la localització");
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [id]);

  const handleDelete = async () => {
    if (!location?.id) return;

    try {
      await firestoreService.deleteLocation(location.id);
      setToastMessage("Localització eliminada correctament");
      setShowToast(true);

      // Redirigir a la llista després d'eliminar
      setTimeout(() => {
        history.push("/locations-list");
      }, 1000);
    } catch (err) {
      console.error("Error eliminant localització:", err);
      setToastMessage("Error eliminant la localització");
      setShowToast(true);
    }
  };

  const handleViewOnMap = () => {
    if (location) {
      history.push("/map");
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("ca-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCoordinates = (lat: number, lng: number): string => {
    return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <SectionHeader
            icon={locationOutline}
            title="Detall de Localització"
          />
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  if (error || !location) {
    return (
      <IonPage>
        <IonHeader>
          <SectionHeader
            icon={locationOutline}
            title="Detall de Localització"
          />
        </IonHeader>
        <IonContent className="ion-padding">
          <p className="ion-text-center">
            {error || "Localització no trobada"}
          </p>
        </IonContent>
      </IonPage>
    );
  }

  const isOwner = user?.uid === location.userId;

  return (
    <IonPage>
      <IonHeader>
        <SectionHeader icon={locationOutline} title="Detall de Localització" />
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="container">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>🍄 {location.name}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              {/* Foto si existeix */}
              {photoUrl && (
                <div className="photo-container">
                  <img
                    src={photoUrl}
                    alt={location.name}
                    className="location-photo"
                  />
                </div>
              )}

              {/* Descripció */}
              {location.description && (
                <div className="info-section">
                  <p className="description-text">{location.description}</p>
                </div>
              )}
            </IonCardContent>
          </IonCard>

          {/* Informació meteorològica */}
          <WeatherInfo
            latitude={location.lat}
            longitude={location.lng}
            showMushroomForecast={true}
          />

          <IonCard>
            <IonCardContent>
              {/* Informació de la localització */}
              <div className="info-section">
                <ul className="card-info">
                  <li className="card-info-item">
                    <IonIcon icon={navigateOutline} />
                    <div>
                      <strong>Coordenades</strong>
                      <p>{formatCoordinates(location.lat, location.lng)}</p>
                    </div>
                  </li>

                  {location.city && (
                    <li className="card-info-item">
                      <IonIcon icon={locationOutline} />
                      <div>
                        <strong>Ubicació</strong>
                        <p>{location.city}</p>
                      </div>
                    </li>
                  )}

                  <li className="card-info-item">
                    <IonIcon icon={calendarOutline} />
                    <div>
                      <strong>Data de creació</strong>
                      <p>{formatDate(location.createdAt)}</p>
                    </div>
                  </li>

                  {isOwner && (
                    <li className="card-info-item">
                      <IonIcon icon={personOutline} />
                      <div>
                        <strong>Propietari</strong>
                        <p>Tu</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Accions */}
              <div className="form-actions">
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={handleViewOnMap}
                >
                  <IonIcon icon={mapOutline} slot="start" />
                  Veure al Mapa
                </IonButton>

                {isOwner && (
                  <DeleteButton
                    itemName={location.name}
                    onDelete={handleDelete}
                    buttonTitle="Eliminar localització"
                    alertMessage={`Estàs segur que vols eliminar la localització "${location.name}"? Aquesta acció no es pot desfer.`}
                  />
                )}
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default LocationDetail;
