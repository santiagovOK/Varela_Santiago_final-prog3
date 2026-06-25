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
  return `
    <li class="order-card">
      <div class="order-card__header">
        <span class="order-card__id">Pedido #${order.id}</span>
        <span class="order-card__date">${formatDate(order.fecha)}</span>
      </div>
      <div class="order-card__body">
        <div class="order-card__info-row">
          <span class="order-card__label">Estado</span>
          <span class="${getStatusClass(order.estado)}">${order.estado}</span>
        </div>
        <div class="order-card__info-row">
          <span class="order-card__label">Forma de Pago</span>
          <span class="order-card__value">${order.formaPago.replace('_', ' ')}</span>
        </div>
        <div class="order-card__info-row">
          <span class="order-card__label">Total</span>
          <span class="order-card__value" style="color: var(--color-primario); font-weight: bold;">${formatPrice(order.total)}</span>
        </div>
      </div>
      <div class="order-card__footer">
        <button class="order-card__btn" data-order-id="${order.id}">Ver Detalles</button>
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

  const detailsHtml = order.detalles.map(detalle => `
    <div class="detail-item">
      <div class="detail-item__info">
        <span class="detail-item__name">${detalle.nombreProducto}</span>
        <span class="detail-item__qty">Cantidad: ${detalle.cantidad}</span>
      </div>
      <span class="detail-item__subtotal">${formatPrice(detalle.subtotal)}</span>
    </div>
  `).join("");

  modalBody.innerHTML = `
    <div class="detail-list">
      ${detailsHtml}
    </div>
    <div style="margin-top: 1.5rem; text-align: right; border-top: 1px solid var(--color-borde); padding-top: 1rem;">
      <span style="font-weight: bold; color: var(--color-texto);">Total Pagado: </span>
      <span style="font-weight: bold; color: var(--color-primario); font-size: 1.25rem;">${formatPrice(order.total)}</span>
    </div>
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
  if (target.classList.contains("order-card__btn")) {
    const orderIdStr = target.getAttribute("data-order-id");
    if (orderIdStr) {
      openOrderModal(parseInt(orderIdStr, 10));
    }
  }
});

// Carga inicial
loadOrders();
