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
- **Login y Registro (`pages/auth`):**
  - Implementar las llamadas fetch a `/api/usuarios/login` y `/api/usuarios/register`.
  - Guardar la respuesta (ID usuario, nombre, email, rol) en el `localStorage`.
- **Protección de Rutas (Frontend):**
  - Crear una función de utilidad en `utils/auth.ts` que valide si hay sesión. 
  - En los scripts de `admin/`, verificar que `rol === 'ADMIN'`. Si no lo es, redirigir a login.

### Paso 3: Módulo Cliente - Catálogo y Carrito
- **Home de Tienda (`store/home`):**
  - Hacer GET a `/api/categorias` y `/api/productos`.
  - Renderizar dinámicamente las cards mediante manipulación del DOM.
  - Implementar lógica de búsqueda y filtrado por categoría o texto.
- **Detalle de Producto (`store/productDetail`):**
  - Leer el ID del producto desde la URL. Hacer GET de ese producto específico.
  - Validar disponibilidad y stock para habilitar el botón de "Agregar al carrito".
- **Carrito de Compras (`store/cart`):**
  - Lógica persistente: Guardar y leer el arreglo de ítems en el `localStorage`.
  - Interfaz para sumar/restar cantidades validando el stock.
  - Botón "Confirmar Compra" que tome el carrito, el ID del usuario en sesión y arme el payload para enviar un `POST /api/pedidos`.
  - Limpiar el carrito local tras un éxito.

### Paso 4: Módulo Cliente - Mis Pedidos
- **Mis Pedidos (`client/orders`):**
  - Obtener los pedidos asociados al usuario en sesión (`GET /api/pedidos/usuario/{id}`).
  - Renderizar una lista con el estado de cada pedido y el desglose de productos/costos (implementar un Modal nativo HTML/CSS).

### Paso 5: Panel de Administración (Admin)
- **Dashboard Admin (`admin/home`):** Renderizar contadores (total de productos, pedidos pendientes, etc.).
- **Categorías (`admin/categories`):**
  - Tabla que consuma `/api/categorias`.
  - Modales para formulario de Creación y Edición (`POST` y `PUT`).
  - Lógica para "Eliminar" usando el endpoint de baja lógica.
- **Productos (`admin/products`):**
  - Similar a categorías, pero en el formulario incluir un `<select>` populado con las categorías reales desde el backend.
- **Gestión de Pedidos (`admin/orders`):**
  - Obtener TODOS los pedidos. Renderizar tabla/listado.
  - Agregar un `<select>` a cada fila que permita al administrador cambiar el estado del pedido mediante `PATCH /api/pedidos/{id}/status`.

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
