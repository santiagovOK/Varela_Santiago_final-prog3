#!/bin/bash

# TPI: Este script lanza simultáneamente el frontend y el backend usando concurrently.
npx --yes concurrently -n "VITE,GRADLE" -c "bgGreen.bold,bgBlue.bold" \
  "npm run dev --prefix foodstore-frontend" \
  "cd foodstore-backend && ./gradlew bootRun"
