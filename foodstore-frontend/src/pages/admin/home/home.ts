import { runRouteGuard } from "../../../main";
import { checkAuhtUser, logout } from "../../../utils/auth";

// TPI: Proteger ruta de admin home
checkAuhtUser("/src/pages/auth/login/login.html", "/src/pages/client/home/home.html", "ADMIN");


// NOTA respecto al repositorio base: la validacion de acceso se centralizo en src/main.ts para cumplir la consigna del Paso 3. Esta vista solo dispara el guard al cargar y delega la logica de autorizacion por rol.
runRouteGuard();

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

console.log("[admin/home.ts] Admin home página cargada.");