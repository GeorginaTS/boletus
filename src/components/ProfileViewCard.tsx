import LastLocationCard from "@/components/LastLocationCard";
import { UserProfile } from "@/types/user";
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { User } from "firebase/auth";
import {
  create,
  globeOutline,
  locationOutline,
  logOut,
  mail,
  person,
} from "ionicons/icons";
import React from "react";

interface ProfileViewCardProps {
  user: User | null;
  userProfile: UserProfile | null;
  onEditProfile: () => void;
  onLogout: () => void;
}

const ProfileViewCard: React.FC<ProfileViewCardProps> = ({
  user,
  userProfile,
  onEditProfile,
  onLogout,
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <div className="card-header-centered">
          <IonAvatar className="avatar-lg">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" />
            ) : (
              <div className="avatar-placeholder">
                <IonIcon icon={person} />
              </div>
            )}
          </IonAvatar>
          <IonCardTitle>
            {userProfile?.displayName || user?.displayName || "Usuari"}
          </IonCardTitle>
        </div>
      </IonCardHeader>

      <IonCardContent>
        {!userProfile && (
          <div className="profile-incomplete-message">
            <IonIcon icon={create} color="primary" />
            <p>Completa el teu perfil per obtenir la millor experiència</p>
            <IonButton fill="outline" size="small" onClick={onEditProfile}>
              Completar Perfil
            </IonButton>
          </div>
        )}

        <IonList>
          <IonItem>
            <IonIcon icon={mail} slot="start" />
            <IonLabel>
              <h3>Email</h3>
              <p>{user?.email || "No disponible"}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonIcon icon={person} slot="start" />
            <IonLabel>
              <h3>Nom d'usuari</h3>
              <p>
                {userProfile?.displayName || user?.displayName || "Sense nom"}
              </p>
            </IonLabel>
          </IonItem>

          {userProfile?.city && (
            <IonItem>
              <IonIcon icon={locationOutline} slot="start" />
              <IonLabel>
                <h3>Ciutat</h3>
                <p>{userProfile.city}</p>
              </IonLabel>
            </IonItem>
          )}

          {userProfile?.country && (
            <IonItem>
              <IonIcon icon={globeOutline} slot="start" />
              <IonLabel>
                <h3>País</h3>
                <p>{userProfile.country}</p>
              </IonLabel>
            </IonItem>
          )}
        </IonList>

        {/* Secció d'Última Ubicació */}
        {userProfile?.latitude && userProfile?.longitude && (
          <LastLocationCard
            latitude={userProfile.latitude}
            longitude={userProfile.longitude}
            lastLocationUpdate={userProfile.lastLocationUpdate}
          />
        )}

        <div className="profile-actions">
          <IonButton
            expand="block"
            color="danger"
            onClick={onLogout}
            className="btn-danger"
          >
            <IonIcon icon={logOut} slot="start" />
            Tancar Sessió
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProfileViewCard;
