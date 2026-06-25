import { getCart, saveCart, getUSer, removeUser, type CartMap } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import type { Product } from "../../../types/product";

// TPI: Creación de productDetail.ts para implementar el funcionamiento dinámico del Detalle del Producto, solicitado en las consignas del TPI y en la estructura del proyecto

// TPI: Referencias al DOM

// Obtenemos los contenedores principales donde inyectaremos la informacion de detalle y el contador del carrito.
const detailContainer = document.getElementById("detail-container") as HTMLElement;
const cartCount = document.getElementById("cart-count") as HTMLSpanElement;

const userNameDisplay = document.getElementById("user-name-display") as HTMLSpanElement | null;
const adminLinkContainer = document.getElementById("admin-link-container") as HTMLLIElement | null;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement | null;

if (!detailContainer || !cartCount || !userNameDisplay || !logoutBtn) {
  throw new Error("Faltan elementos del DOM en la vista store/productDetail.");
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

logoutBtn.addEventListener("click", () => {
    removeUser();
    navigate("/src/pages/auth/login/login.html");
});

// Utilizamos URLSearchParams para extraer el parámetro 'id' de la URL actual
// Esto nos indica qué producto se debe ir a buscar al backend.
const urlParams = new URLSearchParams(window.location.search);
const productIdStr = urlParams.get("id");

// TPI: Funciones auxiliares (Helpers)

// Helper para calcular el número total de unidades en el carrito actual
const getTotalUnits = (items: CartMap): number => {
  return Object.values(items).reduce((acc, qty) => acc + qty, 0);
};

// Sincronización del contador del carrito en el navbar a partir del localStorage
const syncCartCountFromStorage = (): void => {
  const cart = getCart();
  const totalUnits = getTotalUnits(cart);
  cartCount.textContent = String(totalUnits);
  
  console.log("[store-product-detail] Contador de carrito sincronizado", {
    totalUnits,
    cart,
  });
};

// Formatea un valor numérico a moneda ARS
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
};

// TPI: Lógica de renderizado

// Renderiza un mensaje de error en caso de que el producto no exista / falle la API.
const renderError = (message: string) => {
  detailContainer.innerHTML = `
    <div class="product-detail__message">
      <h2>Error</h2>
      <p>${message}</p>
      <a class="product-detail__back-link" href="../home/home.html">Volver al catalogo</a>
    </div>
  `;
};

// Renderización de la vista principal del detalle del producto utilizando clases BEM y estructura flex.
const renderProduct = (product: Product) => {
  // Verificamos y armamos la ruta de la imagen
  const imageSrc = product.imagen && product.imagen.startsWith("http") 
    ? product.imagen 
    : `/images/${product.imagen || 'placeholder.jpg'}`;
  
  // Determinamos las clases y textos para el estado del stock
  const isAvailable = product.stock > 0;
  const stockClass = isAvailable ? "product-detail__stock--available" : "product-detail__stock--unavailable";
  const stockText = isAvailable ? `Stock disponible: ${product.stock}` : "Sin stock";
  
  // Inyectamos el HTML usando template strings
  detailContainer.innerHTML = `
    <a class="product-detail__back-link" href="../home/home.html">&larr; Volver al catálogo</a>
    
    <article class="product-detail__card">
      <div class="product-detail__media">
        <img class="product-detail__image" src="${imageSrc}" alt="${product.nombre}" />
      </div>
      
      <div class="product-detail__info">
        <h1 class="product-detail__title">${product.nombre}</h1>
        <p class="product-detail__description">${product.descripcion}</p>
        <p class="product-detail__price">${formatPrice(product.precio)}</p>
        
        <div class="product-detail__stock-container">
          <p class="product-detail__stock ${stockClass}">
            ${stockText}
          </p>
        </div>
        
        <div class="product-detail__actions">
          <input 
            class="product-detail__qty-input" 
            type="number" 
            id="qty-input" 
            min="1" 
            max="${product.stock}" 
            value="1" 
            ${!isAvailable ? 'disabled' : ''} 
          />
          <button 
            class="product-detail__add-btn" 
            id="add-to-cart-btn" 
            ${!isAvailable ? 'disabled' : ''}
          >
            Añadir a carrito
          </button>
        </div>
        
        <p class="product-detail__feedback" id="add-feedback">Producto añadido al carrito exitosamente.</p>
      </div>
    </article>
  `;

  // Agregamos listeners a los botones solo si hay stock
  if (isAvailable) {
    const addBtn = document.getElementById("add-to-cart-btn") as HTMLButtonElement;
    const qtyInput = document.getElementById("qty-input") as HTMLInputElement;
    const feedback = document.getElementById("add-feedback") as HTMLParagraphElement;

    // Listener para el botón "Añadir a carrito"
    addBtn.addEventListener("click", () => {
      const qty = parseInt(qtyInput.value, 10);
      
      console.log("[store-product-detail] Intento de agregar al carrito", {
        productId: product.id,
        requestedQty: qty,
        availableStock: product.stock
      });
      
      // Validamos que la cantidad no exceda el stock máximo
      if (qty > 0 && qty <= product.stock) {
        // Agregamos la cantidad solicitada al carrito guardado
        const cart = getCart();
        const prev = cart[product.id] || 0;
        cart[product.id] = prev + qty;
        
        console.log("[store-product-detail] Producto agregado exitosamente", {
          productId: product.id,
          previousQuantity: prev,
          newQuantity: cart[product.id]
        });
        
        // Guardamos el nuevo estado y sincronizamos UI
        saveCart(cart);
        syncCartCountFromStorage();
        
        // Mostramos feedback de éxito temporal
        feedback.style.display = "block";
        setTimeout(() => feedback.style.display = "none", 3000);
      } else {
        console.warn("[store-product-detail] Validacion fallida de cantidad", {
          requestedQty: qty,
          availableStock: product.stock
        });
        alert("Cantidad invalida o supera el stock disponible.");
      }
    });
  }
};

// TPI: Inicialización e interacciones con la API

// Función principal que se ejecuta al cargar la página.
const loadProduct = async () => {
  // Si no hay id en la URL, mostramos error
  if (!productIdStr) {
    console.error("[store-product-detail] No se encontro ID de producto en la URL");
    renderError("No se especificó un producto.");
    return;
  }
  
  console.log("[store-product-detail] Iniciando carga de producto", { productIdStr });

  try {
    // Solicitamos los datos del producto puntual a la API
    const res = await fetch(`/api/productos/${productIdStr}`);
    
    // Si la respuesta no es OK, manejamos los diferentes errores HTTP
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`[store-product-detail] Producto no encontrado (HTTP 404)`, { productIdStr });
        renderError("El producto no fue encontrado en la base de datos.");
      } else {
        console.error(`[store-product-detail] Error del servidor (HTTP ${res.status})`);
        renderError("Error al conectar con el servidor.");
      }
      return;
    }

    // Parseamos a JSON y tipamos con la interfaz Product
    const product: Product = await res.json();
    
    console.log("[store-product-detail] Producto cargado exitosamente", { product });
    
    // Renderizamos la vista de éxito
    renderProduct(product);
  } catch (err) {
    console.error("[store-product-detail] Fallo inesperado del servidor o red:", err);
    renderError("Error inesperado al obtener la información del producto.");
  }
};

// Se ejecutan al inicio para actualizar la UI según los datos en caché y red.
syncCartCountFromStorage();
loadProduct();
