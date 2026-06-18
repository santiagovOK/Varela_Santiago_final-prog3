import { checkAuhtUser } from "../../../utils/auth";

// TPI: Proteger ruta de admin products
checkAuhtUser("/src/pages/auth/login/login.html", "/src/pages/store/home/home.html", "ADMIN");

console.log("[admin/products.ts] Admin Productos página cargada.");
