import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import { LocationData } from '../services/geolocationService';

// Corregeix la icona del marker de Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const mapInstance = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const accuracyCircle = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Inicialitza el mapa
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([41.3851, 2.1734], 13); // Barcelona per defecte

      // Afegeix capes de mapa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);

      console.log('🗺️ Mapa inicialitzat');
      
      // Assegura que el mapa es redimensioni correctament
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 100);
    }

    return () => {
      // Neteja el mapa quan el component es desmunta
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        console.log('🗺️ Mapa eliminat');
      }
    };
  }, []);

  // Actualitza la ubicació de l'usuari
  useEffect(() => {
    if (!mapInstance.current || !userLocation) return;

    const { latitude, longitude, accuracy } = userLocation;
    
    console.log('📍 Actualitzant ubicació de l\'usuari:', userLocation);

    // Elimina el marker anterior
    if (userMarker.current) {
      mapInstance.current.removeLayer(userMarker.current);
    }
    
    // Elimina el cercle de precisió anterior
    if (accuracyCircle.current) {
      mapInstance.current.removeLayer(accuracyCircle.current);
    }

    // Crea el marker de l'usuari
    userMarker.current = L.marker([latitude, longitude])
      .addTo(mapInstance.current)
      .bindPopup(`
        <div>
          <h4>📍 Tu ets aquí</h4>
          <p><strong>Coordenades:</strong><br/>
          ${latitude.toFixed(6)}°, ${longitude.toFixed(6)}°</p>
          <p><strong>Precisió:</strong> ${Math.round(accuracy)}m</p>
          <p><strong>Actualitzat:</strong> ${new Date(userLocation.timestamp).toLocaleTimeString('ca-ES')}</p>
        </div>
      `)
      .openPopup();

    // Crea el cercle de precisió
    accuracyCircle.current = L.circle([latitude, longitude], {
      radius: accuracy,
      color: '#007AFF',
      fillColor: '#007AFF',
      fillOpacity: 0.1,
      weight: 2
    }).addTo(mapInstance.current);

    // Centra el mapa a la ubicació de l'usuari
    mapInstance.current.setView([latitude, longitude], 15);

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
      className={`leaflet-map ${className}`}
    />
  );
};

export default MapView;