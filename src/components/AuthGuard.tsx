import React from 'react';
import { IonSpinner, IonContent, IonPage } from '@ionic/react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Mostrar spinner mentre carrega
  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Si no hi ha usuari autenticat, mostrar login
  if (!user) {
    return <Login />;
  }

  // Si hi ha usuari autenticat, mostrar el contingut protegit
  return <>{children}</>;
};

export default AuthGuard;