import SectionHeader from '@/components/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import UserProfileForm from '@components/UserProfileForm';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToast,
  IonToolbar
} from '@ionic/react';
import { create, globeOutline, locationOutline, logOut, mail, navigateOutline, person } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'view' | 'edit'>('view');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Debug: Comprovar dades d'usuari només quan canvien user o userProfile
  useEffect(() => {
    console.log('User data changed:', {
      photoURL: user?.photoURL,
      displayName: user?.displayName,
      email: user?.email,
      userProfile
    });
  }, [user, userProfile]); // Només s'executa quan user o userProfile canvien

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al fer logout:', error);
    }
  };

  const handleSaveProfile = () => {
    setCurrentView('view');
    setToastMessage('Perfil actualitzat correctament!');
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <SectionHeader icon={person} title="El Meu Perfil" />
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
          </IonToolbar>
        </IonHeader>
        
        <div className="container">
          <IonSegment 
            value={currentView} 
            onIonChange={(e) => setCurrentView(e.detail.value as 'view' | 'edit')}
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

          {currentView === 'view' && (
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
                  {userProfile?.displayName || user?.displayName || 'Usuari'}
                </IonCardTitle>
              </div>
            </IonCardHeader>
            
            <IonCardContent>
              {!userProfile && (
                <div className="profile-incomplete-message">
                  <IonIcon icon={create} color="primary" />
                  <p>Completa el teu perfil per obtenir la millor experiència</p>
                  <IonButton 
                    fill="outline" 
                    size="small"
                    onClick={() => setCurrentView('edit')}
                  >
                    Completar Perfil
                  </IonButton>
                </div>
              )}
              
              <IonList>
                <IonItem>
                  <IonIcon icon={mail} slot="start" />
                  <IonLabel>
                    <h3>Email</h3>
                    <p>{user?.email || 'No disponible'}</p>
                  </IonLabel>
                </IonItem>
                
                <IonItem>
                  <IonIcon icon={person} slot="start" />
                  <IonLabel>
                    <h3>Nom d'usuari</h3>
                    <p>{userProfile?.displayName || user?.displayName || 'Sense nom'}</p>
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
                          {userProfile.latitude.toFixed(6)}°, {userProfile.longitude.toFixed(6)}°
                        </p>
                      </div>
                      
                      {userProfile.lastLocationUpdate && (
                        <div className="data-timestamp">
                          <h4>Última actualització</h4>
                          <p>{userProfile.lastLocationUpdate.toLocaleString('ca-ES', {
                            day: '2-digit',
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                      )}
                    </div>
                  </IonCardContent>
                </IonCard>
              )}
              
              <div className="profile-actions">
                <IonButton
                  expand="block"
                  color="danger"
                  onClick={handleLogout}
                  className="btn-danger"
                >
                  <IonIcon icon={logOut} slot="start" />
                  Tancar Sessió
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
          )}

          {currentView === 'edit' && (
            <UserProfileForm 
              isNew={!userProfile} 
              onSave={handleSaveProfile}
            />
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
