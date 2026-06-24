import { runRouteGuard } from "../../../main";
import { checkAuhtUser, logout } from "../../../utils/auth";
import type { PedidoDto } from "../../../types/pedido";

// TPI: Proteger ruta de admin orders
const user = checkAuhtUser("/src/pages/auth/login/login.html", "/src/pages/store/home/home.html", "ADMIN");
runRouteGuard();

const userNameDisplay = document.getElementById("userNameDisplay");
if (userNameDisplay && user) {
    userNameDisplay.textContent = `Hola, ${user.nombre} ${user.apellido}`;
}

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
    logout();
});

// Referencias DOM
const tableBody = document.getElementById("ordersTableBody") as HTMLTableSectionElement;
const orderModal = document.getElementById("orderModal") as HTMLDialogElement;
const btnCancelModal = document.getElementById("btnCancelModal") as HTMLButtonElement;
const orderForm = document.getElementById("orderForm") as HTMLFormElement;

const modalOrderId = document.getElementById("modalOrderId") as HTMLSpanElement;
const modalClient = document.getElementById("modalClient") as HTMLSpanElement;
const modalDate = document.getElementById("modalDate") as HTMLSpanElement;
const modalTotal = document.getElementById("modalTotal") as HTMLSpanElement;
const modalPayment = document.getElementById("modalPayment") as HTMLSpanElement;
const modalDetailsBody = document.getElementById("modalDetailsBody") as HTMLTableSectionElement;

const orderIdInput = document.getElementById("orderIdInput") as HTMLInputElement;
const orderStatusSelect = document.getElementById("orderStatusSelect") as HTMLSelectElement;

// Estado
let orders: PedidoDto[] = [];

// Helper formateo
const formatPrice = (value: number): string => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
};

const formatDate = (dateString: string): string => {
    const d = new Date(dateString);
    return d.toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

// API calls
const fetchOrders = async () => {
    try {
        const res = await fetch("/api/pedidos");
        if (!res.ok) throw new Error("Error fetching orders");
        
        const data: PedidoDto[] = await res.json();
        // Ordenar de más reciente a más antiguo
        orders = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        renderTable();
    } catch (error) {
        console.error("[admin/orders.ts] Error al cargar pedidos:", error);
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-error); padding: 2rem; font-size: 1.4rem;">Error al cargar los pedidos. Verifique el backend.</td></tr>`;
        }
    }
};

const updateOrderStatus = async (id: number, status: string) => {
    try {
        const res = await fetch(`/api/pedidos/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: status })
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log(`[admin/orders.ts] Pedido ID ${id} actualizado a estado ${status}.`);
        await fetchOrders();
    } catch (error) {
        console.error(`[admin/orders.ts] Error actualizando estado de pedido ID ${id}:`, error);
        throw error;
    }
};

// Render
const renderTable = () => {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; font-size: 1.4rem;">No hay pedidos registrados</td></tr>`;
        return;
    }

    orders.forEach(order => {
        const tr = document.createElement("tr");
        
        const badgeClass = `badge--${order.estado.toLowerCase()}`;

        tr.innerHTML = `
            <td>#${order.id}</td>
            <td>${formatDate(order.fecha)}</td>
            <td>${order.nombreCliente || "-"}</td>
            <td>${formatPrice(order.total)}</td>
            <td>${order.formaPago}</td>
            <td><span class="badge ${badgeClass}">${order.estado}</span></td>
            <td>
                <button class="btn btn-sm btn--secondary btn-view" data-id="${order.id}">Gestionar</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    document.querySelectorAll(".btn-view").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number((e.target as HTMLButtonElement).dataset.id);
            openOrderModal(id);
        });
    });
};

// Modal handlers
const openOrderModal = (id: number) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    // Poblar resumen del pedido
    modalOrderId.textContent = order.id.toString();
    modalClient.textContent = order.nombreCliente || "Consumidor Final";
    modalDate.textContent = formatDate(order.fecha);
    modalTotal.textContent = formatPrice(order.total);
    modalPayment.textContent = order.formaPago;
    
    orderIdInput.value = order.id.toString();
    orderStatusSelect.value = order.estado;

    // Poblar detalles del pedido
    modalDetailsBody.innerHTML = "";
    order.detalles.forEach(detalle => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${detalle.nombreProducto}</td>
            <td>-</td>
            <td>${detalle.cantidad}</td>
            <td>${formatPrice(detalle.subtotal)}</td>
        `;
        modalDetailsBody.appendChild(tr);
    });

    orderModal.showModal();
};

btnCancelModal?.addEventListener("click", () => {
    orderModal.close();
});

// Cerrar modal al hacer clic afuera
orderModal?.addEventListener("click", (e) => {
    const dialogDimensions = orderModal.getBoundingClientRect();
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        orderModal.close();
    }
});

orderForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const id = Number(orderIdInput.value);
    const newStatus = orderStatusSelect.value;
    
    try {
        await updateOrderStatus(id, newStatus);
        orderModal.close();
    } catch (error) {
        console.error(error);
        alert("Error al actualizar el estado del pedido.");
    }
});

// Iniciar
fetchOrders();
console.log("[admin/orders.ts] Admin Pedidos inicializado.");
