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
