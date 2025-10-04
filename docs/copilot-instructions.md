# Instruccions de Desenvolupament per Copilot - Mushroom Finder

## Política d'Estils i CSS

### PRIORITAT 1: Usar Tailwind CSS Utilities

**SEMPRE** prioritzar les classes d'utilitat de Tailwind abans que qualsevol altre enfocament:

1. **Classes d'utilitat de Tailwind** (`bg-primary-500`, `text-white`, `p-4`, `rounded-lg`, etc.)
2. **Components personalitzats de Tailwind** (definits a `src/styles/globals.css`)
3. **Classes globals del theme** (`src/theme/variables.css` per a estils específics d'Ionic)

### PRIORITAT 2: Components Personalitzats de Tailwind

Si cal crear un patró reutilitzable, usar `@layer components` a `src/styles/globals.css`:

- **Botons personalitzats**: `.btn-forest`, `.btn-earth`, `.btn-mushroom`
- **Cards temàtiques**: `.card-nature`, `.data-card`
- **Inputs personalitzats**: `.input-nature`
- **Utilitats específiques**: `.data-value-highlight`, `.location-marker`

### PRIORITAT 3: Classes Globals d'Ionic (variables.css)

Només per a estils específics d'Ionic que no es poden fer amb Tailwind:

- **Variables CSS d'Ionic** (`--ion-color-*`, ion component overrides)
- **Estils específics d'Ionic components** que requereixen selectors específics

### PRIORITAT 4: Estils Específics com a Última Opció

Només crear estils específics al fitxer CSS del component quan:

- L'estil és úniquament específic per aquest component
- No es pot crear amb Tailwind utilities
- És una modificació menor d'un component d'Ionic

## Classes Disponibles

### Tailwind CSS Utilities (PRIORITAT 1)

#### Layout & Spacing

- `container`, `mx-auto`, `px-4`, `py-2`, `m-4`, `p-6`
- `flex`, `grid`, `block`, `inline-block`, `hidden`
- `w-full`, `h-screen`, `max-w-md`, `min-h-full`

#### Colors (Theme Personalitzat)

- `bg-primary-500`, `text-primary-600`, `border-primary-200`
- `bg-secondary-400`, `text-secondary-700`
- `bg-forest`, `text-earth`, `bg-mushroom`
- `bg-gradient-to-br`, `from-primary-500`, `to-secondary-500`

#### Typography

- `text-sm`, `text-lg`, `text-xl`, `font-bold`, `font-mono`
- `text-center`, `text-left`, `uppercase`, `tracking-wide`

#### Borders & Rounded

- `rounded-md`, `rounded-lg`, `rounded-full`
- `border`, `border-2`, `border-primary-200`
- `shadow-md`, `shadow-lg`

### Components Personalitzats de Tailwind (PRIORITAT 2)

#### Botons Temàtics

- `.btn-forest`, `.btn-earth`, `.btn-mushroom`

#### Cards i Containers

- `.card-nature`, `.data-card`, `.container-responsive`

#### Inputs i Forms

- `.input-nature`

#### Dades i Valors

- `.data-value-highlight`, `.data-timestamp`

#### Utilitats Específiques

- `.location-marker`, `.transition-smooth`, `.text-shadow`

### Classes Globals d'Ionic (PRIORITAT 3)

#### Layout i Contenidors

- `.container`, `.container-sm`, `.container-lg`
- `.form-container`, `.card-header-centered`
- `.data-display`, `.segment-container`

#### Botons Ionic

- `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.mushroom-button`, `.forest-button`

#### Components Ionic

- `.nature-card`, `.location-card`
- `.avatar-lg`, `.avatar-md`, `.avatar-sm`, `.avatar-placeholder`

#### Tipografia Ionic

- `.title-primary`, `.title-secondary`, `.title-section`
- `.small-text`

#### Utilitats d'Espaiament Ionic

- `.mb-xs`, `.mb-sm`, `.mb-md`, `.mb-lg`, `.mb-xl`
- `.mt-xs`, `.mt-sm`, `.mt-md`, `.mt-lg`, `.mt-xl`
- `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-xl`

#### Utilitats de Text Ionic

- `.text-center`, `.text-left`, `.text-right`

## Combinant Tailwind amb Ionic

### Bones Pràctiques

1. **Usar Tailwind per layout i estils generals**: `flex`, `grid`, `p-4`, `bg-white`
2. **Mantenir Ionic per components específics**: `IonButton`, `IonCard`, `IonItem`
3. **Evitar conflictes**: No sobreescriure estils d'Ionic amb Tailwind force
4. **Responsive design**: Preferir Tailwind (`sm:`, `md:`, `lg:`) sobre CSS custom

### Exemples d'Implementació Correcta

```tsx
// ✅ CORRECTE - Combinar Tailwind amb Ionic
<IonCard className="card-nature">
  <div className="flex items-center justify-between p-4">
    <h3 className="text-lg font-bold text-primary-600">Ubicació</h3>
    <IonIcon icon={navigateOutline} className="text-primary-500" />
  </div>
  <div className="data-value-highlight">
    41.123456°, 2.654321°
  </div>
</IonCard>

// ❌ MALAMENT - Crear CSS específic
<div className="my-custom-location-card">
  <div className="my-header-style">...</div>
</div>
```

## Flux de Treball Recomanat

1. **Analitzar els requeriments d'estil**
2. **Intentar primer amb Tailwind utilities** (`bg-primary-500`, `p-4`, etc.)
3. **Combinar amb components personalitzats de Tailwind** (`.btn-forest`, `.data-card`)
4. **Si cal modificar Ionic**: Usar variables CSS a `variables.css`
5. **Si no existeix**: Crear component personalitzat a `globals.css`
6. **Última opció**: Estils específics al component

## Exemple d'Implementació Correcta

```tsx
// ❌ MALAMENT - crear estils específics
<div className="my-custom-location-display">

// ✅ CORRECTE - usar classes globals
<div className="data-display">
  <div className="data-group">
    <h3>Coordenades</h3>
    <p className="data-value">41.123456°, 2.654321°</p>
  </div>
  <div className="data-timestamp">
    <h4>Actualitzat</h4>
    <p>3/10/2025, 21:30</p>
  </div>
</div>
```

## Beneficis d'Aquesta Política

1. **Consistència visual** en tota l'aplicació
2. **Reducció de CSS duplicat**
3. **Mantenibilitat mejorada**
4. **Desenvolupament més ràpid**
5. **Temes i responsivitat centralitzats**

## Recordatori Important

**SEMPRE preguntar-se**: "Aquesta classe pot ser útil en altres parts de l'aplicació?" Si la resposta és sí, crear-la com a global a `variables.css`.
