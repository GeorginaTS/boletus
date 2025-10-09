#!/bin/bash

# Script per generar build de producció per Google Play Store
# Ús: ./build-release.sh

echo "🍄 Mushroom Finder - Build de Producció"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estem al directori correcte
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Executa aquest script des del directori arrel del projecte${NC}"
    exit 1
fi

# 1. Clean
echo -e "${YELLOW}🧹 Netejant builds anteriors...${NC}"
rm -rf dist
rm -rf android/app/build

# 2. Install dependencies
echo -e "${YELLOW}📦 Instal·lant dependències...${NC}"
npm install

# 3. Build web
echo -e "${YELLOW}🔨 Compilant aplicació web...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el build web${NC}"
    exit 1
fi

# 4. Sync Capacitor
echo -e "${YELLOW}🔄 Sincronitzant amb Capacitor...${NC}"
npx cap sync android

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error sincronitzant amb Capacitor${NC}"
    exit 1
fi

# 5. Build Android Bundle (AAB)
echo -e "${YELLOW}📱 Generant Android App Bundle (AAB)...${NC}"
cd android
./gradlew bundleRelease

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error generant AAB${NC}"
    cd ..
    exit 1
fi

cd ..

# 6. Mostrar resultat
echo ""
echo -e "${GREEN}✅ Build completat amb èxit!${NC}"
echo ""
echo "📦 Fitxers generats:"
echo "   AAB: android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "📋 Properes passes:"
echo "   1. Puja el fitxer AAB a Google Play Console"
echo "   2. Completa la informació de la fitxa de Play Store"
echo "   3. Envia per revisió"
echo ""
echo -e "${YELLOW}⚠️  Recordatori:${NC}"
echo "   - Incrementa versionCode i versionName abans del proper build"
echo "   - Guarda el keystore de forma segura"
echo ""
