# Instruccions de Desenvolupament per Copilot - Mushroom Finder

## 🎨 Política d'Estils i CSS

### PRIORITAT ABSOLUTA: REUTILITZAR CLASSES GLOBALS

**NO CREAR CLASSES NOVES SI NO ÉS IMPRESCINDIBLE**

### Jerarquia de Prioritats

1. **Components Ionic natiu** (`IonCard`, `IonButton`, `IonItem`, etc.)
2. **Classes globals existents** (`src/theme/variables.css`)
3. **Només si és absolutament necessari**: Classes específiques del component

### Classes Globals Disponibles

#### Layout i Contenidors

```css
.container          /* Contenidor principal responsive */
/* Contenidor principal responsive */
.container-sm       /* Contenidor petit (max-width: 600px) */
.container-lg       /* Contenidor gran (max-width: 1200px) */
.form-container     /* Contenidor per formularis */
.card-header-centered /* Header de card centrat */
.data-display       /* Contenidor per mostrar dades */
.segment-container; /* Contenidor per segments */
```

#### Cards i Info

```css
.card-info          /* Card d'informació general */
/* Card d'informació general */
.card-info-item     /* Item dins d'un card d'informació */
.info-section       /* Secció d'informació */
.info-row           /* Fila d'informació */
.info-label         /* Etiqueta d'informació */
.info-value; /* Valor d'informació */
```

#### Botons

```css
.btn-primary        /* Botó primari */
/* Botó primari */
.btn-secondary      /* Botó secundari */
.btn-danger         /* Botó de perill/delete */
.mushroom-button    /* Botó temàtic bolets */
.forest-button; /* Botó temàtic bosc */
```

#### Forms i Accions

```css
.form-actions       /* Contenidor per accions de formulari */
/* Contenidor per accions de formulari */
.form-actions-row; /* Fila d'accions amb botons */
```

#### Cards Temàtiques

```css
.nature-card        /* Card amb tema natural */
/* Card amb tema natural */
.location-card; /* Card per ubicacions */
```

#### Avatars

```css
.avatar-lg          /* Avatar gran (128px) */
/* Avatar gran (128px) */
.avatar-md          /* Avatar mitjà (64px) */
.avatar-sm          /* Avatar petit (48px) */
.avatar-placeholder; /* Avatar placeholder */
```

#### Tipografia

```css
.title-primary      /* Títol principal */
/* Títol principal */
.title-secondary    /* Títol secundari */
.title-section      /* Títol de secció */
.small-text; /* Text petit */
```

#### Espaiament (Margins Bottom)

```css
.mb-xs              /* margin-bottom: 0.5rem */
/* margin-bottom: 0.5rem */
.mb-sm              /* margin-bottom: 1rem */
.mb-md              /* margin-bottom: 1.5rem */
.mb-lg              /* margin-bottom: 2rem */
.mb-xl; /* margin-bottom: 3rem */
```

#### Espaiament (Margins Top)

```css
.mt-xs              /* margin-top: 0.5rem */
/* margin-top: 0.5rem */
.mt-sm              /* margin-top: 1rem */
.mt-md              /* margin-top: 1.5rem */
.mt-lg              /* margin-top: 2rem */
.mt-xl; /* margin-top: 3rem */
```

#### Espaiament (Padding)

```css
.p-xs               /* padding: 0.5rem */
/* padding: 0.5rem */
.p-sm               /* padding: 1rem */
.p-md               /* padding: 1.5rem */
.p-lg               /* padding: 2rem */
.p-xl; /* padding: 3rem */
```

#### Utilitats de Text

```css
.text-center        /* text-align: center */
/* text-align: center */
.text-left          /* text-align: left */
.text-right; /* text-align: right */
```

## 🌓 Gestió del Dark Mode

### IMPORTANT: Usar .dark-theme, NO @media queries

L'aplicació gestiona el dark mode amb la classe `.dark-theme` aplicada al body/html mitjançant `ThemeContext`.

**❌ MAL - NO usar media queries:**

```css
@media (prefers-color-scheme: dark) {
  .my-element {
    background: #000;
  }
}
```

**✅ CORRECTE - Usar .dark-theme:**

```css
.my-element {
  background: #fff;
  color: #000;
}

.dark-theme .my-element {
  background: #1e1e1e;
  color: #fff;
}
```

### Workflow Dark Mode

1. **Definir estils light per defecte**
2. **Afegir prefix `.dark-theme` per estils dark**
3. **Usar variables CSS d'Ionic quan sigui possible**: `var(--ion-color-primary)`, `var(--ion-background-color)`, etc.

### Exemples de Dark Mode Correcte

```css
/* Light mode (default) */
.weather-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #333333;
}

/* Dark mode */
.dark-theme .weather-card {
  background: #1e1e1e;
  border: 1px solid #3a3a3a;
  color: #e0e0e0;
}

/* Usar variables Ionic (recomanat) */
.info-section {
  background: var(--ion-card-background);
  color: var(--ion-text-color);
}
```

### Variables Ionic per Dark Mode

```css
/* Aquestes variables canvien automàticament amb dark mode */
var(--ion-background-color)
var(--ion-text-color)
var(--ion-card-background)
var(--ion-item-background)
var(--ion-color-primary)
var(--ion-color-secondary)
var(--ion-border-color)
```

## 🧩 Components Reutilitzables

### Principi IMPORTANT

**SEMPRE intentar crear components reutilitzables abans de duplicar codi.**

### Exemples de Components Reutilitzables

#### ✅ Bon Exemple: SectionHeader

```tsx
// Component genèric reutilitzable a totes les pàgines
<SectionHeader icon={locationOutline} title="Detall d'Ubicació" />
```

#### ✅ Bon Exemple: DeleteButton

```tsx
// Component genèric per qualsevol acció de delete
<DeleteButton onDelete={() => handleDelete(id)} itemName="aquesta ubicació" />
```

#### ❌ Mal Exemple: Codi duplicat

```tsx
// A LocationDetail.tsx
<IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} />

// A Profile.tsx
<IonAlert isOpen={showDeleteAlert} onDidDismiss={() => setShowDeleteAlert(false)} />

// Millor: Crear un component reutilitzable ConfirmDialog
```

### Checklist per Components Reutilitzables

Abans de crear codi nou, preguntar-se:

1. ✅ **Aquest patró es pot usar en altres llocs?** → Crear component reutilitzable
2. ✅ **Té lògica repetitiva?** → Extreure a custom hook o utilitat
3. ✅ **Té estils repetitius?** → Usar classes globals o crear-ne una nova a `variables.css`
4. ❌ **És molt específic d'una sola pàgina?** → OK component local

### Estructura de Components Recomanada

```
src/components/
  ├── SectionHeader.tsx       # Header amb icona, títol i theme toggle
  ├── DeleteButton.tsx        # Botó delete amb confirmació
  ├── PhotoManager.tsx        # Gestió de fotos amb camera
  ├── WeatherInfo.tsx         # Informació meteorològica
  ├── LocationListCard.tsx    # Card de llista d'ubicacions
  └── [NouComponent].tsx      # Només si és reutilitzable
```

## 📋 Flux de Treball Recomanat

### Quan Afegir Estils

1. **Intentar primer amb components Ionic natius** (`IonCard`, `IonButton`, etc.)
2. **Buscar classes globals existents** a `src/theme/variables.css`
3. **Si no existeix**: Combinar classes globals existents
4. **Si és reutilitzable**: Afegir nova classe global a `variables.css`
5. **Última opció**: Crear CSS específic del component (mínim possible)

### Exemples d'Implementació

#### ❌ MALAMENT - Crear CSS específic innecessari

```tsx
// MyComponent.tsx
<div className="my-custom-weather-display">
  <div className="my-weather-header">...</div>
</div>

// MyComponent.css
.my-custom-weather-display {
  padding: 1rem;
  background: white;
}
.my-weather-header {
  font-size: 1.2rem;
  font-weight: bold;
}
```

#### ✅ CORRECTE - Usar classes globals

```tsx
// MyComponent.tsx
<IonCard className="card-info">
  <div className="info-section">
    <h3 className="title-section">Temps</h3>
  </div>
</IonCard>

// NO cal CSS específic!
```

#### ✅ CORRECTE - Crear classe global si és reutilitzable

```tsx
// Múltiples components necessiten mateix estil
// Afegir a variables.css:
.score-bar {
  height: 8px;
  background: var(--ion-color-light);
  border-radius: 4px;
  overflow: hidden;
}

// Usar a múltiples components:
<div className="score-bar">...</div>
```

## 🎯 Recordatoris Importants

1. **NO crear classes noves si no és imprescindible**
2. **SEMPRE usar `.dark-theme` prefix per dark mode** (NO media queries)
3. **Components han de ser reutilitzables sempre que sigui possible**
4. **Preferir variables Ionic** (`var(--ion-color-primary)`) sobre colors hardcoded
5. **Minimitzar CSS específic de component** (màxim 50-100 línies)
6. **Abans de crear CSS nou**: Revisar `variables.css` per classes existents

## 📊 Mètriques de Qualitat

### CSS Optimitzat (Objectiu)

- **WeatherInfo.css**: 53 línies (✅ Optimitzat amb globals)
- **LocationDetail.css**: ~40 línies (✅ Usa globals + dark mode correcte)
- **PhotoManager.css**: ~35 línies (✅ Mínim CSS específic)

### CSS Mal Optimitzat (Evitar)

- **Component amb 200+ línies CSS** (❌ Duplicació, no usar globals)
- **Media queries per dark mode** (❌ Usar `.dark-theme`)
- **Codi duplicat entre components** (❌ Extreure a global o component reutilitzable)

## 🔧 Variables d'Entorn

Sempre documentar variables noves a `.env.example`:

```bash
# OpenWeather API (free tier: 1000 calls/day)
VITE_OPENWEATHER_API_KEY=your_api_key_here

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```
