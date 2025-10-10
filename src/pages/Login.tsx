import { useAuth } from "@/contexts/AuthContext";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonToast,
} from "@ionic/react";
import { leafOutline, logoGoogle } from "ionicons/icons";
import React, { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import "./Login.css";

const Login: React.FC = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { loginWithGoogle, loading } = useAuth();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!email || !password) {
  //     setToastMessage("Omple tots els camps");
  //     setShowToast(true);
  //     return;
  //   }

  //   try {
  //     setShowToast(true);
  //   } catch (error) {
  //     setToastMessage((error as Error).message);
  //     setShowToast(true);
  //   }
  // };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setToastMessage("Login amb Google correcte!");
      setShowToast(true);
    } catch (error) {
      setToastMessage((error as Error).message);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <SectionHeader icon={leafOutline} title="Boletus App" />
      </IonHeader>

      <IonContent>
        <div className="login-container">
          <img src="/assets/img/logo.png" alt="Boletus" />
          <IonCard className="form-container">
            <IonCardContent>
              <div className="login-header">
                <h1 className="title-primary">Iniciar Sessió</h1>
                <p>Troba els millors llocs per bolets!</p>
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
