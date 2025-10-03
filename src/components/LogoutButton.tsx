import { IonAlert, IonButton, IonIcon } from '@ionic/react';
import { logOut } from 'ionicons/icons';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LogoutButtonProps {
  className?: string;
  showAlert?: boolean;
  children?: React.ReactNode;
  fill?: 'clear' | 'outline' | 'solid';
  expand?: 'full' | 'block';
  color?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className, 
  showAlert = true, 
  children, 
  fill = "clear",
  expand,
  color
}) => {
  const { logout, user } = useAuth();
  const [showAlertState, setShowAlertState] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al fer logout:', error);
    }
  };

  const handleClick = () => {
    if (showAlert) {
      setShowAlertState(true);
    } else {
      handleLogout();
    }
  };

  if (!user) return null;

  return (
    <>
      <IonButton 
        fill={fill}
        expand={expand}
        color={color}
        className={className}
        onClick={handleClick}
      >
        {children || <IonIcon icon={logOut} />}
      </IonButton>

      {showAlert && (
        <IonAlert
          isOpen={showAlertState}
          onDidDismiss={() => setShowAlertState(false)}
          header="Tancar Sessió"
          message="Segur que vols tancar la sessió?"
          buttons={[
            {
              text: 'Cancel·lar',
              role: 'cancel'
            },
            {
              text: 'Sí, tancar',
              handler: handleLogout
            }
          ]}
        />
      )}
    </>
  );
};

export default LogoutButton;