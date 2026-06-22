import { runRouteGuard } from "../../../main";
import { checkAuhtUser, logout } from "../../../utils/auth";
import type { ICategory } from "../../../types/categoria";

// TPI: Proteger ruta de admin categories
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
const tableBody = document.getElementById("categoriesTableBody") as HTMLTableSectionElement;
const btnNewCategory = document.getElementById("btnNewCategory") as HTMLButtonElement;
const categoryModal = document.getElementById("categoryModal") as HTMLDialogElement;
const btnCancelModal = document.getElementById("btnCancelModal") as HTMLButtonElement;
const categoryForm = document.getElementById("categoryForm") as HTMLFormElement;
const modalTitle = document.getElementById("modalTitle") as HTMLHeadingElement;

const categoryIdInput = document.getElementById("categoryId") as HTMLInputElement;
const categoryNameInput = document.getElementById("categoryName") as HTMLInputElement;
const categoryDescInput = document.getElementById("categoryDesc") as HTMLInputElement;

// Estado
let categories: ICategory[] = [];

// API calls
const fetchCategories = async () => {
    try {
        const res = await fetch("/api/categorias");
        if (!res.ok) throw new Error("Error fetching categories");
        categories = await res.json();
        renderTable();
    } catch (error) {
        console.error("Error:", error);
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--color-error); padding: 2rem; font-size: 1.4rem;">Error al cargar las categorías. Verifique el backend.</td></tr>`;
        }
    }
};

const createCategory = async (data: { nombre: string; descripcion: string }) => {
    try {
        const res = await fetch("/api/categorias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log("[admin/categories.ts] Categoría creada con éxito:", data.nombre);
        await fetchCategories();
    } catch (error) {
        console.error("[admin/categories.ts] Error creando categoría:", error);
        throw error;
    }
};

const updateCategory = async (id: number, data: { nombre: string; descripcion: string }) => {
    try {
        const res = await fetch(`/api/categorias/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log(`[admin/categories.ts] Categoría ID ${id} actualizada con éxito.`);
        await fetchCategories();
    } catch (error) {
        console.error(`[admin/categories.ts] Error actualizando categoría ID ${id}:`, error);
        throw error;
    }
};

const deleteCategory = async (id: number) => {
    try {
        const res = await fetch(`/api/categorias/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log(`[admin/categories.ts] Categoría ID ${id} eliminada con éxito.`);
        await fetchCategories();
    } catch (error) {
        console.error(`[admin/categories.ts] Error eliminando categoría ID ${id}:`, error);
        throw error;
    }
};

// Render
const renderTable = () => {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (categories.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem; font-size: 1.4rem;">No hay categorías registradas</td></tr>`;
        return;
    }

    categories.forEach(cat => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.nombre}</td>
            <td>${cat.descripcion}</td>
            <td class="actions-cell">
                <button class="btn btn-sm btn--secondary btn-edit" data-id="${cat.id}">Editar</button>
                <button class="btn btn-sm btn--danger btn-delete" data-id="${cat.id}">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(tr);
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
            if (confirm("¿Estás seguro de que deseas eliminar esta categoría? Esto podría afectar a los productos asociados.")) {
                try {
                    await deleteCategory(id);
                } catch (err) {
                    alert("Error al eliminar la categoría. Revise la consola para más detalles.");
                    console.error(err);
                }
            }
        });
    });
};

// Modal handlers
const openCreateModal = () => {
    modalTitle.textContent = "Nueva Categoría";
    categoryForm.reset();
    categoryIdInput.value = "";
    categoryModal.showModal();
};

const openEditModal = (id: number) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    
    modalTitle.textContent = "Editar Categoría";
    categoryIdInput.value = cat.id.toString();
    categoryNameInput.value = cat.nombre;
    categoryDescInput.value = cat.descripcion;
    categoryModal.showModal();
};

// Event Listeners estáticos
btnNewCategory?.addEventListener("click", openCreateModal);

btnCancelModal?.addEventListener("click", () => {
    categoryModal.close();
});

// Cerrar modal al hacer clic afuera
categoryModal?.addEventListener("click", (e) => {
    const dialogDimensions = categoryModal.getBoundingClientRect();
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        categoryModal.close();
    }
});

categoryForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const data = {
        nombre: categoryNameInput.value.trim(),
        descripcion: categoryDescInput.value.trim()
    };
    
    try {
        if (categoryIdInput.value) {
            await updateCategory(Number(categoryIdInput.value), data);
        } else {
            await createCategory(data);
        }
        categoryModal.close();
    } catch (error) {
        console.error(error);
        alert("Error al guardar la categoría. Verifique que los datos sean correctos.");
    }
});

// Iniciar
fetchCategories();
console.log("[admin/categories.ts] Admin Categorías inicializado.");
