#!/bin/bash

# TPI: Versión esperada de Node.js (cambiar si se necesita otra)
EXPECTED_NODE_VERSION="24"

# TPI: Cargar NVM si existe y usar/instalar la versión correcta de Node
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh"
  # Instala la versión si no la tiene y la usa
  nvm install $EXPECTED_NODE_VERSION
  nvm use $EXPECTED_NODE_VERSION
else
  echo "NVM no está instalado. No se pudo verificar ni actualizar automáticamente la versión de Node."
fi

# TPI: Verificar e instalar dependencias del frontend
if [ -d "foodstore-frontend/node_modules" ]; then
  # TPI: Verificar si la instalación actual es válida probando si Vite se ejecuta sin errores
  if ! (cd foodstore-frontend && ./node_modules/.bin/vite --version &> /dev/null); then
    echo "Instalación corrupta o dependencias de otro SO detectadas. Reinstalando frontend..."
    (cd foodstore-frontend && rm -rf node_modules package-lock.json && npm install)
  fi
else
  echo "Dependencias no encontradas. Instalando dependencias del frontend..."
  (cd foodstore-frontend && npm install)
fi

# TPI: Verificar permisos del backend (Gradle Wrapper)
if [ -f "foodstore-backend/gradlew" ]; then
  chmod +x foodstore-backend/gradlew
fi

# TPI: Verificar si Java está instalado
if ! command -v java &> /dev/null; then
  echo "ERROR: Java (JDK) no parece estar instalado en este equipo."
  echo "El backend de Spring Boot necesita Java para compilar y ejecutarse. Por favor, instálalo y vuelve a intentar."
  exit 1
fi

# TPI: Este script lanza simultáneamente el frontend y el backend usando concurrently.
npx --yes concurrently -n "VITE,GRADLE" -c "bgGreen.bold,bgBlue.bold" \
  "cd foodstore-frontend && npm run dev" \
  "cd foodstore-backend && ./gradlew bootRun"
