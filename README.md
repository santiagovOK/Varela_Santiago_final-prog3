# Trabajo Final Integrador - Programación 3
## “Food Store” - Sistema de Gestión de Pedidos de comida - Aplicación web full stack

Markdown con lo realizado en base al punto de partida (ver más abajo) para la resolución de este trabajo: [docs/resolucion_tpi.md](docs/resolucion_tpi.md)

✨ Estudiante

- Nombre: Varela, Santiago Octavio
- Comisión: M25 C3-13
- Email institucional: santiago.varela@tupad.utn.edu.ar

Repositorio donde podrán encontrar mis trabajos de Programación III: https://github.com/santiagovOK/UTN-TUPaD-P3

---

# Objetivos del proyecto

Desarrollar una aplicación web full stack completa para la gestión de un negocio de comidas ("Food Store") que permita:

- A los administradores: Gestionar categorías, productos y pedidos.
- A los clientes: Navegar productos, realizar compras y seguir sus pedidos
- Sistema de carrito: Funcional, con persistencia en localStorage
- Integración completa: Conexión Frontend-Backend mediante REST API

## Cómo ejecutar el proyecto

Para facilitar la evaluación y el levantamiento simultáneo de ambos entornos (Frontend y Backend), se provee en la raíz del repositorio el script unificado `start.sh`.

### Requisitos previos
1. **Node.js y npm** instalados (necesarios para ejecutar los comandos del frontend y `npx`).
2. **Java 17+** (el proyecto está configurado para compilar en Java 25, pero Java 17+ es la base mínima para Spring Boot 4).
3. **SO Linux/Mac o Git Bash en Windows** para poder ejecutar el script `.sh`.

### Pasos de ejecución
1. **Otorgar permisos de ejecución** (si estás en Linux/Mac):
   Abre tu terminal en la raíz del proyecto y ejecuta:
   ```bash
   chmod +x start.sh
   ```
2. **Ejecutar el script:**
   Desde la misma raíz del proyecto, corre el siguiente comando:
   ```bash
   ./start.sh
   ```
   *(Si estás en Windows usando Git Bash, podés ejecutar simplemente `bash start.sh`).*

**¿Qué hace este script exactamente?**
Utiliza el paquete `concurrently` (mediante `npx --yes` para no requerir instalaciones globales) para ejecutar dos tareas en paralelo: levanta el servidor de Spring Boot (vía `./gradlew bootRun`) y el servidor de Vite (`npm run dev`). Previo a esto, el script se encarga automáticamente de instalar las dependencias de Node (`npm install`) si es la primera vez que clonás el repositorio, garantizando un arranque sin errores.

### Alternativas de ejecución (Fallback)
Si por cuestiones de tu sistema operativo o permisos **no podés ejecutar el script `start.sh`**, tenés dos alternativas válidas:
1. **Ejecutar concurrently manualmente:** Dirigite a la carpeta del frontend (`cd foodstore-frontend`) y ejecutá el comando de `concurrently` que invoca ambos entornos desde allí.
2. **Ejecutar por separado:** Abrí dos terminales distintas. En la primera, ingresá a `foodstore-backend` y ejecutá `./gradlew bootRun` (o `gradlew.bat bootRun` en Windows). En la segunda terminal, ingresá a `foodstore-frontend` y ejecutá `npm install` seguido de `npm run dev`.

## Links de relevancia para la evaluación

**Link al repositorio en Github: https://github.com/santiagovOK/Varela_Santiago_final-prog3**

**- Video explicativo: https://youtu.be/iPpf2Dc6y9Y**
**- Video explicativo (link B): https://drive.google.com/file/d/1qVi9tkZsW7vVKzdnn4HUKPuNAdQb3p0k/view?usp=sharing**

**Presentación utilizada en el video: https://whimsical.com/santiagovarela/tpi-presentacion-RamoGXsFhmoRRsLiF9c5G1**

## Documentación Académica y Técnica (Formato PDF)

El informe técnico final sobre este proyecto, en base al formato exigido en las consignas, pueden encontrarlo aquí: [docs/informe_final.pdf](docs/informe_final.pdf)


## Otros Detalles

### Punto de partida

El estado inicial de ambas partes del proyecto provienen de sus repositorios base. Por un lado, `foodstore-frontend` está igual a cómo quedó luego de lo solicitado en el primer parcial, por lo que partiré de allí para completar el TPI. `foodstore-backend`, por otro lado, corresponde al estado del backend hasta parte de lo que realicé para el TP10 - API Rest y Spring Boot.

- Link al repositorio del [primer parcial](https://github.com/santiagovOK/p3_Varela_Santiago_primer_parcial).
- Link al repositorio del [TP10](https://github.com/santiagovOK/UTN-TUPaD-P3/tree/main/unidad10_APIRestSpringBoot).


<details>
<summary>Fundamentación sobre versión del TPI elegida</summary>

Decidí optar por realizar la primera versión del trabajo práctico integrador, cuya principal diferencia radica en que utiliza **Spring Boot**.

Elegí este enfoque tecnológico por tres motivos fundamentales:
1. **Alineación con el mercado laboral:** Spring Boot es el estándar en la industria para el desarrollo de APIs robustas y escalables en Java.
2. **Eficiencia en el desarrollo:** Al abstraer la lógica de bajo nivel (como el manejo manual de conexiones JDBC), el framework me permite concentrar los esfuerzos en la arquitectura de capas (`Controller - Service - Repository`), el uso de DTOs con Java Records y la correcta implementación de la lógica de negocio de la aplicación.
3. **Enfoque moderno vs. heredado** Si bien comprendo el valor pedagógico de estudiar los componentes nativos de bajo nivel para entender qué ocurre detrás de la infraestructura (y principalmente en entornos heredados), considero fundamental priorizar el dominio de las abstracciones modernas.
</details>


<details>
<summary>Notas sobre Java y H2</summary>

> **Nota:** Este proyecto está configurado en su `build.gradle` para compilar utilizando **Java 25**.

### Base de Datos H2

La base de datos H2 está configurada para levantarse y correr en memoria. Para visualizar las tablas y los datos que se cargan automáticamente desde DataInitializer:
1. Es requisito indispensable que el proyecto de Spring Boot se encuentre **en ejecución**.
2. Una vez que la aplicación esté corriendo, ingresa a la siguiente ruta desde tu navegador: `http://localhost:8080/h2-console`
3. En la interfaz de login, hay que colocar en **JDBC URL** el valor: `jdbc:h2:mem:jpa_db`
4. User Name: `sa` (dejar el password en blanco) y hacer clic en Connect.

> **Aclaración sobre la configuración:**
> La configuración de la base de datos se encuentra escrita de manera explícita en el archivo `application.properties`. **El no uso de variables de entorno (como archivos `.env`) es totalmente adrede, con el conocimiento de que no se recomienda en producción.** Se decidió seguir utilizando una configuración estática muy similar a la que se venía manejando en el **TP Nº8 sobre JPA**, esto con el objetivo de no sobrecomplicar el proyecto ni añadir capas extra de abstracción a este ejercicio de práctica de los fundamentos de Spring Boot.

</details>

---

## 📖 Documentación de la API (Swagger UI)

Una vez que el backend (Spring Boot) se encuentre en ejecución, la documentación interactiva de todos los endpoints generada automáticamente con SpringDoc OpenAPI estará disponible en el siguiente enlace:

- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## Validación

El proceso detallado de las pruebas de integración, verificación de los flujos principales (Admin y Cliente) y el control de reglas de negocio se encuentra documentado paso a paso en el siguiente archivo:

- [docs/validación_manual.md](docs/validación_manual.md)

## 📊 Diagrama UML

Este proyecto se basó en el siguiente diagrama UML:

![Diagrama UML](/docs/diagrama_uml_sugerido.png)
---

## Licencia

Este proyecto se distribuye bajo la [Licencia MIT](LICENCE.TXT).