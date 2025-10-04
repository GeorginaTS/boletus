import { useAuth } from '@/contexts/AuthContext';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import Login from '@pages/Login';
import React from 'react';

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
          <div className="flex justify-center items-center h-full">
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