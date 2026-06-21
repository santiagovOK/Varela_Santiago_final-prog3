import { runRouteGuard } from "../../../main";
import { checkAuhtUser, logout } from "../../../utils/auth";
import type { PedidoDto } from "../../../types/pedido";
import type { Product } from "../../../types/product";
import type { ICategory } from "../../../types/categoria";
import type { IUser } from "../../../types/IUser";

// TPI: Proteger ruta de admin home
const user = checkAuhtUser("/src/pages/auth/login/login.html", "/src/pages/store/home/home.html", "ADMIN");

// NOTA respecto al repositorio base: la validación de acceso se centralizó en src/main.ts para cumplir la consigna del Paso 3. Esta vista solo dispara el guard al cargar y delega la lógica de autorización por rol.
runRouteGuard();

// Mostrar nombre de usuario
const userNameDisplay = document.getElementById("userNameDisplay");
if (userNameDisplay && user) {
    userNameDisplay.textContent = `Hola, ${user.nombre} ${user.apellido}`;
}

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
    logout();
});

// Referencias a elementos del DOM
const statProducts = document.getElementById("statProducts");
const statCategories = document.getElementById("statCategories");
const statOrders = document.getElementById("statOrders");
const statUsers = document.getElementById("statUsers");
const summaryPanel = document.getElementById("summaryPanel");

// Función para cargar estadísticas
const loadDashboardStats = async () => {
    try {
        // TPI: Hacemos fetch a los 4 endpoints concurrentemente
        const [resProducts, resCategories, resOrders, resUsers] = await Promise.all([
            fetch("/api/productos"),
            fetch("/api/categorias"),
            fetch("/api/pedidos"),
            fetch("/api/usuarios")
        ]);

        if (!resProducts.ok || !resCategories.ok || !resOrders.ok || !resUsers.ok) {
            throw new Error("Error al obtener los datos del dashboard desde la API");
        }

        const products: Product[] = await resProducts.json();
        const categories: ICategory[] = await resCategories.json();
        const orders: PedidoDto[] = await resOrders.json();
        const users: IUser[] = await resUsers.json();

        // Actualizar contadores
        if (statProducts) statProducts.textContent = products.length.toString();
        if (statCategories) statCategories.textContent = categories.length.toString();
        if (statOrders) statOrders.textContent = orders.length.toString();
        if (statUsers) statUsers.textContent = users.length.toString();

        // Actualizar el panel de últimos pedidos
        if (summaryPanel) {
            summaryPanel.innerHTML = "";
            if (orders.length === 0) {
                summaryPanel.innerHTML = '<p style="font-size: 1.4rem; padding: 1rem;">No hay pedidos registrados.</p>';
            } else {
                // Ordenar pedidos del más reciente al más antiguo (asumiendo IDs incrementales)
                const sortedOrders = orders.sort((a, b) => b.id - a.id);
                // Tomar los últimos 5 pedidos
                const latestOrders = sortedOrders.slice(0, 5);

                latestOrders.forEach(order => {
                    const item = document.createElement("div");
                    item.className = "summary-item";
                    
                    const date = order.fecha ? new Date(order.fecha).toLocaleDateString() : 'Sin fecha';
                    const customer = order.usuarioDto ? `${order.usuarioDto.nombre} ${order.usuarioDto.apellido}` : 'Cliente anónimo';
                    
                    item.innerHTML = `
                        <div class="summary-item__info">
                            <span class="summary-item__id">Pedido #${order.id} - ${customer}</span>
                            <span class="summary-item__date">${date} | Estado: ${order.estado}</span>
                        </div>
                        <div class="summary-item__amount">
                            $${order.total.toLocaleString()}
                        </div>
                    `;
                    summaryPanel.appendChild(item);
                });
            }
        }

    } catch (error) {
        console.error("Error al cargar estadísticas del dashboard:", error);
        if (summaryPanel) {
            summaryPanel.innerHTML = '<p style="font-size: 1.4rem; color: var(--color-error); padding: 1rem;">Error al cargar los datos. Verifique si el backend está corriendo.</p>';
        }
    }
};

// Inicializar el dashboard
loadDashboardStats();

console.log("[admin/home.ts] Admin home dashboard cargado exitosamente.");