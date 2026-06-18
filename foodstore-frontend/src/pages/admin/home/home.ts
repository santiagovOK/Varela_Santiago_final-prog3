import { runRouteGuard } from "../../../main";
import { checkAuhtUser, logout } from "../../../utils/auth";

// TPI: Proteger ruta de admin home
checkAuhtUser("/src/pages/auth/login/login.html", "/src/pages/store/home/home.html", "ADMIN");


// NOTA respecto al repositorio base: la validación de acceso se centralizó en src/main.ts para cumplir la consigna del Paso 3. Esta vista solo dispara el guard al cargar y delega la lógica de autorización por rol.
runRouteGuard();

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

console.log("[admin/home.ts] Admin home página cargada.");