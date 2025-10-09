# Script per generar build de producció per Google Play Store
# Ús: .\build-release.ps1

Write-Host "🍄 Mushroom Finder - Build de Producció" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estem al directori correcte
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Executa aquest script des del directori arrel del projecte" -ForegroundColor Red
    exit 1
}

# 1. Clean
Write-Host "🧹 Netejant builds anteriors..." -ForegroundColor Yellow
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "android\app\build" -Recurse -Force -ErrorAction SilentlyContinue

# 2. Install dependencies
Write-Host "📦 Instal·lant dependències..." -ForegroundColor Yellow
npm install

# 3. Build web
Write-Host "🔨 Compilant aplicació web..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el build web" -ForegroundColor Red
    exit 1
}

# 4. Sync Capacitor
Write-Host "🔄 Sincronitzant amb Capacitor..." -ForegroundColor Yellow
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error sincronitzant amb Capacitor" -ForegroundColor Red
    exit 1
}

# 5. Build Android Bundle (AAB)
Write-Host "📱 Generant Android App Bundle (AAB)..." -ForegroundColor Yellow
Set-Location android
if ($IsWindows -or $env:OS -eq "Windows_NT") {
    .\gradlew.bat bundleRelease
} else {
    ./gradlew bundleRelease
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error generant AAB" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

# 6. Mostrar resultat
Write-Host ""
Write-Host "✅ Build completat amb èxit!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Fitxers generats:" -ForegroundColor Cyan
Write-Host "   AAB: android\app\build\outputs\bundle\release\app-release.aab"
Write-Host ""
Write-Host "📋 Properes passes:" -ForegroundColor Cyan
Write-Host "   1. Puja el fitxer AAB a Google Play Console"
Write-Host "   2. Completa la informació de la fitxa de Play Store"
Write-Host "   3. Envia per revisió"
Write-Host ""
Write-Host "⚠️  Recordatori:" -ForegroundColor Yellow
Write-Host "   - Incrementa versionCode i versionName abans del proper build"
Write-Host "   - Guarda el keystore de forma segura"
Write-Host ""
