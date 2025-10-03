import {
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonInputPasswordToggle,
    IonItem,
    IonLoading,
    IonPage,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar
} from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { login, register, loginWithGoogle, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setToastMessage('Omple tots els camps');
      setShowToast(true);
      return;
    }

    try {
      if (isRegisterMode) {
        await register(email, password);
        setToastMessage('Compte creat correctament!');
      } else {
        await login(email, password);
        setToastMessage('Login correcte!');
      }
      setShowToast(true);
    } catch (error) {
      setToastMessage((error as Error).message);
      setShowToast(true);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setToastMessage('Login amb Google correcte!');
      setShowToast(true);
    } catch (error) {
      setToastMessage((error as Error).message);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mushroom Finder</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="login-content">
        <div className="login-container">
          <IonCard className="form-container">
            <IonCardContent>
              <div className="login-header">
                <h1 className="title-primary">{isRegisterMode ? 'Crear Compte' : 'Iniciar Sessió'}</h1>
                <p>Troba els millors llocs per bolets!</p>
              </div>

              <form onSubmit={handleSubmit}>
                <IonItem>
                  <IonInput
                    type="email"
                    fill="outline"
                    label="Email"
                    labelPlacement="floating"
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    type="password"
                    fill="outline"
                    label="Contrasenya"
                    labelPlacement="floating"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value!)}
                    required
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </IonItem>

                <IonButton
                  expand="block"
                  type="submit"
                  className="btn-primary mt-lg"
                  disabled={loading}
                >
                  {isRegisterMode ? 'Crear Compte' : 'Iniciar Sessió'}
                </IonButton>
              </form>

              {!isRegisterMode && (
                <>
                  <div className="login-divider">
                    <IonText color="medium">o</IonText>
                  </div>

                  <IonButton
                    expand="block"
                    fill="outline"
                    className="google-login-button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <IonIcon icon={logoGoogle} slot="start" />
                    Continuar amb Google
                  </IonButton>
                </>
              )}

              <div className="login-switch">
                <IonText>
                  {isRegisterMode ? 'Ja tens compte?' : 'No tens compte?'}
                </IonText>
                <IonButton
                  fill="clear"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                >
                  {isRegisterMode ? 'Iniciar Sessió' : 'Crear Compte'}
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={loading} message="Carregant..." />
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;