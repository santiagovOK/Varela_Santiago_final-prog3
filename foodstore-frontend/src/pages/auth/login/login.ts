import type { IUser } from "../../../types/IUser";
import { saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

// Referencias DOM del formulario de login.
const form = document.getElementById("form") as HTMLFormElement | null;
const inputEmail = document.getElementById("email") as HTMLInputElement | null;
const inputPassword = document.getElementById("password") as HTMLInputElement | null;

// Guard clause para evitar errores si cambia el HTML.
if (!form || !inputEmail || !inputPassword) {
  throw new Error("No se encontraron los elementos del formulario de login.");
}

// Evento principal de login.
form.addEventListener("submit", async (event: SubmitEvent) => {
  console.log("[login] Evento submit detectado");
  event.preventDefault();

  // Normalizacion para comparar email de forma consistente.
  const email = inputEmail.value.trim().toLowerCase();
  const password = inputPassword.value;

  if (!email || !password) {
    console.log("[login] Validacion fallida: email o password vacios");
    alert("Completá email y contraseña.");
    return;
  }

  // TPI: Para vinculación con el backend. Ahora se realiza un POST para verificar si las credenciales del usuario son válidas en el login.
  try {
    // Busca coincidencia real de credenciales.
    const response = await fetch("/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.log("[login] Credenciales invalidas para", email);
      alert("Credenciales inválidas o error de servidor.");
      return;
    }

    const userData = await response.json();

    // Construye la sesion en el formato tipado del proyecto.
    const userSession: IUser = {
      id: userData.id,
      nombre: userData.nombre,
      email: userData.email,
      rol: userData.rol, // Manejamos posible variacion en respuesta
    };

    // Guarda la sesion activa en userData.
    saveUser(userSession);
    console.log("[login] Sesion iniciada correctamente", {
      email: userSession.email,
      rol: userSession.rol,
    });

    if (userSession.rol === "ADMIN") {
      console.log("[login] Redireccionando a home de admin");
      navigate("/src/pages/admin/home/home.html");
      return;
    }

    console.log("[login] Redireccionando a home de client");
    navigate("/src/pages/client/home/home.html");
  } catch (error) {
    console.error("[login] Error en login:", error);
    alert("Error de conexión con el servidor.");
  }
});