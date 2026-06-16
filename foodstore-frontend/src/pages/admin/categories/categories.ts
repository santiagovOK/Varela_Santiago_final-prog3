import { checkAuhtUser } from "../../../utils/auth";

// TPI: Proteger ruta de admin categories
checkAuhtUser("/src/pages/auth/login/login.html", "/src/pages/client/home/home.html", "ADMIN");

console.log("[admin/categories.ts]Admin Categorías página cargada.");
