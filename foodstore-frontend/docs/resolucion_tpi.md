# Resolución TPI - Cambios y Decisiones Técnicas

Este documento detalla las decisiones de diseño y ajustes realizados durante el desarrollo del frontend para resolver incongruencias entre los requisitos visuales (maquetas), la API del backend y las reglas de negocio (consignas).

## Modificaciones al Registro de Usuarios

- **Épica:** EP-02 – Gestión de Usuarios
- **Sprint:** Sprint 1 (Autenticación y Usuarios)
- **Historia de Usuario:** Registro / Creación de cuenta de usuario

**Problema:**
La maqueta visual de registro (`register_template.png`) solo requería los campos *Nombre*, *Email* y *Contraseña*. Sin embargo, el backend exige de manera estricta el campo `apellido` (`@NotBlank` en el DTO `UsuarioCreate`), y contempla un campo opcional `celular`. A su vez, si bien las consignas mencionan "Gestión de perfil", no existe una pantalla planificada de "Mi Perfil" donde el usuario pueda cargar estos datos faltantes a posteriori.

**Solución implementada:**
Se priorizó el funcionamiento de la API adaptando el formulario de registro en el frontend (`registro.html` y `registro.ts`) para incluir el campo obligatorio **Apellido** y el campo opcional **Celular**. La interfaz `IUser.ts` también fue actualizada para reflejar estas propiedades. Esto previene errores 400 Bad Request por parte del servidor y garantiza la consistencia de los datos del cliente desde el momento de la creación de la cuenta.

---

## Modificaciones al Checkout (Carrito)

- **Épica:** EP-04 – Gestión de Pedidos
- **Sprint:** Sprint 2 (Catálogo y Compra)
- **Historia de Usuario:** Confirmación de pedido (Checkout)

**Problema:**
Se requería mostrar los datos de contacto y envío al momento de finalizar la compra. Sin embargo, ni la entidad `Pedido` ni su DTO `PedidoCreate` en el backend contemplan almacenar un teléfono específico o una dirección de entrega para la orden (el backend asume que el contacto es el del usuario).

**Solución implementada:**
Se agregaron de manera visual al resumen de compra en `cart.html` las filas de **Dirección** (con un valor predeterminado/placeholder temporal *"Mi Dirección 1234"*) y **Teléfono**. A través de la lógica en `cart.ts`, se lee la sesión actual del usuario (desde localStorage) y se inyecta dinámicamente su `celular` registrado. Si el usuario omitió este campo en el registro, la vista muestra "No especificado". Esto unifica la experiencia visual sin necesidad de alterar el esquema de base de datos del backend.

---

## Corrección de Tipado y CORS en el Catálogo

- **Épica:** EP-03 – Gestión de Productos
- **Sprint:** Sprint 2 (Catálogo y Compra)
- **Historia de Usuario:** Visualización del catálogo de productos

**Problema:**
Al cargar el catálogo (`home.html`), los productos no se renderizaban y la consola mostraba un error `400 Bad Request` al consultar `/api/categorias`. Esto se debía a dos factores:
1. **Frontend:** El frontend esperaba un array de categorías (`categorias: ICategory[]`), mientras que el DTO del backend enviaba un único objeto bajo el nombre `categoriaDto` por la relación `@ManyToOne`.
2. **Backend:** El controlador `CategoriaController` tenía la anotación `@CrossOrigin("*")`, la cual entraba en conflicto con la configuración global de CORS en `WebConfig.java` (que permitía credenciales). Spring Boot prohíbe usar el comodín `*` cuando las credenciales están activadas, lanzando un error interno que el `AdviceController` convertía en `400 Bad Request`.

**Solución implementada:**
1. **En Frontend:** Se actualizó la interfaz de TypeScript (`Product`) a `categoriaDto?: ICategory` y se ajustaron los archivos `home.ts` y `cart.ts` para que lean correctamente la propiedad en formato singular. Adicionalmente, se borró la carpeta de datos de prueba local (`src/data/`) para forzar la lectura real.
2. **En Backend:** Se eliminó la anotación `@CrossOrigin("*")` conflictiva en `CategoriaController`, unificando el manejo de CORS desde la clase `WebConfig`.
