import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    port: 5173,
    open: "/src/pages/auth/login/login.html",
    // TPI: se añade un proxy para que todas las peticiones que el frontend haga hacia /api sean redirigidas internamente al puerto donde corre Spring Boot (8080), evitando posibles problemas.
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "src/pages/store/home/home.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        cart: resolve(__dirname, "src/pages/store/cart/cart.html"),
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        clientHome: resolve(__dirname, "src/pages/client/home/home.html"),
        adminCategories: resolve(__dirname, "src/pages/admin/categories/categories.html"),
        adminProducts: resolve(__dirname, "src/pages/admin/products/products.html"),
        adminOrders: resolve(__dirname, "src/pages/admin/orders/orders.html"),
        productDetail: resolve(__dirname, "src/pages/store/productDetail/productDetail.html"),
        clientOrders: resolve(__dirname, "src/pages/client/orders/orders.html"),
      },
    },
  },
});