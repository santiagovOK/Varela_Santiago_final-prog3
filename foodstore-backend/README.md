# Trabajo final Integrador - Sección backend del Food Store (Java - Spring Boot)

✨ Estudiante

- Nombre: Varela, Santiago Octavio
- Comisión: M25 C3-13
- Email institucional: santiago.varela@tupad.utn.edu.ar

---

## Ejecución manual del Servidor (Por separado)

Si necesitás levantar únicamente la API de Spring Boot, o estás ejecutando el Frontend en otra consola de manera independiente, seguí estos pasos:

### Requisitos previos:
- **Java 17+** instalado (JDK).
- (Opcional) Una IDE compatible como IntelliJ IDEA, Eclipse o VS Code.

### Pasos mediante terminal (con Gradle Wrapper):

1. Ubicate en la carpeta raíz del backend (`foodstore-backend`).
2. Ejecutá el wrapper de Gradle para iniciar el servidor web embebido (Tomcat) en el puerto `8080`:

En Linux/Mac:
```bash
./gradlew bootRun
```

En Windows (CMD / PowerShell):
```bash
gradlew.bat bootRun
```

> **Nota:** La primera vez que ejecutes este comando, Gradle descargará todas las dependencias declaradas en el archivo `build.gradle` y puede demorar un poco. Una vez finalizado, verás en la consola el logo de Spring Boot y el mensaje `Started FoodstoreBackendApplication`.
