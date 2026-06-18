import { navigate } from "../../../utils/navigate";

// Referencias a elementos del DOM que vamos a usar en todo el flujo.

// Se tipan con tipos concretos para aprovechar autocompletado y chequeo de TS.
// Se permite null para poder validar su existencia antes de usar los elementos.
const form = document.getElementById("registro-form") as HTMLFormElement | null;
const inputEmail = document.getElementById("email") as HTMLInputElement | null;
const inputPassword = document.getElementById("password") as HTMLInputElement | null;
const inputNombre = document.getElementById("nombre") as HTMLInputElement | null;
const inputApellido = document.getElementById("apellido") as HTMLInputElement | null;
const inputCelular = document.getElementById("celular") as HTMLInputElement | null;

// Guard claúsula de seguridad: evita usar addEventListener sobre null.
// Si el HTML cambia y falta algun elemento requerido, falla temprano con error explicito.
if (!form || !inputEmail || !inputPassword || !inputNombre || !inputApellido || !inputCelular) {
  throw new Error("No se encontraron los elementos del formulario de registro.");
}

// Evento principal del Paso 1: captura datos del formulario y registra el usuario.
form.addEventListener("submit", async (event: SubmitEvent) => {
  console.log("[registro] Evento submit detectado");

  // Evita recarga de pagina para manejar la validacion y persistencia con TS.
  event.preventDefault();

  // Normalizamos email para comparar duplicados de forma consistente. Ejemplo: Example@Mail.com y example@mail.com deben contar como el mismo usuario.
  const email = inputEmail.value.trim().toLowerCase();

  // Se conserva la password tal como la ingresa el usuario.

  const password = inputPassword.value; // TPI: ahora el password es "hasheado" en el backend
  const nombre = inputNombre.value.trim();
  const apellido = inputApellido.value.trim();
  const celular = inputCelular.value.trim();

  // Validación minima para no guardar registros vacios.
  if (!email || !password || !nombre || !apellido) {
    console.log("[registro] Validacion fallida: faltan campos obligatorios");
    alert("Completá todos los campos obligatorios.");
    return;
  }

  // TPI: Para vinculación con el backend. Ahora se captura el nombre, email y contraseña y se realiza un POST al backend para el registro de usuario. Se hace hacia el @PostMapping que está como /api/usuarios, ya que no hay ruta adicional en el controlador base del backend.
  try {
    const response = await fetch("/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // La consigna pide no elegir rol en UI: se asigna client por defecto. (Lo mapeamos a USUARIO en backend)
      body: JSON.stringify({ nombre, apellido, celular, email, password, rol: "USUARIO" }),
    });

    if (!response.ok) {
      console.log("[registro] Registro rechazado: email duplicado o error de validacion");
      alert("Error al registrar el usuario. Verifica los datos.");
      return;
    }

    console.log("[registro] Usuario registrado correctamente", {
      email,
      rol: "USUARIO",
    });

    // TPI: Feedback simple de UX y limpieza del formulario para siguiente intento.
    alert("Registro exitoso. Ahora podés iniciar sesión.");
    form.reset();

    // TPI: Navega al login si el registro fue exitoso
    console.log("[registro] Redireccionando a login");
    navigate("../login/login.html");
  } catch (error) {
    console.error("[registro] Error en registro:", error);
    alert("Error de conexión con el servidor.");
  }
});
