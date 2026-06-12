# Trabajo final Integrador - Sección backend del Food Store (Java - Spring Boot)

Cree un archivo Markdown para la resolución de cada una de las consignas (principalmente para guiarme yo y poder revisar los cambios unidad por unidad en el proyecto.). Pueden verlo aquí: [docs/resolucion.md](docs/resolucion_tp9.md)

✨ Estudiante

- Nombre: Varela, Santiago Octavio
- Comisión: M25 C3-13
- Email institucional: santiago.varela@tupad.utn.edu.ar

Repositorio donde podrán encontrar mis trabajos de Programación III: https://github.com/santiagovOK/UTN-TUPaD-P3

---

> **Nota:** Este proyecto está configurado en su `build.gradle` para compilar utilizando **Java 25**.

### Base de Datos H2

La base de datos H2 está configurada para levantarse y correr en memoria. Para visualizar las tablas y los datos que se cargan automáticamente desde DataInitializer:
1. Es requisito indispensable que el proyecto de Spring Boot se encuentre **en ejecución**.
2. Una vez que la aplicación esté corriendo, ingresa a la siguiente ruta desde tu navegador: `http://localhost:8080/h2-console`
3. En la interfaz de login, hay que colocar en **JDBC URL** el valor: `jdbc:h2:mem:jpa_db`
4. User Name: `sa` (dejar el password en blanco) y hacer clic en Connect.

> **Aclaración sobre la configuración:** 
> La configuración de la base de datos se encuentra escrita de manera explícita en el archivo `application.properties`. **El no uso de variables de entorno (como archivos `.env`) es totalmente adrede, con el conocimiento de que no se recomienda en producción.** Se decidió seguir utilizando una configuración estática muy similar a la que se venía manejando en el **TP Nº8 sobre JPA**, esto con el objetivo de no sobrecomplicar el proyecto ni añadir capas extra de abstracción a este ejercicio de práctica de los fundamentos de Spring Boot.
