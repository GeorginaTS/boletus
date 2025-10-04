import { LocationData } from '@services/geolocationService';
import { googleMapsService } from '@services/googleMapsService';
import React, { useEffect, useRef } from 'react';

interface MapViewProps {
  userLocation?: LocationData | null;
  height?: string;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  userLocation, 
  height = '400px',
  className = '' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!mapRef.current || isInitialized.current) return;

    // Inicialitza el mapa de Google Maps
    const initializeMap = async () => {
      try {
        await googleMapsService.createMap(mapRef.current!);
        isInitialized.current = true;
        console.log('🗺️ Google Maps inicialitzat');
        
        // Carrega les localitzacions guardades
        await googleMapsService.loadAndDisplayLocations();
        
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
  }, []);

  // Actualitza la ubicació de l'usuari
  useEffect(() => {
    if (!isInitialized.current || !userLocation) return;

    console.log('📍 Actualitzant ubicació de l\'usuari:', userLocation);
    googleMapsService.updateUserLocation(userLocation);
  }, [userLocation]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height, 
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      className={`google-map ${className}`}
    />
  );
};

export default MapView;