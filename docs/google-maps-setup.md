# Configuració de Google Maps per a Testing

## Obtenció de l'API Key

1. **Accedeix a Google Cloud Console**
   - Visita: https://console.cloud.google.com/

2. **Crea o selecciona un projecte**
   - Crea un nou projecte o selecciona un d'existent

3. **Habilita l'API**
   - Vés a "APIs & Services" > "Library"
   - Cerca "Maps JavaScript API"
   - Fes clic a "Enable"

4. **Crea les credencials**
   - Vés a "APIs & Services" > "Credentials"
   - Fes clic a "Create Credentials" > "API Key"
   - Copia l'API key generada

5. **Configura restricions (recomanat)**
   - Fes clic a l'API key creada
   - A "Application restrictions", selecciona "HTTP referrers"
   - Afegeix: `http://localhost:*/*` per a desenvolupament
   - A "API restrictions", selecciona "Restrict key" i marca "Maps JavaScript API"

6. **Afegeix a l'aplicació**
   - Copia `.env.example` a `.env`
   - Afegeix: `VITE_GOOGLE_MAPS_API_KEY=la_teva_api_key_aquí`

## Verificació

L'aplicació mostrarà warnings si l'API key no està configurada:
```
⚠️ VITE_GOOGLE_MAPS_API_KEY no està definida. El mapa pot no funcionar correctament.
```

Un cop configurada correctament, veuràs:
```
✅ Google Maps API carregada
🗺️ Google Maps inicialitzat
```

## Map ID per a AdvancedMarkerElement

L'aplicació utilitza `AdvancedMarkerElement` que requereix un `mapId` vàlid:

- **mapId predefinit**: "MUSHROOM_FINDER_MAP" (configurat automàticament)
- **Necessari per**: Marcadors avançats, millor rendiment, funcionalitats modernes
- **Compatible amb**: Totes les funcionalitats de Google Maps API v3

## Optimització de rendiment

Aquesta implementació utilitza:

- **loading=async**: Càrrega asíncrona optimitzada recomanada per Google
- **Callback dinàmic**: Gestió de la càrrega sense bloquejar el thread principal
- **Script únic**: Evita carregar múltiples vegades l'API
- **Polling intelligent**: Espera que totes les biblioteques estiguin carregades
- **AdvancedMarkerElement**: API moderna amb millor rendiment
- **gestureHandling: "auto"**: Millora la gestió de gestos tàctils
- **clickableIcons**: Optimitza la interacció amb elements del mapa

## Limitacions de desenvolupament

- L'API key de Google Maps és gratuïta fins a un cert límit d'ús
- Per a producció, considera configurar facturació i restricions més estrictes
- El mapa mostrarà una marca d'aigua "For development purposes only" sense configuració de facturació