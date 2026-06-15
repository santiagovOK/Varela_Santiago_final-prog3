package com.final_prog3.foodstore_backend.dtos.producto;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaDto;
import com.final_prog3.foodstore_backend.entities.Producto;

public record ProductoDto(
        Long id,
        String nombre,
        Double precio,
        String descripcion,
        int stock,
        String imagen,
        boolean disponible,
        CategoriaDto categoriaDto
) {

    public static ProductoDto toDto(Producto producto) {
        return new ProductoDto(
                producto.getId(),
                producto.getNombre(),
                producto.getPrecio(),
                producto.getDescripcion(),
                producto.getStock(),
                producto.getImagen(),
                producto.isDisponible(),
                producto.getCategoria() != null ? CategoriaDto.toDto(producto.getCategoria()) : null
        );
    }
}
