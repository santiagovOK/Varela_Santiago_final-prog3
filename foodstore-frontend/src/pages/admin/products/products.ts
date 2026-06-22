import { runRouteGuard } from "../../../main";
import { checkAuhtUser, logout } from "../../../utils/auth";
import type { Product } from "../../../types/product";
import type { ICategory } from "../../../types/categoria";

// TPI: Proteger ruta de admin products
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
const tableBody = document.getElementById("productsTableBody") as HTMLTableSectionElement;
const btnNewProduct = document.getElementById("btnNewProduct") as HTMLButtonElement;
const productModal = document.getElementById("productModal") as HTMLDialogElement;
const btnCancelModal = document.getElementById("btnCancelModal") as HTMLButtonElement;
const productForm = document.getElementById("productForm") as HTMLFormElement;
const modalTitle = document.getElementById("modalTitle") as HTMLHeadingElement;

const productIdInput = document.getElementById("productId") as HTMLInputElement;
const productNameInput = document.getElementById("productName") as HTMLInputElement;
const productCategorySelect = document.getElementById("productCategory") as HTMLSelectElement;
const productDescInput = document.getElementById("productDesc") as HTMLTextAreaElement;
const productPriceInput = document.getElementById("productPrice") as HTMLInputElement;
const productStockInput = document.getElementById("productStock") as HTMLInputElement;
const productImageInput = document.getElementById("productImage") as HTMLInputElement;
const productAvailableInput = document.getElementById("productAvailable") as HTMLInputElement;

// Estado
let products: Product[] = [];
let categories: ICategory[] = [];

// API calls
const fetchData = async () => {
    try {
        const [resProducts, resCategories] = await Promise.all([
            fetch("/api/productos"),
            fetch("/api/categorias")
        ]);

        if (!resProducts.ok || !resCategories.ok) throw new Error("Error fetching datos");

        products = await resProducts.json();
        categories = await resCategories.json();

        populateCategoriesSelect();
        renderTable();
    } catch (error) {
        console.error("[admin/products.ts] Error al inicializar datos:", error);
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--color-error); padding: 2rem; font-size: 1.4rem;">Error al cargar los productos. Verifique el backend.</td></tr>`;
        }
    }
};

const populateCategoriesSelect = () => {
    productCategorySelect.innerHTML = '<option value="">Seleccione una categoría</option>';
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id.toString();
        option.textContent = cat.nombre;
        productCategorySelect.appendChild(option);
    });
};

const createProduct = async (data: any) => {
    try {
        const res = await fetch("/api/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log("[admin/products.ts] Producto creado con éxito:", data.nombre);
        await fetchData(); // Refrescar para consistencia
    } catch (error) {
        console.error("[admin/products.ts] Error creando producto:", error);
        throw error;
    }
};

const updateProduct = async (id: number, data: any) => {
    try {
        const res = await fetch(`/api/productos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log(`[admin/products.ts] Producto ID ${id} actualizado con éxito.`);
        await fetchData();
    } catch (error) {
        console.error(`[admin/products.ts] Error actualizando producto ID ${id}:`, error);
        throw error;
    }
};

const deleteProduct = async (id: number) => {
    try {
        const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log(`[admin/products.ts] Producto ID ${id} eliminado con éxito.`);
        await fetchData();
    } catch (error) {
        console.error(`[admin/products.ts] Error eliminando producto ID ${id}:`, error);
        throw error;
    }
};

// Render
const renderTable = () => {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; font-size: 1.4rem;">No hay productos registrados</td></tr>`;
        return;
    }

    products.forEach(prod => {
        const tr = document.createElement("tr");
        
        // El backend retorna un categoriaDto
        const catName = prod.categoriaDto ? prod.categoriaDto.nombre : "-";
        
        const badgeClass = prod.disponible ? 'badge--active' : 'badge--inactive';
        const badgeText = prod.disponible ? 'Disponible' : 'Agotado/Oculto';

        const imageSrc = prod.imagen && prod.imagen.startsWith("http") ? prod.imagen : `/images/${prod.imagen || 'placeholder.webp'}`;

        tr.innerHTML = `
            <td>
                <img src="${imageSrc}" alt="${prod.nombre}" class="product-thumbnail">
            </td>
            <td>${prod.id}</td>
            <td>${prod.nombre}</td>
            <td>${catName}</td>
            <td>$${prod.precio.toLocaleString()}</td>
            <td>${prod.stock}</td>
            <td><span class="badge ${badgeClass}">${badgeText}</span></td>
            <td class="actions-cell">
                <button class="btn btn-sm btn--secondary btn-edit" data-id="${prod.id}">Editar</button>
                <button class="btn btn-sm btn--danger btn-delete" data-id="${prod.id}">Eliminar</button>
            </td>
        `;
        
        tableBody.appendChild(tr);

        // Reemplazo del atributo obsoleto 'onerror' por un EventListener moderno
        const imgElement = tr.querySelector('.product-thumbnail') as HTMLImageElement;
        if (imgElement) {
            imgElement.addEventListener('error', () => {
                imgElement.src = '/images/placeholder.webp';
            }, { once: true });
        }
    });

    // Añadir event listeners a los botones generados
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number((e.target as HTMLButtonElement).dataset.id);
            openEditModal(id);
        });
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = Number((e.target as HTMLButtonElement).dataset.id);
            if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
                try {
                    await deleteProduct(id);
                } catch (err) {
                    alert("Error al eliminar el producto. Revise la consola para más detalles.");
                }
            }
        });
    });
};

// Modal handlers
const openCreateModal = () => {
    modalTitle.textContent = "Nuevo Producto";
    productForm.reset();
    productIdInput.value = "";
    productAvailableInput.checked = true;
    productModal.showModal();
};

const openEditModal = (id: number) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    
    modalTitle.textContent = "Editar Producto";
    productIdInput.value = prod.id.toString();
    productNameInput.value = prod.nombre;
    productDescInput.value = prod.descripcion;
    productPriceInput.value = prod.precio.toString();
    productStockInput.value = prod.stock.toString();
    productImageInput.value = prod.imagen;
    productAvailableInput.checked = prod.disponible;
    
    // Set select value if category exists
    if (prod.categoriaDto) {
        productCategorySelect.value = prod.categoriaDto.id.toString();
    } else {
        productCategorySelect.value = "";
    }

    productModal.showModal();
};

// Event Listeners estáticos
btnNewProduct?.addEventListener("click", openCreateModal);

btnCancelModal?.addEventListener("click", () => {
    productModal.close();
});

// Cerrar modal al hacer clic afuera
productModal?.addEventListener("click", (e) => {
    const dialogDimensions = productModal.getBoundingClientRect();
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        productModal.close();
    }
});

productForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const data = {
        nombre: productNameInput.value.trim(),
        precio: parseFloat(productPriceInput.value),
        descripcion: productDescInput.value.trim(),
        stock: parseInt(productStockInput.value),
        imagen: productImageInput.value.trim(),
        disponible: productAvailableInput.checked,
        idCategoria: parseInt(productCategorySelect.value)
    };
    
    try {
        if (productIdInput.value) {
            await updateProduct(Number(productIdInput.value), data);
        } else {
            await createProduct(data);
        }
        productModal.close();
    } catch (error) {
        console.error(error);
        alert("Error al guardar el producto. Verifique que los datos sean correctos.");
    }
});

// Iniciar
fetchData();
console.log("[admin/products.ts] Admin Productos inicializado.");
