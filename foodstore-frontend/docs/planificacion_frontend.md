# Planificación del Trabajo Práctico Integrador (Food Store)

Este documento detalla el plan paso a paso para completar el TPI en base a las `consignas_tpi.md` y al estado actual de las carpetas `foodstore-frontend` y `foodstore-backend`.

El estado inicial de ambas partes del proyecto provienen de sus repositorios base. Por un lado, `foodstore-frontend` está igual a cómo quedó luego de lo solicitado en el primer parcial, por lo que partiré de allí para completar el TPI. `foodstore-backend`, por otro lado, corresponde al estado del backend hasta parte de lo que realicé para el TP10 - API Rest y Spring Boot.

## Análisis del Estado Actual

**Frontend (Vite + Vanilla TS/HTML):** Se encuentra una configuración inicial (bundler Vite) con algunas páginas creadas (login, registro, home, cart), pero faltan las vistas críticas para el administrador y cliente, además de toda la lógica de consumo de API (fetch) y manejo de estado en el cliente (localStorage).

---

## Frontend (Vite + TypeScript + Vanilla DOM)

### Paso 1: Configuración Estructural y Enrutamiento
- **Crear las carpetas faltantes en `src/pages/`:**
  - `admin/categories` (CRUD Categorías)
  - `admin/products` (CRUD Productos)
  - `admin/orders` (Gestión de Pedidos)
  - `store/productDetail` (Detalle del Producto)
  - `client/orders` (Historial de mis pedidos)
- **Actualizar `vite.config.ts`:** Añadir las nuevas páginas en `build.rollupOptions.input` para que Vite las reconozca al compilar.

### Paso 2: Módulo de Autenticación y Seguridad
- **Registro (`pages/auth/registro`):**
  - **UI/CSS:** Estilizar el formulario de registro (`registro.html`) replicando la estética del proyecto.
  - **Lógica:** Implementar `fetch` a `/api/usuarios/register`, validar campos y auto-loguear al usuario.
- **Login (`pages/auth/login`):**
  - **Lógica:** Implementar `fetch` a `/api/usuarios/login` y persistir la sesión en `localStorage`.
- **Protección de Rutas (Guard):**
  - Mantener la función central en `main.ts` y redirigir correctamente según el rol (`ADMIN` a `/admin/home` y `USUARIO` a `/client/home`).

### Paso 3: Módulo Cliente - Catálogo y Carrito (Desarrollo UI y Lógica)
- **Home de Tienda (`store/home`):**
  - **UI/CSS:** Desarrollar la maqueta HTML/CSS para el catálogo, el sidebar y los filtros.
  - **Lógica:** Hacer GET a `/api/categorias` y `/api/productos`. Renderizar dinámicamente las cards.
- **Detalle de Producto (`store/productDetail`):**
  - **UI/CSS:** Diseñar la vista de detalle del producto.
  - **Lógica:** Leer el ID de la URL y hacer GET específico. Botón "Agregar al carrito" con validación de stock.
- **Carrito de Compras (`store/cart`):**
  - **UI/CSS:** Maquetar la tabla de productos, modal de checkout y resumen de compra.
  - **Lógica:** Operar el `localStorage`, validar stock, y hacer POST a `/api/pedidos` al confirmar la compra.

### Paso 4: Módulo Cliente - Mis Pedidos (Desarrollo UI y Lógica)
- **Mis Pedidos (`client/orders`):**
  - **UI/CSS:** Diseñar la vista de tarjetas de historial de compras y el modal de detalle del pedido.
  - **Lógica:** Hacer GET a `/api/pedidos/usuario/{id}`. Renderizar estados, productos y cálculos totales.

### Paso 5: Panel de Administración (Desarrollo UI y Lógica)
- **Dashboard Admin (`admin/home`):**
  - **UI/CSS & Lógica:** Renderizar tarjetas con contadores estadísticos de la BD.
- **Categorías (`admin/categories`):**
  - **UI/CSS & Lógica:** Diseñar tabla y modales. Implementar CRUD consumiendo la API.
- **Productos (`admin/products`):**
  - **UI/CSS & Lógica:** Diseñar tabla y modales. Implementar CRUD con `<select>` de categorías.
- **Gestión de Pedidos (`admin/orders`):**
  - **UI/CSS & Lógica:** Visualizar TODOS los pedidos. Implementar `<select>` para que el admin cambie el estado mediante PATCH.

---

## Estructura del Proyecto (Estado Actual vs. Faltantes)

A continuación, se detalla la estructura principal del proyecto, remarcando **qué archivos/directorios faltan (FALTANTE)** y cuáles **requieren modificaciones críticas (MODIFICAR)** para cumplir con los requerimientos.

### Frontend (`foodstore-frontend/`)

```text
├── vite.config.ts                     <-- (MODIFICAR) Agregar los entry points de los directorios HTML faltantes.
└── src/
    ├── main.ts
    ├── styles.css                     <-- (MODIFICAR) Incorporar tokens de diseño (variables CSS, paleta de colores, glassmorphism).
    ├── utils/
    │   └── auth.ts                    <-- (FALTANTE) Funciones utilitarias para validación de sesión activa y permisos según el rol.
    └── pages/
        ├── auth/
        │   ├── login/                 <-- (MODIFICAR) Conectar fetch a /api/usuarios/login y persistir sesión en localStorage.
        │   └── registro/              <-- (MODIFICAR) Conectar fetch a /api/usuarios/register y validar form.
        ├── store/
        │   ├── home/                  <-- (MODIFICAR) Fetch dinámico de /api/productos y /api/categorias. Generar cards en el DOM.
        │   ├── cart/                  <-- (MODIFICAR) Lógica de carrito desde localStorage y posterior POST a /api/pedidos.
        │   └── productDetail/         <-- (FALTANTE) Pantalla nueva: Mostrar información detallada, control de stock y botón "Añadir a carrito".
        ├── client/
        │   ├── home/                  <-- (MODIFICAR) Estructurar el panel base del cliente o redirigir apropiadamente.
        │   └── orders/                <-- (FALTANTE) Pantalla nueva: Tabla con historial de compras del usuario y detalle de cada pedido.
        └── admin/
            ├── home/                  <-- (MODIFICAR) Traer estadísticas y mostrar accesos a las distintas áreas.
            ├── categories/            <-- (FALTANTE) Pantalla nueva: Administrar categorías (CRUD con fetch a la API).
            ├── products/              <-- (FALTANTE) Pantalla nueva: Administrar productos (CRUD con selector dinámico de categoría).
            └── orders/                <-- (FALTANTE) Pantalla nueva: Visualizar lista maestra de pedidos y selector para cambio de estado.
```
---

## Flujo de redirección solicitado

El sistema de redirección del Frontend funciona como un control de acceso de dos niveles para asegurar que las áreas de la aplicación respeten los roles definidos en las consignas (`ADMIN` y `USUARIO`):

1. **Momento del Login (Distribución inicial):**
   - Al enviar el formulario exitosamente a `/api/usuarios/login`, el backend responde con los datos del usuario, incluyendo su `rol`.
   - El script `login.ts` almacena esta sesión de manera local y redirige al usuario según corresponda:
     - Si el rol es `ADMIN`, redirige al panel administrativo: `/src/pages/admin/home/home.html`.
     - Si el rol es `USUARIO`, redirige a la vista principal de la tienda/cliente: `/src/pages/client/home/home.html`.

2. **Route Guard o Protección de Rutas (Seguridad continua):**
   - El archivo central `main.ts` ejecuta una matriz de seguridad (`runRouteGuard`) en cada recarga de página.
   - Detecta si la ruta actual (pathname) pertenece a un prefijo protegido:
     - **Rutas `/admin/`:** Exigen estrictamente el rol `ADMIN`. Si un `USUARIO` intenta ingresar a estas rutas manipulando la URL manualmente, el guardián bloquea el acceso y lo redirige hacia su inicio (`/src/pages/client/home/home.html`).
     - **Rutas `/client/`:** Exigen el rol `USUARIO`. Si un `ADMIN` intenta acceder, es expulsado de regreso al dashboard de administración.
     - **Sesión ausente:** Si cualquier usuario que no haya iniciado sesión intenta entrar a una zona protegida, es redirigido obligatoriamente a `/src/pages/auth/login/login.html`.

Este flujo garantiza una separación rigurosa entre el catálogo comercial y el panel de administración, delegando el control de vistas de forma robusta y cumpliendo con las especificaciones del TPI.