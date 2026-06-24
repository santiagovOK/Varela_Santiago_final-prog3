import { getCart, saveCart, clearCart, getUSer, removeUser } from "../../../utils/localStorage"; 
import { navigate } from "../../../utils/navigate";
import type { Product, CartItem } from "../../../types/product";
import type { IUser } from "../../../types/IUser";

// 1. Referencias a elementos del DOM (mediante id) que se van a usar en la vista.

const cartItemsList = document.getElementById("cart-items-list") as HTMLUListElement | null;
const cartSubtotal = document.getElementById("cart-subtotal") as HTMLSpanElement | null;
const cartTotal = document.getElementById("cart-total") as HTMLSpanElement | null;
const cartItemsContainer = document.getElementById("cart-items-container") as HTMLElement | null;
const cartEmpty = document.getElementById("cart-empty") as HTMLElement | null;
const cartCount = document.getElementById("cart-count") as HTMLSpanElement | null;
const clearCartBtn = document.getElementById("clear-cart-btn") as HTMLButtonElement | null;
const checkoutBtn = document.getElementById("checkout-btn") as HTMLButtonElement | null;
const formaPagoSelect = document.getElementById("forma-pago") as HTMLSelectElement | null;
const checkoutFeedback = document.getElementById("checkout-feedback") as HTMLParagraphElement | null;
const cartPhone = document.getElementById("cart-phone") as HTMLSpanElement | null;

const userNameDisplay = document.getElementById("user-name-display") as HTMLSpanElement | null;
const adminLinkContainer = document.getElementById("admin-link-container") as HTMLLIElement | null;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement | null;

// Guard clause para evitar errores silenciosos si cambia el HTML.
if (!cartItemsList || !cartSubtotal || !cartTotal || !cartItemsContainer || !cartEmpty || !cartCount || !clearCartBtn || !checkoutBtn || !formaPagoSelect || !userNameDisplay || !logoutBtn || !cartPhone) {
  throw new Error("Faltan elementos del DOM en la vista store/cart.");
}

// Session
const rawUser = getUSer();
if (rawUser) {
    const user: IUser = JSON.parse(rawUser);
    userNameDisplay.textContent = user.nombre || "Usuario";
    if (cartPhone) {
        cartPhone.textContent = user.celular || "No especificado";
    }
    if (user.rol === "ADMIN" && adminLinkContainer) {
        adminLinkContainer.style.display = "block";
    }
}

logoutBtn.addEventListener("click", () => {
    removeUser();
    navigate("/src/pages/auth/login/login.html");
});

// 2. Estado del carrito

// Al igual que en `home.ts`, definimos tipos para el estado del carrito, que es un objeto donde la clave es el productId y el valor es la cantidad de ese producto en el carrito. No es totalmente necesario, pero ayuda a la claridad del código en próximas etapas del TPI.

type CartMap = Record<string, number>; // clave: productId, valor: cantidad

type CartState = {
  items: CartMap;
  productsById: Map<number, Product>;
};

// Estado inicial del carrito, que arranca vacío.
const state: CartState = {
  items: getCart(), // Cargamos el carrito desde localStorage al iniciar la vista, para mantener persistencia entre sesiones.
  productsById: new Map(),
};

// 3) Helpers

// Formatea números a moneda ARS para mostrar precios consistentes en UI, usando el objeto `Intl.NumberFormat`. 
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
};

const getTotalUnits = (items: CartMap): number => {
  return Object.values(items).reduce((acc, qty) => acc + qty, 0);
};

const syncCartCount = (): void => {
  cartCount.textContent = String(getTotalUnits(state.items));
};

const persistCart = (): void => {
  saveCart(state.items);
  syncCartCount();

  console.log("[store-cart] Carrito persistido", {
    items: state.items,
    totalUnits: getTotalUnits(state.items),
  });
};

// Función para convertir el estado del carrito (CartMap) en un array de CartItem, que es una estructura más adecuada para renderizar la vista del carrito, ya que incluye información detallada de cada producto (nombre, precio unitario, imagen) además de la cantidad.

const toRenderableItems = (items: CartMap): CartItem[] => {
  return Object.entries(items) // convierte el objeto CartMap en un array de [productId, cantidad]
    .map(([productId, cantidad]) => { // mapea cada entrada del carrito a un CartItem, buscando la información del producto en el estado (state.productsById) para completar los datos necesarios para la vista.
      const product = state.productsById.get(Number(productId));
      // Si el producto no existe o se eliminó, se omite devolviendo null y después se filtra en la siguiente etapa.
      if (!product) return null;

      // Sino Devuelve un objeto CartItem con la información necesaria para renderizar la vista del carrito, incluyendo el productId, nombre, precio unitario, cantidad y la imagen del producto.
      return {
        productId: product.id,
        nombre: product.nombre,
        precioUnitario: product.precio,
        cantidad,
        imagen: product.imagen,
      };
    })
    // Valida que el resultado del mapeo sea un CartItem válido (no null) antes de incluirlo en el array final, asegurando que solo se rendericen productos que existen en el estado actual.
    .filter((item): item is CartItem => item !== null);
};

// 4) Render principal

const getLineSubtotal = (precioUnitario: number, cantidad: number): number => {
  return precioUnitario * cantidad;
};

// Función para actualizar los totales del carrito (subtotal y total), que se llama cada vez que se renderiza la vista del carrito, calculando el subtotal de cada línea (producto) y el total general sumando los subtotales. Finalmente actualiza el contenido en la interfaz de usuario.

const updateTotals = (items: CartItem[]): void => {

  // Subfunción para calcular el subtotal de una línea del carrito, multiplicando el precio unitario por la cantidad de ese producto en el carrito.
  const lines = items.map((item) => { // Mapea cada item del carrito a un objeto que incluye el subtotal de esa línea
    const subtotal = getLineSubtotal(item.precioUnitario, item.cantidad); // Calcula el subtotal de la línea multiplicando el precio unitario por la cantidad

    // Devuelve un objeto con la información del item y su subtotal
    return {
      productId: item.productId,
      nombre: item.nombre,
      precioUnitario: item.precioUnitario,
      cantidad: item.cantidad,
      subtotal,
    };
  });

  // Subfunción para calcular el total general del carrito sumando los subtotales de cada línea, utilizando el método reduce para acumular el total a partir de los subtotales calculados previamente.
  const total = items.reduce((acc, item) => {
    // Acumulador que suma el subtotal de cada línea al total general, utilizando la función getLineSubtotal para calcular el subtotal de cada línea a partir del precio unitario y la cantidad.
    return acc + getLineSubtotal(item.precioUnitario, item.cantidad);
  }, 0); // El segundo argumento (0) es el valor inicial del acumulador, que arranca en 0 y se va sumando con cada subtotal de línea para obtener el total general del carrito.

  // Formateo de totales a formato de moneda ARS utilizando la función formatPrice
  cartSubtotal.textContent = formatPrice(total);
  cartTotal.textContent = formatPrice(total);

  console.log("[store-cart] Totales actualizados", {
    lines,
    total,
  });
};

const createCartItemTemplate = (item: CartItem): string => {
  const product = state.productsById.get(item.productId);
  const category = product?.categoriaDto?.nombre || "Sin categoria";
  const lineSubtotal = getLineSubtotal(item.precioUnitario, item.cantidad);
  const imageSrc = item.imagen && item.imagen.startsWith("http") ? item.imagen : `/images/${item.imagen || 'placeholder.jpg'}`;

  return [
    '<li class="cart-product">',
    '  <div class="cart-product__main">',
    `    <img class="cart-product__image" src="${imageSrc}" alt="${item.nombre}" />`,
    '    <div class="cart-product__info">',
    `      <span class="cart-product__category">${category}</span>`,
    `      <span class="cart-product__name">${item.nombre}</span>`,
    `      <span class="cart-product__subtotal">${formatPrice(item.precioUnitario)} c/u</span>`,
    "    </div>",
    "  </div>",
    '  <div class="cart-product__actions">',
    '    <div class="cart-product__quantity" aria-label="Control de cantidad">',
    `      <button class="cart-product__quantity-btn" type="button" data-action="decrease" data-product-id="${item.productId}" aria-label="Restar unidad">-</button>`,
    `      <span class="cart-product__quantity-value" aria-live="polite">${item.cantidad}</span>`,
    `      <button class="cart-product__quantity-btn" type="button" data-action="increase" data-product-id="${item.productId}" aria-label="Sumar unidad">+</button>`,
    "    </div>",
    `    <span class="cart-product__subtotal">${formatPrice(lineSubtotal)}</span>`,
    `    <button class="cart-product__remove-btn" type="button" data-action="remove" data-product-id="${item.productId}">Eliminar</button>`,
    "  </div>",
    "</li>",
  ].join("");
};

const renderCartItems = (items: CartItem[]): void => {
  cartItemsList.innerHTML = items.map(createCartItemTemplate).join("");
};

// 5) Estado vacío

const toggleEmptyState = (hasItems: boolean): void => {
  if (hasItems) {
    cartItemsContainer.hidden = false;
    cartEmpty.hidden = true;
    checkoutBtn.disabled = false;
    console.log("[store-cart] Estado de vista", { hasItems: true });
    return;
  }

  cartItemsContainer.hidden = true;
  cartEmpty.hidden = false;
  checkoutBtn.disabled = true;
  console.log("[store-cart] Estado de vista", { hasItems: false });
};

// Función que orquesta las opraciones de renderizado para actualizar completamente la vista del carrito. Garantiza que la interfaz de usuario esté sincronizada con el estado actual del carrito
const renderCartView = (): void => {
  // Variable que usa la función auxiliar toRenderableItems para convertir el estado del carrito (CartMap) en un array de CartItem, que es una estructura más adecuada para renderizar la vista del carrito, ya que incluye información detallada de cada producto (nombre, precio unitario, imagen) además de la cantidad.
  const renderableItems = toRenderableItems(state.items);
  const hasItems = renderableItems.length > 0; // Variable que almacena el resultado de la determinación si el carrito tiene items para mostrar la vista correspondiente (vacía o con productos)

  console.log("[store-cart] Render de carrito", {
    storedItems: state.items,
    renderableItems: renderableItems.length,
    hasItems,
  });

  toggleEmptyState(hasItems); // Ejecuta la función auxiliar que muestra u oculta la vista de carrito vacío o con productos según el estado actual del carrito (si tiene items o no)
  syncCartCount(); // Ejecuta la función auxiliar que sincroniza el contador visual del carrito en la UI con la cantidad total de unidades en el carrito, sumando las cantidades de todos los productos.

  // Si no hay items para mostrar, limpia el contenedor de items del carrito y actualiza los totales a $0, evitando renderizar la lista de productos y mostrando la vista de carrito vacío.
  if (!hasItems) {
    cartItemsList.innerHTML = "";
    cartSubtotal.textContent = formatPrice(0);
    cartTotal.textContent = formatPrice(0);
    return;
  }

  // Funciones auxiliares que renderizan la lista de productos en el carrito y actualizan los totales (subtotal y total) según el estado actual del carrito
  renderCartItems(renderableItems);
  updateTotals(renderableItems);
};

// 6) Interacciones

const increaseItemQuantity = (productId: string): void => {
  const previousQuantity = state.items[productId] ?? 0;
  const product = state.productsById.get(Number(productId));
  
  if (!product) return;

  if (previousQuantity >= product.stock) {
    alert("No hay suficiente stock para este producto.");
    return;
  }

  if (!state.items[productId]) {
    state.items[productId] = 1;
  } else {
    state.items[productId] += 1;
  }

  console.log("[store-cart] Cantidad aumentada", {
    productId,
    previousQuantity,
    newQuantity: state.items[productId],
  });
};

const decreaseItemQuantity = (productId: string): void => {
  const current = state.items[productId];
  if (!current) return;

  if (current <= 1) {
    delete state.items[productId];

    console.log("[store-cart] Cantidad disminuida y producto eliminado", {
      productId,
      previousQuantity: current,
      newQuantity: 0,
    });
    return;
  }

  state.items[productId] = current - 1;

  console.log("[store-cart] Cantidad disminuida", {
    productId,
    previousQuantity: current,
    newQuantity: state.items[productId],
  });
};

const removeItem = (productId: string): void => {
  const previousQuantity = state.items[productId] ?? 0;
  delete state.items[productId];

  console.log("[store-cart] Producto eliminado", {
    productId,
    previousQuantity,
    items: state.items,
  });
};

cartItemsList.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const action = target.getAttribute("data-action");
  const productId = target.getAttribute("data-product-id");

  if (!action || !productId) return;

  console.log("[store-cart] Accion detectada", {
    action,
    productId,
  });

  if (action === "increase") {
    increaseItemQuantity(productId);
  }

  if (action === "decrease") {
    decreaseItemQuantity(productId);
  }

  if (action === "remove") {
    removeItem(productId);
  }

  persistCart();
  renderCartView();
});

clearCartBtn.addEventListener("click", () => {
  const previousItems = { ...state.items };
  state.items = {};
  clearCart();
  console.log("[store-cart] Carrito vaciado", {
    previousItems,
    removedItemsCount: Object.keys(previousItems).length,
  });
  renderCartView();
});

checkoutBtn.addEventListener("click", async () => {
  const userStr = getUSer();
  if (!userStr) {
    alert("Debes iniciar sesión para confirmar el pedido.");
    window.location.href = "/src/pages/auth/login/login.html";
    return;
  }

  const user: IUser = JSON.parse(userStr);
  const detalles = Object.entries(state.items).map(([id, qty]) => ({
    cantidad: qty,
    idProducto: Number(id),
  }));

  const payload = {
    estado: "PENDIENTE",
    formaPago: formaPagoSelect.value,
    detalles,
    idUsuario: user.id
  };

  try {
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Procesando...";

    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Error al realizar el pedido");
    }

    state.items = {};
    clearCart();
    renderCartView();
    
    if (checkoutFeedback) {
      checkoutFeedback.style.display = "block";
    }
    
    setTimeout(() => {
      window.location.href = "../../client/orders/orders.html";
    }, 2000);

  } catch (error) {
    console.error(error);
    alert("Hubo un error al procesar el pedido. Por favor, intentalo de nuevo.");
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Finalizar compra";
  }
});

const loadData = async () => {
  try {
    const res = await fetch("/api/productos");
    if (!res.ok) throw new Error("Error al obtener productos");

    const products: Product[] = await res.json();
    state.productsById = new Map(products.map(p => [p.id, p]));
    renderCartView(); // Renderizado del estado actual del carrito
  } catch (error) {
    console.error(error);
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = "<p>Error al cargar el carrito. Intente recargar la página.</p>";
    }
  }
};

loadData();