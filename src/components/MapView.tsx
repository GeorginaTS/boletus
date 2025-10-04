import { useAuth } from '@/contexts/AuthContext';
import { LocationData } from '@services/geolocationService';
import { googleMapsService } from '@services/googleMapsService';
import React, { useEffect, useRef } from 'react';



interface MapViewProps {
  userLocation?: LocationData | null;
  height?: string;
  className?: string;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  showMapTypeControls?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ 
  userLocation, 
  height = '400px',
  className = '',
  mapType = 'terrain', // Per defecte usa terrain (relleu)
  showMapTypeControls = true
}) => {
  const { user } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!mapRef.current || isInitialized.current) return;

    // Inicialitza el mapa de Google Maps
    const initializeMap = async () => {
      try {
        // Configuració personalitzada del mapa
        const mapConfig = {
          mapTypeId: mapType,
          mapTypeControl: showMapTypeControls,
        };
        
        await googleMapsService.createMap(mapRef.current!, mapConfig);
        isInitialized.current = true;
        console.log(`🗺️ Google Maps inicialitzat amb tipus: ${mapType}`);
        
        // Carrega les localitzacions guardades de l'usuari
        if (user) {
          await googleMapsService.loadAndDisplayLocations(user.uid);
        }
        
        // Redimensiona el mapa després d'un petit retard
        setTimeout(() => {
          googleMapsService.resize();
        }, 100);
      } catch (error) {
        console.error('❌ Error inicialitzant Google Maps:', error);
      }
    };

    initializeMap();

    return () => {
      // Neteja el mapa quan el component es desmunta
      googleMapsService.destroy();
      isInitialized.current = false;
      console.log('🗺️ Google Maps eliminat');
    };
  }, [user, mapType, showMapTypeControls]);

  // Actualitza la ubicació de l'usuari
  useEffect(() => {
    if (!isInitialized.current || !userLocation) return;

    console.log('📍 Actualitzant ubicació de l\'usuari:', userLocation);
    googleMapsService.updateUserLocation(userLocation);
  }, [userLocation]);

  return (
    <div 
      ref={mapRef} 
      style={{ height }} 
      className={`w-full absolute inset-0 google-map ${className}`}
    />
  );
};

export default MapView;