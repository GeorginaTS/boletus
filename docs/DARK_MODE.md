# Dark Mode (Mode fosc)

Aquest document descriu com funciona el mode fosc a l'aplicació, on està configurat, i com canviar-lo programàticament.

## Resum

- El mode fosc s'implementa amb variables CSS (fitxer `src/theme/variables.css`) i una classe global (`.dark-theme`) aplicada al `document.documentElement` o a un contenidor arrel.
- L'estat del tema es gestiona per un React Context / hook (habitualment `AuthContext` / `ThemeContext` o un hook `useTheme`) i es persisteix a `localStorage` per recordar la preferència de l'usuari.
- Ionic s'integra amb la classe per aprofitar els estils nadius quan cal.

## Fitxers rellevants

- `src/theme/variables.css` — definició de variables CSS per a light i dark (colors, accents, fons).
- `src/styles/globals.css` (o `globals-dark.css`) — estils globals adicionals per a cada tema.
- `src/contexts/ThemeContext.tsx` o `src/hooks/useTheme.ts` — proveeixen l'API per llegir i canviar el tema (pot variar segons la implementació del projecte).
- `index.html` / `src/main.tsx` — punts on es pot aplicar la classe `.dark-theme` a l'arrel.


## Com funciona (flow)

1. En l'inicialització de l'app, el `ThemeContext` (o `useTheme`) comprova `localStorage` per la preferència guardada (p.ex. `theme = 'dark'|'light'`).
2. Si no hi ha preferència, detecta la preferència del sistema amb `window.matchMedia('(prefers-color-scheme: dark)')` i la usa com a valor inicial.
3. Quan el tema canvia, el context:
   - aplica o treu la classe `.dark-theme` a `document.documentElement` (o un node arrel)
   - persisteix la preferència a `localStorage`
   - (opcional) notifica components que usen el context perquè actualitzin estats o anomenin callbacks.
4. Les variables CSS definides a `:root` i sota `.dark-theme` sobreescriuen colors i valors per mostrar el tema corresponent.

## Exemple d'ús (pseudo-codi)

```tsx
// src/hooks/useTheme.ts
import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored as 'dark'|'light';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark-theme'); else root.classList.remove('dark-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

  return { theme, setTheme, toggleTheme };
}
```

I un exemple d'ús en un component:

```tsx
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme === 'dark' ? 'Light' : 'Dark'}</button>;
};
```

## Variables CSS (exemple)

```css
:root {
  --bg: #fff;
  --text: #222;
  --primary: #99582a;
}

.dark-theme {
  --bg: #111;
  --text: #fff;
  --primary: #bb9457;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

## Integració amb Ionic

- Ionic aplica la classe global `.ios` o `.md` segons la plataforma; sincronitza la teva classe `.dark-theme` amb l'estil global perquè components d'Ionic respectin el mode fosc.
- Si utilitzes `Ionic` theming, assegura't que `variables.css` defineix les propietats d'Ionic (per exemple `--ion-color-primary`, etc.) per a ambdós temes.

## Debugging / Comprovar que funciona

1. Obre la consola del navegador i comprova si `document.documentElement.classList` inclou `dark-theme` quan actives el mode fosc.
2. Revisa `localStorage.getItem('theme')` per veure la preferència guardada.
3. Inspecciona les regles CSS per verificar que les variables (`--bg`, `--text`, `--primary`, o `--ion-color-primary`) s'estan aplicant en el DOM.
4. Si utilitzes Ionic i veus discrepàncies, comprova `src/theme/variables.css` per assegurar que estàs assignant les variables correctes també a les propietats d'Ionic.

## Millores opcionals

- Afegir una animació suau al canvi de tema (transició de colors) perquè el canvi sigui menys abrupte.
- Permetre `system` com a opció que segueixi sempre la preferència del sistema i no persisteixi l'estat a `localStorage` si l'usuari escull aquesta opció.
- Afegir tests unitari pel hook `useTheme` (comprovant persistència i efectes DOM) amb Vitest.

## Resum

- El mode fosc es basa en variables CSS i una classe `.dark-theme` aplicada globalment.
- El `ThemeContext` / `useTheme` gestiona l'estat, persisteix a `localStorage`, i sincronitza el DOM.
- Revisa `src/theme/variables.css` i el hook/context responsable per a implementacions específiques.

---

Si vols, puc generar aquest fitxer `docs/DARK_MODE.md` a la carpeta `docs/` (jo puc fer-ho ara) i ajustar el `README.md` perquè enllaci a aquest document. Vols que l'afegeixi?