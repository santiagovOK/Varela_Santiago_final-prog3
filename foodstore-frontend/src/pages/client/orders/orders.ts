import { checkAuhtUser } from "../../../utils/auth";
import { getUSer, getCart } from "../../../utils/localStorage";
import type { IUser } from "../../../types/IUser";
import type { PedidoDto } from "../../../types/pedido";

// TPI: Protección de ruta y Referencias DOM en orders

// TPI: Verificamos que el usuario tenga rol de USUARIO (cliente)
checkAuhtUser("../../auth/login/login.html", "../../admin/home/home.html", "USUARIO");

const ordersContent = document.getElementById("orders-content") as HTMLElement;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement | null;
const orderModal = document.getElementById("order-modal") as HTMLDialogElement;
const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement;
const modalBody = document.getElementById("modal-body") as HTMLElement;
const modalCloseBtn = document.getElementById("modal-close-btn") as HTMLButtonElement;

const userNameDisplay = document.getElementById("user-name-display") as HTMLSpanElement | null;
const adminLinkContainer = document.getElementById("admin-link-container") as HTMLLIElement | null;
const cartCount = document.getElementById("cart-count") as HTMLSpanElement | null;

if (!ordersContent || !orderModal || !modalTitle || !modalBody || !modalCloseBtn || !userNameDisplay || !logoutBtn) {
  throw new Error("Faltan elementos del DOM en la vista client/orders.");
}

// Session
const rawUser = getUSer();
if (rawUser) {
    const user = JSON.parse(rawUser);
    userNameDisplay.textContent = `${user.nombre} ${user.apellido}`;
    if (user.rol === "ADMIN" && adminLinkContainer) {
        adminLinkContainer.style.display = "block";
    }
}

// Helper para calcular unidades en carrito
if (cartCount) {
    const cart = getCart();
    const totalUnits = Object.values(cart).reduce((acc, qty) => acc + qty, 0);
    cartCount.textContent = String(totalUnits);
}

// Variables globales para datos
let userOrders: PedidoDto[] = [];

// TPI: Helpers

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string): string => {
  // Asegurarse de que la fecha se muestre sin desfasaje horario
  const [year = "0", month = "1", day = "1"] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString("es-AR");
};

const getStatusClass = (status: string): string => {
  const baseClass = "order-card__status";
  const modClass = `${baseClass}--${status.toLowerCase()}`;
  return `${baseClass} ${modClass}`;
};

// TPI: Lógica de renderizado

const renderEmptyState = () => {
  ordersContent.innerHTML = `
    <div class="orders__message">
      <p>Aún no has realizado ningún pedido.</p>
      <br />
      <a href="../../store/home/home.html" style="color: var(--color-primario); font-weight: bold; text-decoration: underline;">Ir a la tienda</a>
    </div>
  `;
};

const renderError = (message: string) => {
  ordersContent.innerHTML = `
    <div class="orders__message">
      <p style="color: var(--color-error, red);">${message}</p>
    </div>
  `;
};

const createOrderCardTemplate = (order: PedidoDto): string => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDIENTE": return `<span class="order-card__badge" style="background-color: #ffedcc; color: #cc8400; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase;">PENDIENTE</span>`;
      case "CONFIRMADO": return `<span class="order-card__badge" style="background-color: #cce5ff; color: #004085; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase;">CONFIRMADO</span>`;
      case "TERMINADO": return `<span class="order-card__badge" style="background-color: #d4edda; color: #155724; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase;">TERMINADO</span>`;
      case "CANCELADO": return `<span class="order-card__badge" style="background-color: #f8d7da; color: #721c24; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase;">CANCELADO</span>`;
      default: return `<span class="order-card__badge">${status}</span>`;
    }
  };

  const productList = order.detalles.map(d => `<div style="font-size: 0.85rem; color: #555; margin-bottom: 0.3rem;">• ${d.nombreProducto} (x${d.cantidad})</div>`).join("");
  const totalItems = order.detalles.reduce((acc, d) => acc + d.cantidad, 0);

  return `
    <li class="order-card" style="cursor: pointer; transition: transform 0.2s;" data-order-id="${order.id}">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--color-borde); padding-bottom: 0.8rem; margin-bottom: 0.8rem;">
        <div>
          <div style="font-weight: bold; font-size: 0.95rem; color: var(--color-texto); margin-bottom: 0.3rem;">Pedido #ORD-${order.id}</div>
          <div style="font-size: 0.8rem; color: var(--color-texto-mutado);">📅 ${formatDate(order.fecha)}</div>
        </div>
        ${getStatusBadge(order.estado)}
      </div>
      
      <div style="margin-bottom: 1rem;">
        ${productList}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--color-borde); padding-top: 0.8rem;">
        <span style="font-size: 0.85rem; color: var(--color-texto-mutado);">📦 ${totalItems} producto(s)</span>
        <span style="color: var(--color-primario); font-weight: bold; font-size: 1.1rem;">${formatPrice(order.total)}</span>
      </div>
    </li>
  `;
};

const renderOrders = () => {
  if (userOrders.length === 0) {
    renderEmptyState();
    return;
  }

  const listHtml = `
    <ul class="orders__list">
      ${userOrders.map(createOrderCardTemplate).join("")}
    </ul>
  `;

  ordersContent.innerHTML = listHtml;
};

// TPI: Lógica del Modal

const openOrderModal = (orderId: number) => {
  const order = userOrders.find(o => o.id === orderId);
  if (!order) return;

  modalTitle.textContent = `Detalle del Pedido #${order.id}`;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: 'numeric', minute: 'numeric'
    }).format(d);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDIENTE": return `<span class="order-card__badge" style="background-color: #ffedcc; color: #cc8400; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">PENDIENTE</span>`;
      case "CONFIRMADO": return `<span class="order-card__badge" style="background-color: #cce5ff; color: #004085; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">CONFIRMADO</span>`;
      case "TERMINADO": return `<span class="order-card__badge" style="background-color: #d4edda; color: #155724; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">TERMINADO</span>`;
      case "CANCELADO": return `<span class="order-card__badge" style="background-color: #f8d7da; color: #721c24; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">CANCELADO</span>`;
      default: return `<span class="order-card__badge">${status}</span>`;
    }
  };

  const userStr = localStorage.getItem("user");
  const userCelular = userStr ? JSON.parse(userStr).celular : "No especificado";

  const detailsHtml = order.detalles.map(detalle => `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
      <div>
        <div style="font-weight: 500; font-size: 0.9rem;">${detalle.nombreProducto}</div>
        <div style="font-size: 0.8rem; color: #666;">Cantidad: ${detalle.cantidad} x ${formatPrice(detalle.subtotal / detalle.cantidad)}</div>
      </div>
      <div style="color: var(--color-primario); font-weight: bold;">${formatPrice(detalle.subtotal)}</div>
    </div>
  `).join("");

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      ${getStatusBadge(order.estado)}
      <div style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">📅 ${formatDate(order.fecha)}</div>
    </div>

    <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <h4 style="margin: 0 0 0.75rem 0; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;">📍 Información de Entrega</h4>
      <div style="font-size: 0.85rem; color: #333; display: flex; flex-direction: column; gap: 0.4rem;">
        <div><strong>Dirección:</strong> Mi Dirección 1234</div>
        <div><strong>Teléfono:</strong> ${userCelular}</div>
        <div><strong>Método de pago:</strong> 💵 ${order.formaPago}</div>
      </div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="margin: 0 0 0.75rem 0; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;">🛍️ Productos</h4>
      ${detailsHtml}
      
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #666; margin-top: 1rem;">
        <span>Subtotal:</span>
        <span>${formatPrice(order.total)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #666; margin-top: 0.25rem;">
        <span>Envío:</span>
        <span>$0.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 1rem; font-weight: bold; color: var(--color-primario); margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed #ccc;">
        <span>Total:</span>
        <span>${formatPrice(order.total)}</span>
      </div>
    </div>

    ${(order.estado !== 'TERMINADO' && order.estado !== 'CANCELADO') ? `
    <div style="background-color: #fff3cd; color: #856404; padding: 1rem; border-radius: 8px; border: 1px solid #ffeeba; display: flex; gap: 0.5rem; align-items: flex-start;">
      <span>⏳</span>
      <div>
        <strong style="display: block; font-size: 0.9rem;">Tu pedido está siendo procesado</strong>
        <span style="font-size: 0.8rem;">Te notificaremos cuando esté listo para entrega.</span>
      </div>
    </div>
    ` : ''}
  `;

  orderModal.showModal();
};

const closeOrderModal = () => {
  orderModal.close();
};

// TPI: Inicialización y Eventos

const loadOrders = async () => {
  const userStr = getUSer();
  if (!userStr) {
    renderError("No hay sesión iniciada.");
    return;
  }

  const user: IUser = JSON.parse(userStr);
  console.log(`[client-orders] Cargando pedidos para el usuario ${user.id}`);

  try {
    const res = await fetch(`/api/pedidos/usuario/${user.id}`);
    
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    userOrders = await res.json();
    console.log("[client-orders] Pedidos obtenidos", { count: userOrders.length });
    
    // Ordenamos los pedidos para que el más nuevo esté arriba
    userOrders.sort((a, b) => b.id - a.id);
    
    renderOrders();
  } catch (err) {
    console.error("[client-orders] Error al cargar pedidos", err);
    renderError("Ocurrió un error al cargar tus pedidos. Por favor, intenta de nuevo más tarde.");
    if (err instanceof Response && err.status === 404) {
      alert("Usuario no encontrado en la base de datos. Por favor, vuelva a iniciar sesión.");
      window.location.href = "/src/pages/auth/login/login.html";
      return;
    }
  }
};

// Event Listeners
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("store_user");
    window.location.href = "/src/pages/auth/login/login.html";
  });
}

modalCloseBtn.addEventListener("click", closeOrderModal);

// Cerrar modal haciendo click fuera del dialog
orderModal.addEventListener("click", (e) => {
  const dialogDimensions = orderModal.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    closeOrderModal();
  }
});

// Delegación de eventos para los botones de "Ver Detalles"
ordersContent.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const orderCard = target.closest('.order-card');
  if (orderCard) {
    const orderIdStr = orderCard.getAttribute("data-order-id");
    if (orderIdStr) {
      openOrderModal(parseInt(orderIdStr, 10));
    }
  }
});

// Carga inicial
loadOrders();
