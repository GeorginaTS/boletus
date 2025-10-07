import { IonButton, IonIcon } from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';
import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <IonButton
      fill="clear"
      onClick={toggleTheme}
      className='theme-toggle-header'
      title={isDark ? 'Canviar a mode clar' : 'Canviar a mode fosc'}
      aria-label={isDark ? 'Canviar a mode clar' : 'Canviar a mode fosc'}
    >
      <IonIcon 
        icon={isDark ? sunny : moon}
        slot="icon-only"
      />
    </IonButton>
  );
};

export default ThemeToggle;