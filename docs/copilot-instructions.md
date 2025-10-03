# Instruccions de Desenvolupament per Copilot - Mushroom Finder

## Política d'Estils i CSS

### PRIORITAT 1: Usar Classes Globals Existents

Abans de crear qualsevol estil nou, **SEMPRE** revisar primer les classes globals disponibles a `src/theme/variables.css`:

1. **Comprovar variables CSS disponibles** (`--spacing-*`, `--font-size-*`, `--border-radius-*`, etc.)
2. **Buscar classes globals existents** (`.container`, `.btn-primary`, `.card-header-centered`, etc.)
3. **Usar classes d'utilitat disponibles** (`.mb-md`, `.mt-lg`, `.text-center`, etc.)

### PRIORITAT 2: Crear Classes Globals Reutilitzables

Si no existeix una classe adequada, crear-la com a **classe global** a `variables.css`:

- **Components reutilitzables**: `.data-display`, `.location-card`, `.form-actions`
- **Patrons comuns**: `.data-value`, `.data-timestamp`, `.small-text`
- **Layouts generals**: `.container-*`, `.grid-*`, `.flex-*`

### PRIORITAT 3: Estils Específics com a Última Opció

Només crear estils específics al fitxer CSS del component quan:

- L'estil és úniquament específic per aquest component
- No es pot generalitzar per reutilitzar
- És una modificació menor d'una classe global

## Classes Globals Disponibles

### Layout i Contenidors

- `.container`, `.container-sm`, `.container-lg`
- `.form-container`, `.card-header-centered`
- `.data-display`, `.segment-container`

### Botons

- `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.mushroom-button`, `.forest-button`

### Targetes i Components

- `.nature-card`, `.location-card`
- `.avatar-lg`, `.avatar-md`, `.avatar-sm`, `.avatar-placeholder`

### Tipografia

- `.title-primary`, `.title-secondary`, `.title-section`
- `.small-text`

### Dades i Valors

- `.data-display`, `.data-group`, `.data-value`, `.data-timestamp`

### Utilitats d'Espaiament

- `.mb-xs`, `.mb-sm`, `.mb-md`, `.mb-lg`, `.mb-xl`
- `.mt-xs`, `.mt-sm`, `.mt-md`, `.mt-lg`, `.mt-xl`
- `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-xl`

### Utilitats de Text

- `.text-center`, `.text-left`, `.text-right`

## Flux de Treball Recomanat

1. **Analitzar els requeriments d'estil**
2. **Buscar a variables.css** si ja existeix una solució
3. **Combinar classes globals** existents si cal
4. **Si no n'hi ha cap**: Crear classe global reutilitzable
5. **Documentar la nova classe** amb comentaris explicatius
6. **Actualitzar components** per usar les noves classes globals

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
