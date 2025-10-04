import { IonIcon, IonToolbar } from '@ionic/react';
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
  className = "nature-header",
  showThemeToggle = true
}) => {
  return (
    <IonToolbar className={className}>
      <div 
        slot="start" 
        className="section-header-container"
      >
        <IonIcon 
          icon={icon} 
          className="section-header-icon"
        />
        <span className="section-header-title">
          {title}
        </span>
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