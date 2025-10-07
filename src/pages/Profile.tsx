import ProfileViewCard from "@/components/ProfileViewCard";
import SectionHeader from "@/components/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";
import UserProfileForm from "@components/UserProfileForm";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToast,
} from "@ionic/react";
import { create, person } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const [currentView, setCurrentView] = useState<"view" | "edit">("view");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Debug: Comprovar dades d'usuari només quan canvien user o userProfile
  useEffect(() => {
    console.log("User data changed:", {
      photoURL: user?.photoURL,
      displayName: user?.displayName,
      email: user?.email,
      userProfile,
    });
  }, [user, userProfile]); // Només s'executa quan user o userProfile canvien

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al fer logout:", error);
    }
  };

  const handleSaveProfile = () => {
    setCurrentView("view");
    setToastMessage("Perfil actualitzat correctament!");
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <SectionHeader icon={person} title="El Meu Perfil" />
      </IonHeader>
      <IonContent fullscreen>
        <div className="container">
          <IonSegment
            value={currentView}
            onIonChange={(e) =>
              setCurrentView(e.detail.value as "view" | "edit")
            }
            className="segment-container"
          >
            <IonSegmentButton value="view">
              <IonIcon icon={person} />
              Veure Perfil
            </IonSegmentButton>
            <IonSegmentButton value="edit">
              <IonIcon icon={create} />
              Editar Perfil
            </IonSegmentButton>
          </IonSegment>

          {currentView === "view" && (
            <ProfileViewCard
              user={user}
              userProfile={userProfile}
              onEditProfile={() => setCurrentView("edit")}
              onLogout={handleLogout}
            />
          )}

          {currentView === "edit" && (
            <UserProfileForm isNew={!userProfile} onSave={handleSaveProfile} />
          )}
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
