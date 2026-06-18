import { checkAuhtUser } from "../../../utils/auth";

// TPI: Proteger ruta de admin orders
checkAuhtUser("/src/pages/auth/login/login.html", "/src/pages/store/home/home.html", "ADMIN");

console.log("[admin/orders.ts] Admin Pedidos página cargada.");
