# Validación necesaria para la demostración en el video explicativo

El siguiente flujo cubre los requisitos obligatorios para la demostración en video, garantizando que se recorra tanto la perspectiva del cliente como la del administrador.

### 1. Flujo del Cliente
*   **Registro de Usuario (HU-006):**
    *   Navegar a la vista de Registro (`/pages/auth/registro/registro.html`).
    *   Completar el formulario con datos válidos (nombre, apellido, celular, email nuevo, contraseña).
    *   Verificar que se muestre el alert de éxito y redirija automáticamente al Login.
*   **Inicio de Sesión y Navegación (HU-012):**
    *   Iniciar sesión con el usuario recién creado.
    *   Navegar por la página principal (`index.html`) y observar el catálogo de productos cargados dinámicamente desde la base de datos.
*   **Uso del Carrito y Confirmación de Pedido (HU-017):**
    *   Agregar distintos productos al carrito utilizando los botones correspondientes.
    *   Abrir el modal del carrito, verificar que el cálculo del total sea correcto.
    *   Hacer clic en "Confirmar Pedido".
    *   Verificar el mensaje de éxito y comprobar que el carrito se haya vaciado.

### 2. Flujo del Administrador
*   **Autenticación Administrativa:**
    *   Cerrar sesión desde el navbar del cliente.
    *   Iniciar sesión con las credenciales maestras (`admin@admin.com` / `123456`).
    *   Verificar la redirección automática al Dashboard Administrativo (`/admin/home`).
*   **Gestión del Catálogo (HU-011, HU-015):**
    *   Navegar a la sección de **Productos**.
    *   Hacer clic en "Nuevo Producto", completar el formulario (asignándole una categoría existente) y guardar.
    *   Seleccionar un producto existente, hacer clic en "Editar", cambiar su precio o stock y guardar. Verificar que la tabla se actualice.
*   **Actualización de Estados de Pedidos (HU-018, HU-021):**
    *   Navegar a la sección de **Pedidos**.
    *   Localizar el pedido creado anteriormente por el cliente (debe aparecer primero por orden cronológico).
    *   Hacer clic en "Cambiar Estado" y pasarlo de `PENDIENTE` a `CONFIRMADO` (o `TERMINADO`).
    *   Verificar que el *badge* visual del estado cambie correctamente de color y texto en la tabla.

---

# Validación general a partir de las HU

A continuación se detalla cómo validar el resto de las Historias de Usuario que componen la totalidad del proyecto.

### EP-01: Gestión de Categorías
*   **HU-001 (Crear Categoría):** En `/admin/categories`, abrir el modal de creación, ingresar un nombre y descripción, y guardar.
*   **HU-002 (Listar Categorías):** Verificar que la tabla en `/admin/categories` muestre todas las categorías activas.
*   **HU-004 (Actualizar Categoría):** Usar el botón "Editar" en una fila de la tabla, modificar los datos y guardar.
*   **HU-005 (Eliminar Categoría):** Usar el botón "Eliminar" y confirmar el *prompt*. Verificar que la categoría desaparezca de la vista (Soft Delete).

### EP-02: Gestión de Usuarios
*   **HU-006 (Registrar Usuario):** Validado en el flujo del video.
*   **HU-007 / HU-008 / HU-009 / HU-010 (Listar, Obtener, Editar, Eliminar):** Dado que el proyecto priorizó la UI de productos y pedidos, la gestión de ABM de usuarios se valida directamente desde la API.
    *   Abrir **Swagger UI** (`http://localhost:8080/swagger-ui/index.html`).
    *   Ejecutar el endpoint `GET /api/usuarios` para listar.
    *   Ejecutar `PUT /api/usuarios/{id}` y `DELETE /api/usuarios/{id}` para probar la actualización y el soft delete.

### EP-03: Gestión de Productos
*   **HU-011 a HU-016 (CRUD Completo de Productos):** Todo el ciclo de vida del producto está integrado y es operable desde `/admin/products`. Validado en gran parte durante el flujo del video. Se puede probar el Soft Delete eliminando un producto y verificando que ya no aparezca en el `index.html` del cliente.

### EP-04: Gestión de Pedidos
*   **HU-017 (Crear Pedido):** Validado desde el carrito de compras del cliente.
*   **HU-018 (Listar Pedidos):** Validado en la tabla de `/admin/orders`.
*   **HU-019 (Obtener Pedido con Detalles):** Validado al hacer clic en el botón "Ver Detalles" en la tabla de pedidos, el cual abre un modal con la sub-tabla de los productos comprados.
*   **HU-021 (Actualizar Estado):** Validado en el flujo del video mediante el botón "Cambiar Estado".

### EP-05: Infraestructura y Arquitectura
*   **HU-023 / HU-024 (Entidad y Repositorio Base):** Validable a nivel código en el backend. Todas las entidades heredan el campo `eliminado` para el Soft Delete.
*   **HU-025 (Manejo Global de Excepciones):** 
    *   **Validación:** En Swagger UI, intentar hacer un `POST /api/categorias` mandando un cuerpo JSON vacío `{}`.
    *   **Resultado Esperado:** En lugar de crashear el servidor o devolver un stacktrace de Java (Error 500), la API debe devolver un JSON controlado con código HTTP `400 Bad Request`, indicando qué campos fallaron las validaciones de Jakarta (ej. "nombre no puede estar vacío").
*   **Documentación OpenAPI (Swagger):** Navegar a `http://localhost:8080/swagger-ui/index.html` y verificar que la interfaz de documentación cargue correctamente sin errores, mostrando todos los controladores.