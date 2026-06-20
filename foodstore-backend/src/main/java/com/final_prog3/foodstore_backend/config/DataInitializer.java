package com.final_prog3.foodstore_backend.config;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

import com.final_prog3.foodstore_backend.service.UsuarioService;
import com.final_prog3.foodstore_backend.service.CategoriaService;
import com.final_prog3.foodstore_backend.service.ProductoService;
import com.final_prog3.foodstore_backend.service.PedidoService;

import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioCreate;
import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioDto;
import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaCreate;
import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaDto;
import com.final_prog3.foodstore_backend.dtos.producto.ProductoCreate;
import com.final_prog3.foodstore_backend.dtos.producto.ProductoDto;
import com.final_prog3.foodstore_backend.dtos.pedido.PedidoCreate;
import com.final_prog3.foodstore_backend.dtos.detallePedido.DetallePedidoCreate;

import com.final_prog3.foodstore_backend.enums.Rol;
import com.final_prog3.foodstore_backend.enums.Estado;
import com.final_prog3.foodstore_backend.enums.FormaPago;

import java.util.List;

// Prioricé la creación de DataInitializer para la instanciación en general porque es más adecuado respecto al uso de @PostConstruct y @Component. Así, se prioriza la correcta distinción del ciclo de vida de los componentes y la delegación de configuraciones, dejando Main (SpringbootApplication) limpio.

@Component
public class DataInitializer {

    private final UsuarioService usuarioService;
    private final CategoriaService categoriaService;
    private final ProductoService productoService;
    private final PedidoService pedidoService;

    // Aplicamos inyección de dependencias por constructor como exigen las consignas
    public DataInitializer(
            UsuarioService usuarioService,
            CategoriaService categoriaService,
            ProductoService productoService,
            PedidoService pedidoService) {
        this.usuarioService = usuarioService;
        this.categoriaService = categoriaService;
        this.productoService = productoService;
        this.pedidoService = pedidoService;
    }

    // Usamos @PostConstruct tal cual indica el material teórico para ejecutar lógica inicial
    @PostConstruct
    public void initData() {
        System.out.println("------ INICIALIZANDO BASE DE DATOS ------");

        // 1. Instanciar Usuarios (desde usuarios.json)
        UsuarioDto admin = usuarioService.save(new UsuarioCreate("Admin", "Sistema", "admin@admin.com", "1145678901", "123456", Rol.ADMIN));
        UsuarioDto cliente = usuarioService.save(new UsuarioCreate("Juan", "Pérez", "cliente@food.com", "1198765432", "cliente123", Rol.USUARIO));

        // 2. Instanciar Categorías (desde categorias.json)
        CategoriaDto c1 = categoriaService.save(new CategoriaCreate("Hamburguesas", "Hamburguesas artesanales con carne premium"));
        CategoriaDto c2 = categoriaService.save(new CategoriaCreate("Pizzas", "Pizzas al horno de barro"));
        CategoriaDto c3 = categoriaService.save(new CategoriaCreate("Empanadas", "Empanadas caseras horneadas"));
        CategoriaDto c4 = categoriaService.save(new CategoriaCreate("Bebidas", "Bebidas frías y calientes"));
        CategoriaDto c5 = categoriaService.save(new CategoriaCreate("Papas Fritas", "Acompañamientos crujientes"));

        // 3. Instanciar Productos (desde productos.json)
        ProductoDto p1 = productoService.save(new ProductoCreate("Hamburguesa Clásica", 4500.0, "Carne 150g, lechuga, tomate, cebolla morada y mayonesa", 50, "burger.webp", true, c1.id()));
        ProductoDto p2 = productoService.save(new ProductoCreate("Hamburguesa Doble", 6200.0, "Doble carne 150g c/u, cheddar, panceta y salsa barbacoa", 40, "burger.webp", true, c1.id()));
        ProductoDto p3 = productoService.save(new ProductoCreate("Hamburguesa Completa", 5500.0, "Carne 150g, huevo, jamón, queso, lechuga y tomate", 30, "burger.webp", true, c1.id()));
        ProductoDto p4 = productoService.save(new ProductoCreate("Hamburguesa Veggie", 5000.0, "Medallón de lentejas y quinoa, rúcula, tomato confitado y hummus", 20, "https://imgs.search.brave.com/vUU8kRyBw8UOoDFUuZja2znED53OJK7yhKK0fOgySrg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aG9sYS5jb20vaG9y/aXpvbi9sYW5kc2Nh/cGUvNWYyY2RlMjUz/ODExLWhhbWJ1cmd1/ZXNhcy12ZWdnaWVz/LXQuanBnP2ltPVJl/c2l6ZT0oNjQwKSx0/eXBlPWRvd25zaXpl", true, c1.id()));
        
        ProductoDto p5 = productoService.save(new ProductoCreate("Pizza Mozzarella", 3800.0, "Mozzarella, salsa de tomate y orégano", 25, "pizza.jpg", true, c2.id()));
        ProductoDto p6 = productoService.save(new ProductoCreate("Pizza Napolitana", 4500.0, "Mozzarella, rodajas de tomate, ajo, aceitunas y albahaca", 25, "pizza.jpg", true, c2.id()));
        ProductoDto p7 = productoService.save(new ProductoCreate("Pizza Fugazzeta", 4800.0, "Mozzarella, cebolla caramelizada, jamón y aceitunas", 20, "pizza.jpg", true, c2.id()));
        ProductoDto p8 = productoService.save(new ProductoCreate("Pizza Especial", 5200.0, "Mozzarella, pepperoni, morrón, cebolla, huevo y aceitunas", 15, "pizza.jpg", true, c2.id()));
        
        ProductoDto p9 = productoService.save(new ProductoCreate("Empanada de Carne", 1200.0, "Carne picada, cebolla, huevo duro, aceitunas y especias", 100, "https://imgs.search.brave.com/59eMoaWJDRojEIbZWP0bDyOXFyd-uZ67f1Od9J5OdJo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/LmJvbnZpdmV1ci5j/b20vZW1wYW5hZGFz/LWFyZ2VudGluYXMt/ZGUtY2FybmUtZm90/by1jZXJjYS5qcGc", true, c3.id()));
        ProductoDto p10 = productoService.save(new ProductoCreate("Empanada de Pollo", 1200.0, "Pollo desmenuzado, cebolla, morrón y crema", 80, "https://imgs.search.brave.com/rzKU68f-NWlQMA1gEaSdY5ToiVPImNEDEeyt91Mu3V8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c3VwZXJwb2xsby5j/bC9pbWcvcmVjZXRh/cy9lbXBhbmFkYXMt/ZGUtcG9sbG8ud2Vi/cA", true, c3.id()));
        ProductoDto p11 = productoService.save(new ProductoCreate("Empanada Jamón y Queso", 1100.0, "Jamón cocido y mozzarella", 90, "https://imgs.search.brave.com/7oHPZkFZ8_QQGTD7jyuHPv22MkZ0XOCuew9a7chmD3g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucmFwcGkuY29t/LmFyL3Byb2R1Y3Rz/L2Y1MWFiMWI4LTdh/MzUtNGZkZi1hYWRm/LWQyNmJmYjcyYTRk/NS5wbmc_ZD0zMDB4/MzAwJmU9d2VicCZx/PTEw", false, c3.id()));
        ProductoDto p12 = productoService.save(new ProductoCreate("Empanada de Verdura", 1100.0, "Espinaca, acelga, ricota y nuez moscada", 60, "https://imgs.search.brave.com/CFN-cLWHvGEPaFwXsHGF1B06YLGa6dL6reSjESWoM1w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZWNl/dGFzbmF0dXJhLmNv/bS5hci9zaXRlcy9y/ZWNldGFzbmF0dXJh/L2ZpbGVzL25hdHVy/YS1mb3Rvcy13ZWIt/ZW5lcm8tNjU1eDQ3/NWVtcGFuYWRhc19k/ZV92ZXJkdXJhLmpw/Zw", true, c3.id()));
        
        ProductoDto p13 = productoService.save(new ProductoCreate("Coca-Cola 500ml", 1500.0, "Gaseosa Coca-Cola original 500ml", 200, "https://imgs.search.brave.com/mpy_eqy5amQNhruIs_nGxxc5r3OB_e72krEXhJoEY1M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmlhdHJlbnRvLmNv/bS5hci90aHVtYi8w/MDAwMDAwMDAwMDAx/MDY5NTUwMjI1NUEw/NkIzNC0yNjQ0LTRG/ODQtOUZFOS1DMDEz/RjQxMjA5N0EtMS0y/MDEtYV84MDB4ODAw/LmpwZWc", true, c4.id()));
        ProductoDto p14 = productoService.save(new ProductoCreate("Sprite 500ml", 1500.0, "Gaseosa Sprite 500ml", 180, "https://imgs.search.brave.com/A1KRBI3zvXKrym5ebbQizCZ8t2IdCKJF2fxiAastZ1A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/XzcxMTMzNi1NTEE4/OTE0OTYxOTU0M18w/ODIwMjUtVi53ZWJw", true, c4.id()));
        ProductoDto p15 = productoService.save(new ProductoCreate("Agua Mineral 500ml", 1000.0, "Agua mineral sin gas 500ml", 300, "https://dispandistribuidora.agilecdn.com.br/8211_1.jpg?v=338-3114143016", true, c4.id()));
        ProductoDto p16 = productoService.save(new ProductoCreate("Cerveza Artesanal 473ml", 2500.0, "Cerveza artesanal rubia 473ml", 100, "https://imgs.search.brave.com/SpDJCdalR7edohOLzhzqCCD0Qbaz5l-BC07in3yPWXY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9pZGVu/dGlmaWNhY2klQzMl/QjNuLW9zY3VyYS1k/ZS1sYS1jZXJ2ZXph/LWRlbC1hcnRlLWVs/LXZpZHJpby00NDA1/MzcyMC5qcGc", true, c4.id()));
        
        ProductoDto p17 = productoService.save(new ProductoCreate("Papas Fritas Clásicas", 2500.0, "Papas fritas bastón crocantes con sal parrillera", 70, "https://imgs.search.brave.com/in2PgvEBAwflH6lKfKgmkhjM5zsAZt_5CCF9WkXKB1Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzc0LzE4LzIw/LzM2MF9GXzM3NDE4/MjA3N19oS3ZLS2pL/YW5JZkFacW4wSzhV/WUE3M2FIejZGTXo5/dC5qcGc", true, c5.id()));
        ProductoDto p18 = productoService.save(new ProductoCreate("Papas con Cheddar y Panceta", 3500.0, "Papas fritas bañadas en cheddar y panceta crocante", 50, "https://imgs.search.brave.com/tK-SyeGMUaiGUWpfNv8IlBMG7CDpcdQyFoF9zzxS3Os/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tb3Jp/eGUuY29tLmFyL2Zp/bGVzL3JlY2V0YXMv/dGh1bWJzL3BhcGFz/Y2hlZGRhcm1vcml4/ZTAyLmpwZw", true, c5.id()));
        ProductoDto p19 = productoService.save(new ProductoCreate("Aros de Cebolla", 2800.0, "Aros de cebolla empanizados, servidos con salsa barbacoa", 40, "https://imgs.search.brave.com/MbIsq2iRx49GR24H-kWPDldGSqyiU7O9Xzc1JGEw0_Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y2xhcmluLmNvbS9p/bWcvMTk2OS8xMi8z/MS9Ia1JQTEdKRWxf/MTI1Nng2MjBfXzEu/anBnIzE1ODQxMTM5/ODY3NDM", true, c5.id()));

        // 4. Instanciar Pedidos (desde pedidos.json)
        pedidoService.save(new PedidoCreate(Estado.TERMINADO, FormaPago.TARJETA, List.of(
                new DetallePedidoCreate(2, p1.id()),
                new DetallePedidoCreate(2, p15.id())
        ), cliente.id()));

        pedidoService.save(new PedidoCreate(Estado.CONFIRMADO, FormaPago.EFECTIVO, List.of(
                new DetallePedidoCreate(1, p2.id()),
                new DetallePedidoCreate(1, p8.id()),
                new DetallePedidoCreate(2, p17.id())
        ), cliente.id()));

        pedidoService.save(new PedidoCreate(Estado.PENDIENTE, FormaPago.TRANSFERENCIA, List.of(
                new DetallePedidoCreate(3, p9.id()),
                new DetallePedidoCreate(1, p16.id())
        ), cliente.id()));

        System.out.println("------ BASE DE DATOS INICIALIZADA CON EXITO ------");
    }
}
