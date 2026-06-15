package com.final_prog3.foodstore_backend.config;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// TPI: Creación de la clase WebConfig para centralizar la lógica relacionada con la anotación @CrossOrigin para una correcta vinculación del fronted con Vite y el backend.
// Si esta clase y su método no estuviesen configurados, habría que usar @CrossOrigin en cada uno de los controladores para garantizar el permiso del navegador para que Vite pueda usar las operaciones con la API exigidas en el TPI. También esto facilita el cambio de puerto de ser necesario.

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // TPI: Puerto usual para Vite, que para el caso de este proyecto es el mismo.
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
