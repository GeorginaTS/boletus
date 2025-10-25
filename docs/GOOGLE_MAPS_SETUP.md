# GOOGLE MAPS SETUP

## API Key Setup

1. **Access Google Cloud Console**
   - https://console.cloud.google.com/
2. **Create or select a project**
3. **Enable Maps JavaScript API**
   - APIs & Services > Library > Maps JavaScript API > Enable
4. **Create credentials**
   - APIs & Services > Credentials > Create Credentials > API Key
5. **Configure restrictions (recommended)**
   - Application restrictions: HTTP referrers (add `http://localhost:*/*` for dev)
   - API restrictions: Restrict key to "Maps JavaScript API"
6. **Add to app**
   - Copy `.env.example` to `.env`
   - Add: `VITE_GOOGLE_MAPS_API_KEY=your_api_key_here`

## Verification

If the API key is missing, you'll see:
```
⚠️ VITE_GOOGLE_MAPS_API_KEY no està definida. El mapa pot no funcionar correctament.
```
If configured correctly:
```
✅ Google Maps API carregada
🗺️ Google Maps inicialitzat
```

## Map ID for AdvancedMarkerElement

- Predefined mapId: `MUSHROOM_FINDER_MAP` (auto-configured)
- Required for advanced markers, performance, modern features
- Compatible with all Google Maps API v3 features

## Performance Optimization

- `loading=async`: Recommended async loading
- Dynamic callback: Loads without blocking main thread
- Single script: Prevents multiple API loads
- Intelligent polling: Waits for all libraries
- `AdvancedMarkerElement`: Modern API, better performance

---

**Last updated:** October 25, 2025
