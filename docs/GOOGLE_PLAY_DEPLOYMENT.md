# 📱 Guia de Publicació a Google Play Store

Guia completa per publicar Mushroom Finder a Google Play Store.

## 📋 Prerequisites

### 1. Compte de Google Play Console
- [ ] Crear compte de desenvolupador a [Google Play Console](https://play.google.com/console)
- [ ] Pagar la taxa única de registre (25 USD)
- [ ] Verificar identitat i informació de pagament

### 2. Eines Necessàries
```bash
# Verificar que tens tot instal·lat
node --version  # v16+
npm --version
ionic --version
```

## 🔧 Preparació del Projecte

### 1. Actualitzar Configuració de l'App

#### `capacitor.config.ts`
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.mushroomfinder',  // Canviar per el teu ID únic
  appName: 'Mushroom Finder',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#8B4513",
      showSpinner: false,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small"
    }
  }
};

export default config;
```

#### `package.json` - Versió
```json
{
  "name": "mushroom-finder",
  "version": "1.0.0",  // Format: MAJOR.MINOR.PATCH
  "description": "App per trobar i gestionar ubicacions de bolets"
}
```

### 2. Build de Producció

```bash
# 1. Build de l'aplicació web
npm run build

# 2. Sincronitzar amb Capacitor
npx cap sync android

# 3. Obrir Android Studio
npx cap open android
```

## 🔑 Configuració de Signing (Firma Digital)

### 1. Crear Keystore (Clau de Firma)

**IMPORTANT**: Guarda aquesta clau en un lloc segur. Si la perds, no podràs actualitzar l'app mai més!

```bash
# Navegar a la carpeta android/app
cd android/app

# Generar keystore
keytool -genkey -v -keystore mushroom-finder-release.keystore -alias mushroom-finder -keyalg RSA -keysize 2048 -validity 10000

# Respondre les preguntes:
# - Password del keystore (GUARDA-HO!)
# - Password de l'alias (pot ser el mateix)
# - Nom i cognoms
# - Unitat organitzativa
# - Organització
# - Ciutat
# - Estat/Província
# - Codi de país (ES)
```

**⚠️ MOLT IMPORTANT:**
- Guarda el fitxer `.keystore` en un lloc segur (no el pugis a Git!)
- Anota les contrasenyes en un gestor de contrasenyes
- Fes còpies de seguretat

### 2. Configurar Gradle per Signing

Crear fitxer `android/key.properties`:

```properties
storePassword=LA_TEVA_CONTRASENYA_KEYSTORE
keyPassword=LA_TEVA_CONTRASENYA_ALIAS
keyAlias=mushroom-finder
storeFile=mushroom-finder-release.keystore
```

**⚠️ Afegir a `.gitignore`:**
```gitignore
# Android signing
android/key.properties
android/app/*.keystore
```

### 3. Modificar `android/app/build.gradle`

Afegir abans de `android {`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Dins de `android { ... }`, afegir/modificar:

```gradle
android {
    ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 📦 Generar APK/AAB de Producció

### Opció 1: AAB (Bundle - Recomanat per Play Store)

```bash
cd android
./gradlew bundleRelease

# El fitxer es generarà a:
# android/app/build/outputs/bundle/release/app-release.aab
```

### Opció 2: APK (per testing)

```bash
cd android
./gradlew assembleRelease

# El fitxer es generarà a:
# android/app/build/outputs/apk/release/app-release.apk
```

## 📸 Preparar Materials de Marketing

### 1. Icones i Screenshots

**Screenshots necessàries** (mínim 2 per dispositiu):
- 📱 **Telèfon**: 1080 x 1920 px (o proporcional)
- 📱 **Tablet 7"**: 1024 x 1920 px
- 📱 **Tablet 10"**: 2048 x 2732 px

**Captura screenshots de:**
- Mapa amb marcadors de bolets
- Llista de localitzacions
- Detall d'ubicació amb temps
- Afegir nova ubicació
- Perfil d'usuari

**Icona de l'app:**
- 512 x 512 px (PNG)
- Fons transparent o de color
- Sense text (opcional)

**Feature Graphic** (banner):
- 1024 x 500 px
- PNG o JPG
- Mostra el nom de l'app i icona

### 2. Descripcions

#### **Títol** (màx. 50 caràcters)
```
Mushroom Finder - Localitzador Bolets
```

#### **Descripció Curta** (màx. 80 caràcters)
```
Troba, guarda i comparteix les millors ubicacions per recollir bolets
```

#### **Descripció Llarga** (màx. 4000 caràcters)
```
🍄 Mushroom Finder - La teva app per a la recerca de bolets

Mushroom Finder és l'aplicació perfecta per als amants dels bolets! Guarda les teves ubicacions favorites, consulta el temps en temps real i mai més perdràs aquell lloc especial on vas trobar bolets increïbles.

✨ CARACTERÍSTIQUES PRINCIPALS:

🗺️ MAPA INTERACTIU
• Visualitza totes les teves ubicacions amb marcadors personalitzats
• Afegeix noves ubicacions amb un simple clic al mapa
• Localització GPS precisa amb mode d'alta precisió
• Vista de terreny optimitzada per boscos

📍 GESTIÓ DE LOCALITZACIONS
• Guarda ubicacions amb fotos i descripció
• Coordenades GPS precises automàtiques
• Nom de ciutat i província detectat automàticament
• Data i hora de creació
• Edita i elimina les teves ubicacions

🌦️ INFORMACIÓ METEOROLÒGICA
• Dades meteorològiques en temps real
• Predicció per a recollida de bolets
• Temperatura, humitat, vent i núvols
• Índex de condicions favorables per bolets
• Integració amb OpenWeather API

📸 GESTIÓ DE FOTOS
• Captura fotos amb la càmera del dispositiu
• Emmagatzema fotos al núvol de forma segura
• Previsualització abans de guardar
• Una foto per ubicació

🎨 DISSENY MODERN
• Mode clar i fosc
• Tema natural amb colors terra
• Interfície intuïtiva i fàcil d'usar
• Optimitzat per mòbils i tablets

🔐 PRIVACITAT I SEGURETAT
• Autenticació segura amb Firebase
• Les teves dades són privades
• Còpia de seguretat automàtica al núvol
• Control total de les teves ubicacions

💡 PER A QUI ÉS AQUESTA APP?
• Buscadors de bolets professionals i aficionats
• Amants de la natura i el senderisme
• Qualsevol que vulgui recordar llocs especials al bosc
• Grups i famílies que comparteixen aficions

🚀 TECNOLOGIA
Desenvolupada amb les últimes tecnologies:
• Ionic Framework per a màxima compatibilitat
• Google Maps per a navegació precisa
• Firebase per a seguretat i sincronització
• OpenWeather per a dades meteorològiques fiables

📲 COMENÇA AVUI
Descarrega Mushroom Finder i no perdis mai més una bona ubicació de bolets!

---
Nota: L'app requereix permisos de localització i càmera per funcionar correctament.
```

## 🚀 Pujar a Google Play Console

### 1. Crear Nova App

1. Accedir a [Google Play Console](https://play.google.com/console)
2. Clic a **"Crear aplicació"**
3. Omplir:
   - **Nom de l'app**: Mushroom Finder
   - **Idioma predeterminat**: Català o Espanyol
   - **App o joc**: App
   - **Gratuïta o de pagament**: Gratuïta
4. Acceptar polítiques i crear

### 2. Configurar Fitxa de Play Store

#### **Detalls de l'app**
- Títol: Mushroom Finder
- Descripció curta i llarga (veure secció anterior)
- Icona: 512x512 px
- Feature graphic: 1024x500 px
- Screenshots (mínim 2)

#### **Categorització**
- **Categoria**: Viatges i oci
- **Tags**: bolets, natura, GPS, localització, bosc

#### **Informació de contacte**
- Email de contacte
- Pàgina web (opcional): URL de Firebase Hosting
- Política de privacitat (OBLIGATORI)

### 3. Classificació de Contingut

Emplenar qüestionari:
- No conté violència
- No conté contingut sexual
- No conté llenguatge inapropiat
- No conté contingut relacionat amb drogues
- Edat recomanada: 3+ (PEGI 3)

### 4. Preus i Distribució

- **Preu**: Gratuïta
- **Països**: Tots o seleccionats (Espanya, Catalunya, països UE)
- **Conté anuncis**: No
- **Política de privacitat**: URL obligatòria

### 5. Pujar el Build (AAB)

1. Anar a **"Producció"** > **"Crear una nova versió"**
2. Pujar el fitxer `app-release.aab`
3. Nom de la versió: `1.0.0` (o la teva versió)
4. Codi de versió: `1` (s'incrementa amb cada actualització)
5. Notes de la versió:
   ```
   🍄 Primera versió de Mushroom Finder
   
   • Mapa interactiu amb ubicacions de bolets
   • Gestió completa de localitzacions
   • Informació meteorològica en temps real
   • Càmera per capturar fotos
   • Mode clar i fosc
   • Sincronització al núvol
   ```

### 6. Revisió i Publicació

1. **Revisar tots els apartats** (Play Console et dirà què falta)
2. **Enviar per revisió**
3. **Temps de revisió**: 1-7 dies normalment
4. **Estat**: Pendiente > En revisión > Publicada

## 🔄 Actualitzacions Futures

### Incrementar Versió

**`package.json`:**
```json
{
  "version": "1.0.1"  // Increment: MAJOR.MINOR.PATCH
}
```

**`android/app/build.gradle`:**
```gradle
android {
    defaultConfig {
        versionCode 2          // Incrementar +1 cada build
        versionName "1.0.1"    // Mateix que package.json
    }
}
```

### Process d'Actualització

```bash
# 1. Build
npm run build
npx cap sync android

# 2. Generar AAB
cd android
./gradlew bundleRelease

# 3. Pujar a Play Console
# (Crear nova versió i pujar AAB)
```

## 📝 Checklist Final

### Abans de Publicar
- [ ] Keystore generat i guardat de forma segura
- [ ] `key.properties` configurat
- [ ] Build de producció generat (AAB)
- [ ] Screenshots preses (mínim 2)
- [ ] Icona 512x512 creada
- [ ] Feature graphic 1024x500 creat
- [ ] Descripció curta i llarga escrites
- [ ] Política de privacitat creada i publicada
- [ ] Qüestionari de classificació completat
- [ ] AAB pujat a Play Console
- [ ] Tots els apartats en verd a Play Console

### Requisits Legals
- [ ] Política de privacitat (OBLIGATORI)
- [ ] Termes i condicions (recomanat)
- [ ] Compliment GDPR (dades d'usuaris europeus)
- [ ] Declaració de permisos (localització, càmera)

## 🔐 Política de Privacitat

Crea una pàgina web amb la política de privacitat. Exemple bàsic:

```markdown
# Política de Privacitat - Mushroom Finder

**Última actualització**: [Data]

## Informació que Recopilem

Mushroom Finder recopila les següents dades:

- **Ubicació GPS**: Per guardar les ubicacions de bolets
- **Fotos**: Capturades amb la càmera del dispositiu
- **Compte d'usuari**: Email i informació d'autenticació (Firebase Auth)
- **Dades d'ubicació**: Nom de localització, coordenades, descripció

## Com Utilitzem les Dades

- Guardar ubicacions de bolets de l'usuari
- Mostrar ubicacions al mapa
- Sincronitzar dades entre dispositius
- Millorar l'experiència de l'usuari

## Emmagatzematge de Dades

Les dades es guarden de forma segura a Firebase (Google Cloud):
- Firebase Authentication (comptes d'usuari)
- Cloud Firestore (ubicacions i dades)
- Firebase Storage (fotos)

## Compartir Dades

NO compartim les teves dades amb tercers. Les teves ubicacions són privades.

## Permisos de l'App

- **Localització**: Per obtenir coordenades GPS precises
- **Càmera**: Per capturar fotos de les ubicacions
- **Emmagatzematge**: Per guardar fotos localment

## Drets de l'Usuari

- Accedir a les teves dades
- Eliminar el teu compte i dades
- Exportar les teves dades

## Contacte

Per preguntes sobre privacitat: [el_teu_email@example.com]
```

## 🆘 Solució de Problemes

### Error: "App Bundle no signat"
```bash
# Verificar que key.properties existeix
# Verificar que el keystore està a android/app/
# Rebuildar: ./gradlew clean bundleRelease
```

### Error: "Version code has to be higher"
```gradle
// A android/app/build.gradle, incrementar:
versionCode 2  // Era 1, ara 2
```

### Rebuig per Política de Privacitat
- Crear pàgina web amb política
- Pujar a Firebase Hosting
- Afegir URL a Play Console

## 📚 Recursos Addicionals

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)
- [Capacitor Android Deployment](https://capacitorjs.com/docs/android)
- [Ionic Publishing Guide](https://ionicframework.com/docs/deployment/play-store)

## 🎉 Consells Finals

1. **Prova l'APK abans**: Instal·la `app-release.apk` al teu dispositiu
2. **Beta testing**: Usa "Prova interna" o "Prova tancada" abans de producció
3. **Feedback**: Respon als comentaris dels usuaris
4. **Actualitzacions**: Publica actualitzacions regulars
5. **Analytics**: Considera afegir Google Analytics per a mètriques

---

**Bona sort amb la publicació! 🍄🚀**

# Guia ràpida: Crear i publicar nova versió a Google Play

## 1️⃣ Actualitzar versió

- Edita `package.json`:
  ```json
  "version": "1.1.0"
  ```
- Edita `android/app/build.gradle`:
  ```groovy
  defaultConfig {
      versionCode 2
      versionName "1.1"
  }
  ```

## 2️⃣ Construir web app

```bash
ionic build --prod
```
- Els fitxers generats es troben a `/www`

## 3️⃣ Sincronitzar amb Android

```bash
npx cap copy android
npx cap sync android
```
- Copia els fitxers web dins `android/`

## 4️⃣ Configurar signatura

- Col·loca `my-release-key.keystore` dins `android/app/` (o indica la ruta)
- Edita `android/app/build.gradle`:
  ```groovy
  signingConfigs {
      release {
          storeFile file('my-release-key.keystore')
          storePassword 'LA_CONTRASENYA'
          keyAlias 'myalias'
          keyPassword 'LA_CONTRASENYA'
      }
  }
  buildTypes {
      release {
          signingConfig signingConfigs.release
      }
  }
  ```

## 5️⃣ Generar AAB

```bash
cd android
./gradlew bundleRelease
```
- Es genera: `android/app/build/outputs/bundle/release/app-release.aab`

## 6️⃣ Comprovar signatura (opcional)

```bash
jarsigner -verify -verbose -certs app/build/outputs/bundle/release/app-release.aab
```
- El SHA1 ha de coincidir amb l'Upload Key

## 7️⃣ Pujar a Google Play

- Google Play Console → Release → Production / Testing → Create new release
- Puja `app-release.aab`
- Afegeix notes de versió
- Revisa → Start rollout / Publica

## 8️⃣ Esperar publicació

- Proves internes: quasi instantani
- Producció: 2-24h
