package com.final_prog3.foodstore_backend.dtos.producto;

import com.final_prog3.foodstore_backend.entities.Producto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductoCreate(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        @NotNull(message = "El precio es obligatorio")
        @Min(value = 0, message = "El precio no puede ser negativo")
        Double precio,
        String descripcion,
        @Min(value = 0, message = "El stock no puede ser negativo")
        int stock,
        String imagen,
        boolean disponible,
        @NotNull(message = "La categoría es obligatoria")
        Long idCategoria
) {
    public Producto toEntity() {
        return Producto.builder()
                .nombre(this.nombre)
                .precio(this.precio)
                .descripcion(this.descripcion)
                .stock(this.stock)
                .imagen(this.imagen)
                .disponible(this.disponible)
                // La categoría se asignará en el servicio, ya que necesitamos cargar la entidad completa de la categoría a partir del idCategoria
                .build();
    }
}
