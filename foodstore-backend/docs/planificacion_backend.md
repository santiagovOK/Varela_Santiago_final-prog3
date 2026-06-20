# Planificación del Trabajo Práctico Integrador (Food Store)

Este documento detalla el plan paso a paso para completar el TPI en base a las `consignas_tpi.md` y al estado actual de las carpetas `foodstore-frontend` y `foodstore-backend`.

El estado inicial de ambas partes del proyecto provienen de sus repositorios base. Por un lado, `foodstore-frontend` está igual a cómo quedó luego de lo solicitado en el primer parcial, por lo que partiré de allí para completar el TPI. `foodstore-backend`, por otro lado, corresponde al estado del backend hasta parte de lo que realicé para el TP10 - API Rest y Spring Boot.

## Análisis del Estado Actual

**Backend (Spring Boot):**Las entidades principales (`Categoria`, `Producto`, `Pedido`, `DetallePedido`, `Usuario`) y sus respectivas capas (Repository, Service, Controller, DTOs) existen y tienen los endpoints básicos de un CRUD estructurados.

---

## Backend (Spring Boot API)

### Paso 1: Ajustes de Validaciones y Entidades (Épicas 1, 2 y 3)
- **Soft Delete:** Asegurar que `Categoria` y `Producto` tengan un campo para baja lógica (ej: `activo` o `bajaLogica`). Los endpoints de borrado deben actualizar este campo en lugar de hacer un delete físico.
- **Validaciones en DTOs:** Agregar anotaciones como `@NotBlank`, `@NotNull`, `@Min` en los DTOs de creación y edición (ej: `CategoriaCreate`, `ProductoCreate`) según las reglas de negocio del TPI.
- **Autenticación (Educativa):** El registro y login en `UsuarioService` deben validar credenciales, encriptar la contraseña (SHA-256) antes de guardar y asegurar que los controladores devuelvan DTOs de usuario SIN la contraseña expuesta.

### Paso 2: Lógica de Negocio de Pedidos (Épica 4)
- **Creación de Pedido:** En `PedidoService.save()`, antes de crear el pedido:
  - Verificar que haya stock suficiente para cada producto.
  - Descontar el stock de los productos correspondientes.
  - Calcular el precio total del pedido en el backend (no confiar en el monto del frontend por seguridad).
- **Consultas Personalizadas:**
  - Crear un endpoint para obtener los pedidos de un usuario específico (`/api/pedidos/usuario/{id}`).
- **Actualización de Estado:**
  - Implementar un endpoint parcial o PUT específico para que el Admin actualice el estado del pedido (`PATCH /api/pedidos/{id}/status`).

### Paso 3: Refinamiento Arquitectónico (Épica 5)
- **Centralización de Excepciones:** Refinar el `AdviceController` para atrapar `MethodArgumentNotValidException` (validaciones de DTOs) y retornar un formato JSON estandarizado con los errores.
- **CORS:** Confirmar que todos los controladores tengan el acceso CORS necesario para que el frontend en el puerto 5173 pueda consumir la API sin restricciones.

### Paso 4: Ajustes de Integración (Post-Revisión del Frontend)
*Nota: Estos cambios se agregaron luego de una revisión del estado del frontend para asegurar la correcta integración del TPI.*
- **Datos de prueba:** Agregar y adaptar datos de prueba sugeridos a DataInitializer.
---

## Estructura del Proyecto (Estado Actual vs. Faltantes)

A continuación, se detalla la estructura principal del proyecto, remarcando **qué archivos/directorios faltan (FALTANTE)** y cuáles **requieren modificaciones críticas (MODIFICAR)** para cumplir con los requerimientos.

### Backend (`/foodstore_backend/`)

```text
├── config/
├── controllers/
│   ├── AdviceController.java          <-- (MODIFICAR) Capturar excepciones personalizadas de validaciones.
│   ├── CategoriaController.java       <-- (MODIFICAR) Usar @Valid en DTOs.
│   ├── PedidoController.java          <-- (MODIFICAR) Añadir PATCH para cambio de estado y GET de mis pedidos.
│   ├── ProductoController.java        <-- (MODIFICAR) Usar @Valid en DTOs.
│   └── UsuarioController.java         <-- (MODIFICAR) Devolver DTO de usuario sin password al frontend.
├── dtos/                              <-- (MODIFICAR) Agregar anotaciones (@NotBlank, @Min, @NotNull) a todos los DTOs de Request.
├── entities/
│   ├── Categoria.java                 <-- (MODIFICAR) Agregar campo booleano 'activo' para soft-delete.
│   ├── Producto.java                  <-- (MODIFICAR) Agregar campo booleano 'activo' para soft-delete.
│   ├── Pedido.java                    
│   ├── DetallePedido.java             
│   └── Usuario.java                   
├── repository/
│   ├── CategoriaRepository.java       <-- (MODIFICAR) Añadir métodos de filtrado para no traer entidades eliminadas.
│   ├── ProductoRepository.java        <-- (MODIFICAR) Añadir métodos de filtrado y consultas por categoría.
│   ├── PedidoRepository.java          <-- (MODIFICAR) Búsqueda custom por ID de Usuario.
│   └── UsuarioRepository.java         <-- (MODIFICAR) Búsqueda por email para la validación en login.
└── service/
    ├── CategoriaServiceImpl.java      <-- (MODIFICAR) Implementar Soft Delete en el deleteById().
    ├── ProductoServiceImp.java        <-- (MODIFICAR) Implementar Soft Delete en el deleteById().
    ├── PedidoServiceImp.java          <-- (MODIFICAR) Lógica estricta de validación/resta de stock, sumado de totales.
    └── UsuarioServiceImp.java         <-- (MODIFICAR) Encriptación (SHA-256) de la contraseña en registro y login.
```
