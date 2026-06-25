El estado inicial de ambas partes del proyecto provienen de sus repositorios base. Por un lado, `foodstore-frontend` está igual a cómo quedó luego de lo solicitado en el primer parcial, por lo que partiré de allí para completar el TPI. `foodstore-backend`, por otro lado, corresponde al estado del backend hasta parte de lo que realicé para el TP10 - API Rest y Spring Boot.

---

## Cambios Realizados a partir de las consignas del trabajo práctico integrador:

Teniendo en cuenta el punto de partida y la visión integral que propone el trabajo práctico integrador sobre los trabajos base mencionados, se realizaron los siguientes cambios, teniendo en cuenta también las épicas, sprints y historias de usuario:

## Backend 

### 1. Implementación de Soft Delete (Baja Lógica)

- **Épica:** EP-01 (Gestión de Categorías) y EP-03 (Gestión de Productos).
- **Sprint:** Sprint 1 (Fundamentos) y Sprint 2 (Usuarios y Productos).
- **Historias de Usuario:** Historias relacionadas a la eliminación o borrado de categorías y productos sin afectar el historial o la integridad referencial.

- **Clases Modificadas:**
  - `CategoriaRepository` y `ProductoRepository`: Se agregaron los métodos `findByEliminadoFalse()` y `findByIdAndEliminadoFalse(id)`.
  - `CategoriaServiceImpl` y `ProductoServiceImp`: Se modificaron los métodos `findAll()` y `findById()` para que consuman las nuevas queries de los repositorios, evitando retornar entidades con `eliminado = true`. La lógica de asignación `.setEliminado(true)` ya se encontraba soportada gracias a la clase abstracta heredada `Base`.

    ¿Por qué?                                                                                     
  Para cumplir de forma integral con el concepto de "Soft Delete", no solo necesitamos cambiar  
  el estado de la entidad a eliminado, sino asegurarnos de que la aplicación filtre estos       
  registros automáticamente en cualquier consulta (GET o PUT) que se haga desde la API, para que
  sea invisible al frontend sin perder los datos en la base de datos.

### 2. Validaciones de DTOs y Controladores

- **Épica:** EP-01 (Categorías), EP-02 (Usuarios), EP-03 (Productos).
- **Sprint:** Sprint 1 y Sprint 2.
- **Historias de Usuario:** Historias de creación y edición (Create/Update) donde se exige que la información persista de manera consistente y sin campos inválidos o nulos.
- **Clases Modificadas:**
  - `build.gradle`: Se incorporó la dependencia `spring-boot-starter-validation`.
  - **DTOs**: `CategoriaCreate`, `ProductoCreate` y `UsuarioCreate`. Se añadieron anotaciones de validación como `@NotBlank`, `@NotNull`, `@Min` y `@Email`.
  - **Controllers**: `CategoriaController`, `ProductoController` y `UsuarioController`. Se aplicó la anotación `@Valid` a los métodos POST de creación (`create()`) garantizando que los datos sean validados antes de procesar la petición.

#### ¿Por qué?                                                                                     
    Si el frontend envía un JSON con campos en blanco, precios negativos o campos faltantes porque la validación previa falla o es inexistente, la aplicación arrojaría errores internos que no son fáciles de comprender. Gracias a las anotaciones y a  @Valid , Spring Boot intercepta la petición inválida y la rechaza antes de que siquiera llegue al Service, protegiendo así la integridad de la base de datos de acuerdo a las reglas de negocio. 

### 3. Autenticación Educativa y Seguridad (SHA-256)

- **Épica:** EP-02 (Gestión de Usuarios).
- **Sprint:** Sprint 2 (Usuarios y Productos).
- **Historias de Usuario:** "Login de Usuario" y "Registro de Usuario", que exigen que el sistema valide credenciales de manera segura para diferenciar roles (ADMIN / USUARIO).
- **Clases Modificadas y Creadas:**
  - `UsuarioServiceImp`: Se incorporó un método privado `hashPassword()` utilizando `MessageDigest` (SHA-256) para encriptar la contraseña en texto plano. Se actualizaron los métodos `save()` y `update()` para aplicar este cifrado, y se implementó el método `login()` que verifica las credenciales encriptadas.
  - `UsuarioController`: Se añadió el endpoint `POST /api/usuarios/login`.
  - `UsuarioLogin.java` (Nueva): Se creó un DTO específico para manejar de forma segura y validada las credenciales de entrada.
  - `UsuarioService` (Interfaz): Se definió la firma del método `login`.

#### ¿Por qué?                                                                                     
Guardar contraseñas en texto plano es una vulnerabilidad grave, más allá de que esto es exigido en las consignas del trabajo práctico. Aplicar el hash SHA-256   asegura que ni siquiera teniendo acceso a la base de datos se puedan ver las contraseñas reales. Además, disponer de un endpoint de login devuelve el DTO del usuario autenticado si es válido, que es lo que el frontend va a usar para persistir su sesión y saber qué rol tiene el que acaba de entrar.

### 4. Gestión de Pedidos y Control de Stock

- **Épica:** EP-04 (Gestión de Pedidos)
- **Sprint:** Sprint 3 (Pedidos)
- **Historias de Usuario:** "Creación de Pedido", "Visualización de Historial de Pedidos" y "Gestión de Estados de Pedido".
- **Clases Modificadas y Creadas:**
  - `PedidoServiceImp`: Se incorporó lógica en el método `save()` para verificar el stock de los productos. Si no hay cantidad suficiente, se arroja un `IllegalArgumentException`. Si el pedido se efectúa, el stock se descuenta correspondientemente. Además, se añadió la obtención de pedidos específicos por ID del cliente (`findByUsuarioId`) y un método de actualización de estados (`updateStatus`).
  - `PedidoController`: Se agregaron los endpoints `GET /api/pedidos/usuario/{id}` para el historial del usuario, y el parcial `PATCH /api/pedidos/{id}/status` para que el Admin progrese el estado del pedido.
  - `PedidoStatusEdit` (Nueva): DTO exclusivo para mapear y validar el nuevo estado proveniente del frontend en las peticiones PATCH.
  - `Usuario`, `Pedido`, `PedidoDto` y `PedidoCreate`: Se corrigieron las relaciones acorde al diagrama UML sugerido. Se dispuso de una relación unidireccional mapeada con `@OneToMany` del lado de la entidad `Usuario`, suprimiendo la bidireccionalidad. La lógica de creación ahora persiste el pedido atado a ese usuario sin romper el modelo.

#### ¿Por qué?
El control de stock y cálculo de precios a nivel backend (resuelto mediante la interfaz `Calculable` implementada en `Pedido`) evita que se generen ventas fantasma o que ciertas peticiones manipulen los montos a pagar desde el cliente. Por su parte, la separación y actualización de la estructura de base de datos entre `Usuario` y `Pedido` obedece de manera estricta al diseño propuesto en el UML (el diagrama asume que un Usuario es dueño de sus pedidos, pero el pedido no necesita saber quién es su emisor en su estructura intrínseca dentro del código Java). Por otro lado, la utilización de `IllegalArgumentException` asegura la detención del proceso de compra de forma genérica, logrando un control de fallos básico.

### 5. Refinamiento Arquitectónico y Excepciones

- **Épica:** EP-05 (Infraestructura y Arquitectura).
- **Historias de Usuario:** "Manejo de Errores Global" y "Configuración de CORS".
- **Clases Modificadas y Creadas:**
  - `AdviceController`: Se incorporó un `@ExceptionHandler` para `MethodArgumentNotValidException`, permitiendo interceptar de manera global los fallos de validación provenientes de los DTOs (`@Valid`). Esto genera una respuesta JSON limpia mapeando cada campo con su error, retornando un estado `400 Bad Request`.
  - `WebConfig` (Nueva): Se creó una clase de configuración que implementa `WebMvcConfigurer` para habilitar CORS (Cross-Origin Resource Sharing) de forma global y centralizada, sin tener que hacerlo en cada uno de los controladores. Esto habilita las solicitudes provenientes del puerto 5173 (puerto local por defecto de Vite).

#### ¿Por qué?
Centralizar las excepciones en `AdviceController` simplifica los controladores y servicios, evitando repetitivos bloques `try-catch` y logrando respuestas estandarizadas que el frontend puede procesar fácilmente. Al aprovechar excepciones de Java nativas y genéricas (como `IllegalArgumentException` o `NullPointerException`) y de Spring, se logra un flujo consistente y  vinculado a la especificación sin llevar el proyecto de clases innecesarias. Finalmente, la habilitación de CORS de manera centralizada es esencial en arquitecturas separadas (Frontend/Backend) para evitar que el navegador del cliente bloquee la petición por cuestiones de seguridad.

### 6. Correcciones Estructurales Post-Integración (Frontend-Backend)

- **Épica:** EP-02 (Gestión de Usuarios) y EP-04 (Gestión de Pedidos).
- **Sprint:** Sprint 4 (Integración y Refinamiento).
- **Historias de Usuario:** "Login de Usuario" y "Creación de Pedido".
- **Clases Modificadas:**
  - `UsuarioCreate`, `UsuarioLogin`, `UsuarioDto`, y `UsuarioController`: Luego de una revisión del comportamiento y el envío de datos desde el Frontend, se refactorizó el atributo `mail` para que pase a llamarse `email` en todos los DTOs. Esto mantiene estricta coherencia en la nomenclatura de las peticiones entre ambos ecosistemas, evitando errores de validación (`400 Bad Request`) durante el inicio de sesión.
  - `PedidoServiceImp`: Se agregó la anotación `@Transactional` a nivel clase para evitar el error `LazyInitializationException` generado durante la inicialización de los datos de prueba, asegurando que la transacción de BD se mantenga viva al vincular un nuevo pedido a las colecciones "Lazy" del `Usuario`.

#### ¿Por qué?
Durante el proceso de conexión real, la pequeña divergencia de nomenclatura entre el cliente web (`email`) y la API (`mail`) causaba rupturas de contrato en los DTOs; normalizar los nombres desde el Backend formaliza la estructura JSON que espera la aplicación. Esto fue así porque la nomenclatura había sido heredada desde los TPs/parcial que hicimos previamente en la asignatura. Por otro lado, la omisión de transaccionalidad al manipular entidades complejas provocaba la caída del servidor local, por lo que su agregado estabilizó permanentemente el arranque simultáneo de ambos proyectos.

### 7. Inicialización de Datos y Ajuste de Assets Estáticos

- **Épica:** EP-05 (Infraestructura y Arquitectura).
- **Sprint:** Sprint 4 (Integración y Refinamiento).
- **Historias de Usuario:** "Poblamiento Inicial de Datos" y "Manejo de Imágenes de Producto".
- **Clases Modificadas y Creadas:**
  - `DataInitializer`: Se utilizó esta clase que fue creada en los últimos TPs, que integra un componente con `@PostConstruct` encargado de poblar la base de datos H2 en memoria cada vez que inicia el servidor. Así, se inyectaron usuarios (Admin y Cliente), categorías, productos y pedidos pre-cargados a partir de los archivos de prueba.
  - `Producto.java`: Se amplió la capacidad de las columnas `imagen` y `descripcion` mediante `@Column(length = 1000)` para prevenir la excepción `JdbcSQLDataException: Value too long` (que provocaba la caída del backend con código 502 Bad Gateway) al insertar URLs extensas.
  - **Ajuste de Imágenes estáticas**: Se reemplazaron los links caídos de la API externa en el `DataInitializer` por referencias a archivos estáticos locales (`burger.webp` y `pizza.jpg`). Además, se migró la imagen `burger.webp` a la carpeta `public/images/` del frontend, garantizando que el navegador pueda solicitarlas correctamente al servidor de desarrollo de Vite sin depender del backend.

#### ¿Por qué?
Tener un set de datos de prueba robusto y automático acelera enormemente el desarrollo y las pruebas, evitando tener que cargar entidades manualmente en cada reinicio de la base de datos en memoria (H2). Asimismo, ampliar la longitud de las columnas `VARCHAR` en JPA previene cierres inesperados del servidor debido a la restricción estándar de 255 caracteres de Hibernate. Por último, servir los assets estáticos desde la carpeta pública del frontend asegura que el navegador acceda a las imágenes de manera rápida y directa, corrigiendo las imágenes rotas por caídas de servicios externos.

---

## Frontend

### 1. Configuración Estructural y Enrutamiento

- **Archivos Modificados y Creados:**
  - **Directorios y Vistas Nuevas:** Se crearon las carpetas, vistas HTML y scripts (`.ts`) para las rutas faltantes especificadas en la planificación:
    - `admin/categories` (`categories.html`, `categories.ts`)
    - `admin/products` (`products.html`, `products.ts`)
    - `admin/orders` (`orders.html`, `orders.ts`)
    - `store/productDetail` (`productDetail.html`, `productDetail.ts`)
    - `client/orders` (`orders.html`, `orders.ts`)
  - `vite.config.ts`: Se añadieron los nuevos puntos de entrada (entry points) (`adminCategories`, `adminProducts`, `adminOrders`, `productDetail`, `clientOrders`) dentro de la configuración `build.rollupOptions.input`.

#### ¿Por qué?
Establecer la estructura de directorios y registrar los puntos de entrada es lo básico en una aplicación empaquetada con Vite, más allá de que también las consignas solicitan crear esos directorios. Esto no solo organiza las responsabilidades de la interfaz (separando vistas de Administrador, Cliente y Tienda), sino que asegura que cuando se ejecuta la compilación para producción, Vite integre correctamente todos los archivos HTML y genere el ruteo básico de la aplicación web.

### 2. Módulo de Autenticación y Seguridad

- **Épica:** EP-02 (Gestión de Usuarios).
- **Sprint:** Sprint 2 (Usuarios y Productos).
- **Historias de Usuario:** "Login de Usuario", "Registro de Usuario" y "Protección de Rutas por Rol".
- **Archivos Modificados y Creados:**
  - `vite.config.ts`: Se configuró un proxy (`/api` a `http://localhost:8080`) para eludir restricciones de CORS en entorno de desarrollo.
  - `src/types/IUser.ts` y `Rol.ts`: Se adaptó la firma tipada de usuario (`rol: "USUARIO" | "ADMIN"`) para coincidir con la respuesta `UsuarioDto` proveniente del backend.
  - `src/utils/auth.ts`: Se refactorizó la función `checkAuhtUser` para consumir el usuario persistido en el `localStorage`, validar su existencia y confirmar que su rol coincida con el requerido.
  - `src/pages/auth/login/login.ts` y `registro/registro.ts`: Se reemplazó la validación mockeada por peticiones HTTP (`fetch`) hacia los endpoints reales de la API (`POST /api/usuarios/login` y `POST /api/usuarios`). El token o perfil devuelto se guarda exitosamente en el `localStorage`.
  - Vistas de `admin/` (`home.ts`, `categories.ts`, `products.ts`, `orders.ts`): Se insertó la invocación a `checkAuhtUser(..., "ADMIN")` en la parte superior para denegar el acceso a clientes regulares o usuarios no autenticados, expulsándolos hacia el login o al home correspondiente.

#### ¿Por qué?
Reemplazar el guardado mockeado en memoria por una integración real con la API permite que el sistema deje de ser una maqueta visual y pase a consumir e identificar registros persistentes en la base de datos. Por otro lado, la validación estricta de rutas de administración mediante la comparación del rol (`"ADMIN"`) garantiza una barrera de seguridad UX/UI, evitando que los clientes accedan y manipulen la gestión interna de la tienda web.

### 3. Módulo Cliente - Catálogo y Carrito

- **Épica:** EP-03 (Gestión de Productos) y EP-04 (Gestión de Pedidos).
- **Sprint:** Sprint 2 (Productos) y Sprint 3 (Pedidos).
- **Historias de Usuario:** "Visualización de Catálogo", "Detalle de Producto", "Gestión de Carrito de Compras" y "Confirmación de Compra / Creación de Pedido".
- **Archivos Modificados y Creados:**
  - `src/pages/store/home/home.ts` y `home.html`: Se eliminaron los datos mockeados y se integró un `fetch` hacia `/api/productos` y `/api/categorias`. Ahora el catálogo y los filtros de la tienda se renderizan dinámicamente según la base de datos real.
  - `src/pages/store/productDetail/productDetail.ts`, `productDetail.html` y `productDetail.css`: Se implementó completamente la vista de detalle leyendo el ID de la URL (`/api/productos/{id}`). Se añadió lógica de validación de stock y estilos modulares bajo la metodología BEM para evitar conflictos de CSS en el resto de la aplicación.
  - `src/pages/store/cart/cart.ts` y `cart.html`: El carrito ahora contrasta los IDs guardados en `localStorage` con un fetch a `/api/productos` para calcular los precios y subtotales reales. Se habilitó la selección de forma de pago y el botón de Checkout, que ejecuta un `POST /api/pedidos` tomando el `idUsuario` de la sesión actual.

#### ¿Por qué?
Migrar el catálogo estático a un consumo real de la API es uno de los puntos más importantes de la integración Frontend-Backend. Esto garantiza que los clientes siempre vean precios actualizados y productos con stock disponible real. Adicionalmente, verificar los precios haciendo un fetch a los productos desde el carrito de compras evita que un usuario malintencionado edite los precios a nivel `localStorage`. Finalmente, la estructuración de clases CSS usando BEM en nuevas vistas previenen que se rompan los estilos del resto de las páginas y mantienen una consistencia con el resto del CSS implementado.

### 4. Módulo Cliente - Mis Pedidos

- **Épica:** EP-04 (Gestión de Pedidos).
- **Sprint:** Sprint 3 (Pedidos).
- **Historias de Usuario:** "Visualización de Historial de Pedidos" y "Detalle del Pedido".
- **Archivos Modificados y Creados:**
  - `src/types/pedido.ts`: Se crearon los DTOs (`PedidoDto` y `DetallePedidoDto`) que tipifican el contrato con la API para reflejar de forma fidedigna lo enviado por el backend.
  - `src/pages/client/orders/orders.html` y `orders.css`: Se implementó un layout responsivo mediante Flexbox y metodología BEM, clonando la navegación principal de la tienda para mantener absoluta consistencia. Además, se desarrolló una ventana modal nativa (`<dialog>`) para renderizar el desglose de cada orden.
  - `src/pages/client/orders/orders.ts`: Se protegió la ruta exigiendo el rol `"USUARIO"` y se integró el endpoint `GET /api/pedidos/usuario/{id}`. La respuesta se mapea de más reciente a más antigua para generar "tarjetas" visuales del historial con su estado, gestionando además la apertura de los detalles dentro del Modal de manera fluida.
  - `src/styles.css`: Se centralizaron los colores de los estados semánticos (por ejemplo, `--color-status-pendiente-bg`) y demás colores directamente en el `:root` global del proyecto, evitando hardcodeo hexadecimal disperso en los componentes y previniendo la inyección de los mismos desde TypeScript.

#### ¿Por qué?
Permitirle a un cliente tener una trazabilidad simple de todas sus compras (con precios, fechas y formas de pago) es el flujo final necesario para que un e-commerce se vea confiable. El aprovechamiento de componentes nativos como el `<dialog>` para el modal garantiza robustez, mientras que la eliminación de colores hardcodeados (hex) fomenta un sistema de diseño desde una única fuente de verdad (`styles.css`, como lo vimos en la primera etapa de la cursada), lo que facilita en el futuro implementar económicamente un posible rediseño de ser necesario.

### 5. Panel de Administración - Dashboard

- **Épica:** EP-02 (Gestión de Usuarios) / EP-05 (Infraestructura y Arquitectura).
- **Sprint:** Sprint 2 - Usuarios y Productos (Semana 3-4).
- **Historias de Usuario:** "Visualización de Estadísticas del Sistema".
- **Archivos Modificados y Creados:**
  - `src/pages/admin/home/home.html` y `home.css`: Se implementó la vista principal del administrador siguiendo el diseño sugerido, utilizando Flexbox para la estructura de Navbar y Sidebar. Se aplicó la metodología BEM para el diseño de componentes.
  - `src/pages/admin/home/home.ts`: Se integró la protección de ruta y validación de permisos (`checkAuhtUser(..., "ADMIN")`). Se desarrolló lógica asíncrona concurrente (`Promise.all()`) para consumir 4 endpoints de la API (`/api/productos`, `/api/categorias`, `/api/pedidos`, `/api/usuarios`) y popular de forma dinámica los contadores estadísticos y la tabla resumen de últimos pedidos. Además, se empleó `import type` para las interfaces en TypeScript y así evitar errores de transpilación en Vite al resolver dependencias de tipos sin exportaciones en tiempo de ejecución.

#### ¿Por qué?
El Dashboard administrativo requiere una visualización limpia e inmediata del estado global de la tienda, de ahí la importancia de hacer llamadas asíncronas concurrentes; resolver las métricas al mismo tiempo minimiza el tiempo de carga total. Diseñar la estructura utilizando Flexbox y referenciando colores de CSS centralizados en el `:root` no solo permite alinear los componentes correctamente, sino que hace la UI completamente escalable y dota al proyecto de consistencia visual, permitiendo futuros cambios de branding únicamente modificando las variables base. Finalmente, la estricta utilización de tipado exportado (`import type`) evita cierres e inconsistencias del empaquetador Vite.

### 6. Panel de Administración - Gestión de Categorías

- **Épica:** EP-01 (Gestión de Categorías).
- **Sprint:** Sprint 1 - Fundamentos (Semana 1-2).
- **Historias de Usuario:** "Crear Categoría", "Editar Categoría", "Eliminar Categoría", y "Listar Categorías".
- **Archivos Modificados y Creados:**
  - `src/pages/admin/categories/categories.html` y `categories.css`: Se implementó un layout CRUD con Navbar, Sidebar y un panel principal que contiene una tabla de datos interactiva. Se diseñó una ventana modal nativa (`<dialog>`) para los formularios de creación/edición, reutilizando la lógica modular y colores del proyecto mediante variables de CSS.
  - `src/pages/admin/categories/categories.ts`: Se programó el ciclo completo de la interfaz CRUD consumiendo los endpoints del backend (`GET`, `POST`, `PUT`, `DELETE` sobre `/api/categorias`). Además, se implementó control de flujo con alertas para la confirmación al eliminar, y métricas de debug (`console.log` / `console.error`) integradas bajo bloques `try/catch` para cada operación asíncrona (facilitando la auditoría técnica desde las herramientas de desarrollo del navegador).

#### ¿Por qué?
Desarrollar el panel completo de categorías es el primer gran paso para darle control al Administrador de la plataforma, dotándolo de la capacidad de interactuar libremente con la base de datos sin depender de código crudo. La reutilización del layout base permite una experiencia consistente en toda la zona administrativa. El empleo de modales HTML5 nativos garantiza semántica, ligereza y accesibilidad superior a los frameworks de CSS, cumpliendo también con las consignas para este trabajo.

### 7. Panel de Administración - Gestión de Productos

- **Épica:** EP-03 (Gestión de Productos).
- **Sprint:** Sprint 2 - Usuarios y Productos (Semana 3-4).
- **Historias de Usuario:** "Crear Producto", "Editar Producto", "Eliminar Producto", y "Listar Productos".
- **Archivos Modificados y Creados:**
  - `src/pages/admin/products/products.html` y `products.css`: Se replicó la arquitectura de UI del listado de categorías, agregando una tabla más robusta con nuevas columnas (Imagen, Categoría, Precio, Stock, Estado) y badges/tags visuales para reflejar la disponibilidad (activo/inactivo). Se amplió el formulario del modal nativo para capturar todos los atributos del DTO `ProductoCreate`.
  - `src/pages/admin/products/products.ts`: Se integró el CRUD completo contra la API REST (`/api/productos`). Se usó `Promise.all()` para cargar concurrentemente tanto los productos como las categorías y poblar dinámicamente el `<select>` del formulario. También se homologó el enrutamiento de imágenes estáticas a través de una lógica coherente (para aquellas que están en public/images más que nada) y se persistió el uso del bloque `try/catch` con `console.log` preventivos de métricas.

#### ¿Por qué?
El módulo de Productos es una de las partes más importantes en la lógica transaccional del e-commerce. La concurrencia asincrónica de llamadas a la API es clave para que los selectores del formulario contengan información en tiempo real, garantizando la integridad de referencias cruzadas (Categoría-Producto).

### 8. Panel de Administración - Gestión de Pedidos y Ajustes de Sesión

- **Épica:** EP-04 (Gestión de Pedidos).
- **Sprint:** Sprint 3 - Pedidos (Semana 5-6).
- **Historias de Usuario:** "Modificar Estado de Pedido" y "Listar Pedidos".
- **Archivos Modificados y Creados:**
  - `src/pages/admin/orders/orders.html` y `orders.css`: Se diseñó la vista principal de la lista de pedidos siguiendo la convención de Flexbox empleada en los demás apartados (eliminando el uso de CSS Grid para estandarizar el diseño bajo un mismo modelo de caja). Se crearon *badges* estéticos para reflejar visualmente los distintos estados de un pedido. Se incorporó también un modal nativo de detalle que contiene la sub-tabla de ítems que integran la compra.
  - `src/pages/admin/orders/orders.ts`: Se implementó la lógica de consumo para `GET /api/pedidos` ordenando automáticamente de manera cronológica inversa (más recientes primero). Se configuró la actualización mediante `PATCH /api/pedidos/{id}/status` con validación estricta de variables en base al Enum esperado por el backend (`PENDIENTE`, `CONFIRMADO`, `TERMINADO`, `CANCELADO`) para evitar errores de internal server error (`HTTP 500`) arrojados por el deserializador de Jackson en Java. Se corrigieron variables e interfaces para matchear `PedidoDto`.
  - `src/pages/auth/login/login.ts` y `src/utils/auth.ts`: Se parcheó el inicio de sesión para persistir correctamente los campos `apellido` y `celular` de la respuesta del backend. Además, la función `checkAuhtUser()` fue refactorizada para devolver el objeto `IUser` parseado en lugar de `void`, solucionando la advertencia estática del IDE y la visualización del famoso "undefined" en los saludos del Navbar.

#### ¿Por qué?
El módulo de pedidos es un requisito importante porque permite a los administradores hacer avanzar a las órdenes en su ciclo de vida y trazabilidad real. Respetar estrictamente las nomenclaturas y tipos de datos provistos por la base de datos (enums) evita que el Frontend envíe peticiones corruptas que colapsen la API. Por su parte, se  refactorizó la sesión, centralizando mejor la información del usuario para todo el panel.

## Últimos detalles solucionados

### Corrección de Bucle Infinito de Redirección en Cierre de Sesión

- **Problema detectado:** Al hacer clic en "Cerrar Sesión" desde las distintas páginas del flujo del cliente (como la tienda o el carrito), la aplicación entraba en un bucle infinito de redirecciones que crasheaba la pestaña (mostrando repetidas veces `/src/pages/auth/login...` en la URL).
- **Causa raíz:** Las funciones atadas al evento del botón "Cerrar Sesión" (`logoutBtn`) utilizaban rutas relativas (`navigate("../auth/login/login.html")`). Al navegar desde un subdirectorio (ej. `/src/pages/store/home`), el navegador resolvía a una ruta inexistente. Vite, en su servidor de desarrollo local, capturaba ese Error 404 y servía por defecto el archivo `index.html` de la raíz. A su vez, el `index.html` original incluía un script que redireccionaba mediante `window.location.href = 'src/pages/auth/login/login.html'`. Como este redireccionamiento en el `index.html` **no tenía una barra inicial (`/`)**, el navegador lo trataba como una ruta relativa adicional y lo concatenaba repetidas veces al string de la URL original, creando el bucle.
- **Solución implementada:** 
  1. Se agregó una barra inicial estricta al redireccionamiento estático del `index.html` (`window.location.href = '/src/pages/auth/login/login.html'`).
  2. Se auditaron todos los scripts vinculados a cierres de sesión (`home.ts`, `cart.ts`, `productDetail.ts`, `orders.ts` del cliente) y se estandarizó el uso de **rutas absolutas** (`/src/pages/auth/login/login.html`) asegurando que cualquier redirección siempre vuelva a apuntar directamente al bloque raíz de la carpeta `src`, sin importar la profundidad previa de la página actual.

### Aislamiento de Carritos por Usuario (Claves Dinámicas en LocalStorage)

- **Problema detectado:** El carrito de compras usaba una clave estática global en `localStorage` (`"store_cart_items"`). Esto provocaba que el carrito fuera "compartido" a nivel de navegador. Si un usuario dejaba productos y no se borraban al salir, el siguiente usuario que iniciaba sesión veía el carrito ajeno. Por el contrario, si se borraba la clave al cerrar sesión, el usuario dueño perdía sus productos si volvía a entrar más tarde.
- **Solución implementada:** Se modificó la arquitectura de guardado local en `src/utils/localStorage.ts`. En lugar de utilizar una variable estática constante, se creó la función dinámica `getCartStorageKey()`. Esta función intercepta los datos de la sesión actual (`userData`) y genera una clave única con el patrón `"store_cart_items_{ID_DEL_USUARIO}"`. 
- **Resultado:** Ahora, cuando el cliente cierra sesión, su carrito no se destruye, sino que queda aislado en su propia clave del navegador. Si otro usuario ingresa, no comparte la clave. Esto garantiza una persistencia correcta y diferenciada del estado, respetando la consigna estricta de implementar el carrito usando exclusivamente `localStorage` sin depender de una tabla backend.

### Resolución de Discrepancia de Tipos (Enum) en Creación de Pedidos

- **Problema detectado:** Al intentar realizar una compra desde el carrito, la consola arrojaba un `Error 500 (Internal Server Error)`. El administrador no podía visualizar nuevos pedidos porque las peticiones `POST` fallaban silenciosamente y no se guardaban en la base de datos.
- **Causa raíz:** Existía una incompatibilidad en la serialización JSON. El frontend enviaba el valor del método de pago de forma capitalizada (ej: `"Efectivo"` o `"MercadoPago"`) a través del `<select>` de HTML, mientras que el backend esperaba estrictamente los valores del Enum `FormaPago` definidos en Java (`EFECTIVO`, `TARJETA`, `TRANSFERENCIA`). Al no coincidir los strings, la librería Jackson lanzaba una `HttpMessageNotReadableException`, la cual derivaba en el error 500.
- **Solución implementada:** Se actualizaron los atributos `value` de las opciones del `<select>` en `cart.html` para reflejar con exactitud la nomenclatura en mayúsculas esperada por la clase Enum del backend, asegurando el correcto mapeo durante la deserialización.

### Precisión Temporal y Mapeo Unidireccional en Panel de Pedidos (Alineación con UML)

- **Problemas detectados:** 
  1. En el panel de administrador, todos los pedidos aparecían agrupados desordenadamente y con una hora aparente de `00:00` ("placeholder").
  2. La columna que indicaba el cliente que realizó la compra se encontraba en blanco (`"-"`), ya que el DTO que enviaba el backend no incluía dicha información.
- **Causas subyacentes:** 
  1. La entidad `Pedido` persistía la fecha utilizando la clase `LocalDate` (que omite información de tiempo). Cuando el Frontend parseaba la fecha, JavaScript rellenaba la hora ausente con ceros (`00:00`), haciendo que todas las transacciones del mismo día colapsaran en el algoritmo de ordenamiento temporal.
  2. Adherido estrictamente al diagrama UML provisto por la cátedra, la relación entre `Usuario` y `Pedido` es de carácter **unidireccional** (El usuario conoce sus pedidos, pero el pedido desconoce a su usuario). Por consiguiente, el objeto `Pedido` no podía extraer directamente el nombre de su creador para enviarlo mediante el DTO.
- **Soluciones implementadas:**
  1. Se modificó el tipo de dato de `LocalDate` a `LocalDateTime` en toda la cadena de la entidad `Pedido` y sus DTOs correspondientes (`PedidoDto` y `PedidoCreate`). Con esta modificación de milisegundos, el frontend ahora ordena cronológicamente la tabla del administrador con exactitud.
  2. Para incorporar el nombre del cliente al `PedidoDto` **sin transgredir la unidireccionalidad** del diagrama UML Se configuró una consulta inteligente en `UsuarioRepository` (`Optional<Usuario> findByPedidosId(Long id)`). El servicio `PedidoServiceImp` se encarga de interceptar la petición, buscar al usuario dueño del pedido mediante esa consulta cruzada por Repositorio, y adjuntar el nombre concatenado en el nuevo campo `nombreCliente` del DTO antes de despacharlo a la vista del administrador.

### Script de Ejecución Unificada (`start.sh`)

- **Problema detectado:** El levantamiento del proyecto requería abrir dos terminales independientes y ejecutar comandos separados para el backend (Gradle) y frontend (Vite), lo cual entorpecía la experiencia de desarrollo (DX).
- **Solución implementada:** Se creó un script bash en la raíz del proyecto (`start.sh`) que utiliza `concurrently` (con la bandera `--yes` para ejecución directa vía npx) para levantar y unificar los logs de ambos servidores simultáneamente con un solo comando.

### Lógica de Filtros y Botón en el Catálogo Frontend

- **Problemas detectados:** 
  1. El botón para agregar al carrito mostraba el texto "Disponible", lo cual no era intuitivo para el usuario.
  2. Los filtros de "Ordenar por" y "Todos" estaban presentes en el HTML pero no tenían funcionalidad, generando confusión.
- **Solución implementada:**
  1. Se modificó el texto del botón a "Agregar +" para dejar clara su función en `home.ts`.
  2. Se conectaron los selectores al estado de la vista (`HomeViewState`). Ahora el cliente puede ordenar el listado (por Menor precio, Mayor precio, o Nombre A-Z) y filtrar los productos por su estado de disponibilidad (Todos, Disponibles, Agotados).

### Automatización de Estado 'Agotado' en el Backend

- **Problema detectado:** Al efectuar una compra, el sistema restaba el stock correctamente en `PedidoServiceImp.java`, pero si este llegaba a 0, el producto continuaba figurando como disponible (`disponible = true`).
- **Solución implementada:** Se agregó una validación inmediata luego de descontar el stock: si el remanente llega a 0, se ejecuta `producto.setDisponible(false)`. Esto automatiza el bloqueo del producto en la tienda sin intervención manual del administrador.

### Límite de Stock en el Carrito Local

- **Problema detectado:** El frontend permitía que el usuario continuara agregando productos al carrito (aumentando la cantidad almacenada en el `localStorage`) indefinidamente, sobrepasando el stock real disponible en la base de datos.
- **Solución implementada:** 
  1. Se agregó una comprobación en `addProductToCartStorage` (`home.ts`) que intercepta la acción y lanza un `alert` si la cantidad en el carrito iguala al stock máximo.
  2. La tarjeta del producto desactiva visualmente el botón (cambiándolo a color gris con texto "Agotado") ni bien el límite es alcanzado. Adicionalmente, se agregaron registros (`console.log`) bajo la nomenclatura estándar del proyecto para auditar estos bloqueos.

### Estandarización del Nombre de Usuario en la Navegación

- **Problema detectado:** Mientras que en el panel administrativo la barra superior mostraba el nombre completo del administrador (`Hola, Nombre Apellido`), en las vistas del cliente (Catálogo, Carrito, Pedidos, Detalle) solo figuraba el nombre de pila.
- **Solución implementada:** Se unificó el código en todos los controladores de vista del cliente (`home.ts`, `cart.ts`, `orders.ts`, `productDetail.ts`) inyectando el `${user.apellido}` en la concatenación del `userNameDisplay`, logrando una experiencia consistente en toda la plataforma.
