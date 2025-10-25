# Location Storage Setup

## Overview
Aquest document explica com es gestionen i emmagatzemen les ubicacions a l'app, utilitzant el mòdul o hook `locationStorage`.

---

## 1. Què és Location Storage?

- Permet guardar, recuperar i eliminar ubicacions (latitud/longitud) de l'usuari o d'interès.
- S'utilitza per guardar llocs visitats, zones de bolets, preferits, etc.

---

## 2. Implementació de `locationStorage`

- **Fitxer:** `src/hooks/locationStorage.ts` o `src/services/locationStorage.ts`
- **Funcionalitat:**
  - Guarda ubicacions a la memòria local (localStorage, IndexedDB, o Firebase).
  - Recupera la llista d'ubicacions guardades.
  - Elimina ubicacions.
- **Exemple d'ús:**
  ```ts
  import { saveLocation, getLocations, removeLocation } from '@/hooks/locationStorage';
  // ...existing code...
  saveLocation({ lat: 41.4, lng: 2.1 });
  const locations = getLocations();
  removeLocation(id);
  ```

---

## 3. Troubleshooting

- Comprova que la ubicació es guarda correctament.
- Verifica que la llista d'ubicacions es recupera i mostra bé.
- Revisa la gestió d'errors en l'emmagatzematge.

---

## Referències
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

---

**Last updated:** October 25, 2025
