import { IonIcon, IonText, IonToolbar } from '@ionic/react';
import React from 'react';
import './SectionHeader.css';
import ThemeToggle from './ThemeToggle';

interface SectionHeaderProps {
  icon: string;
  title: string;
  className?: string;
  showThemeToggle?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  icon, 
  title, 
  showThemeToggle = true
}) => {
  return (
    <IonToolbar>
      <div 
        slot="start" className='title'>
        <IonIcon 
          icon={icon}  />
        <IonText>
          {title}
        </IonText>
      </div>
      
      {showThemeToggle && (
        <div slot="end">
          <ThemeToggle className="theme-toggle-header" />
        </div>
      )}
    </IonToolbar>
  );
};

export default SectionHeader;