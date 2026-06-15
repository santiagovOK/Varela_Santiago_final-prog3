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
