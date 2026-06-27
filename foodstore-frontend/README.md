
# Trabajo Final Integrador - Sección Frontend del Food Store (HTML - CSS - TypeScript)

✨ Estudiante

- Nombre: Varela, Santiago Octavio
- Comisión: M25 C3-13
- Email institucional: santiago.varela@tupad.utn.edu.ar

---
## Ejecución Concurrente (Frontend + Backend)

Requisitos previos:

- Node.js (versión 18 o superior recomendada).

Para facilitar el desarrollo, se ha incorporado la dependencia `concurrently` (ver en package.json). Así, es posible levantar tanto el servidor de **Vite** (Frontend) como el de **Spring Boot** (Backend) ejecutando un solo comando desde este directorio (`foodstore-frontend`):

```bash
npm run dev:all
```

> **Nota:** Esto asume que el backend está ubicado en `../foodstore-backend` respecto a este repositorio y que Java/Gradle está instalado.

> **Aclaración sobre compilación:** No es necesario ejecutar `npm run build` o `pnpm build` antes de este comando. `dev:all` levanta el servidor de desarrollo de Vite, el cual compila el código al vuelo y se comunica en tiempo real con el backend de Spring Boot a través del proxy. `build` se reserva estrictamente para cuando se busca compilar el proyecto para Producción.

## Ejecución manual (Por separado)

Si preferís levantar el frontend por su cuenta sin usar los comandos unificados, seguí estos pasos:

### Requisitos previos:
- Node.js (versión 18 o superior recomendada).

### Pasos:

1. Ubicate en esta carpeta (`foodstore-frontend`).
2. Instalá las dependencias (solo la primera vez):

```bash
npm install
```

3. Levantá el entorno de desarrollo de Vite:

```bash
npm run dev
```

> **Importante:** Para que el frontend pueda consumir los datos (Catálogo, Carrito, etc.), recordá que debés tener el backend de Spring Boot corriendo simultáneamente en otra terminal, por defecto en el puerto `8080`.

4. Hacer el build (Opcional, para Producción, aunque es mala práctica dado que hay cuestiones de seguridad no aptas para producción en este proyecto)

```bash
npm run build
```
Esto generará de manera exitosa el directorio `dist/` con las páginas registradas en `vite.config.ts` y todos los recursos optimizados.
