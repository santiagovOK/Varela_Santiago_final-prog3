# Trabajo Final Integrador - Programacion 3 - 

Markdown con los diferentes pasos seguidos para la resolución: [docs/resolucion_tpi.md](docs/resolucion_tpi.md)

✨ Estudiante

- Nombre: Varela, Santiago Octavio
- Comisión: M25 C3-13
- Email institucional: santiago.varela@tupad.utn.edu.ar

Repositorio donde podrán encontrar mis trabajos de Programación III: https://github.com/santiagovOK/UTN-TUPaD-P3

---

# Links de relevancia para la evaluación

**Link al repositorio en Github: https://github.com/santiagovOK/Varela_Santiago_final-prog3**

**- Video explicativo: **
**- Video explicativo (link B):**

**- Presentación utilizada en el video:**

---

## 📖 Documentación de la API (Swagger UI)

Una vez que el backend (Spring Boot) se encuentre en ejecución, la documentación interactiva de todos los endpoints generada automáticamente con SpringDoc OpenAPI estará disponible en el siguiente enlace:

- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

Objetivos del proyecto:

<details>
<summary>Fundamentación sobre versión del TPI elegida y punto de partida</summary>

Decidí optar por realizar la primera versión del trabajo práctico integrador, cuya principal diferencia radica en que utiliza **Spring Boot**.

Elegí este enfoque tecnológico por tres motivos fundamentales:
1. **Alineación con el mercado laboral:** Spring Boot es el estándar en la industria para el desarrollo de APIs robustas y escalables en Java.
2. **Eficiencia en el desarrollo:** Al abstraer la lógica de bajo nivel (como el manejo manual de conexiones JDBC), el framework me permite concentrar los esfuerzos en la arquitectura de capas (`Controller - Service - Repository`), el uso de DTOs con Java Records y la correcta implementación de la lógica de negocio de la aplicación.
3. **Enfoque moderno vs. heredado** Si bien comprendo el valor pedagógico de estudiar los componentes nativos de bajo nivel para entender qué ocurre detrás de la infraestructura (y principalmente en entornos heredados), considero fundamental priorizar el dominio de las abstracciones modernas.

## Punto de partida

El estado inicial de ambas partes del proyecto provienen de sus repositorios base. Por un lado, `foodstore-frontend` está igual a cómo quedó luego de lo solicitado en el primer parcial, por lo que partiré de allí para completar el TPI. `foodstore-backend`, por otro lado, corresponde al estado del backend hasta parte de lo que realicé para el TP10 - API Rest y Spring Boot.

- Link al repositorio del [primer parcial](https://github.com/santiagovOK/p3_Varela_Santiago_primer_parcial).
- Link al repositorio del [TP10](https://github.com/santiagovOK/UTN-TUPaD-P3/tree/main/unidad10_APIRestSpringBoot).

</details>



## Licencia

Este proyecto se distribuye bajo la [Licencia MIT](LICENCE.TXT).