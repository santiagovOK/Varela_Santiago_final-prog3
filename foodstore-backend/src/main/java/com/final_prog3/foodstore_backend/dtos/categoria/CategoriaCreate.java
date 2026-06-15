package com.final_prog3.foodstore_backend.dtos.categoria;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.entities.Categoria;
import jakarta.validation.constraints.NotBlank;

public record CategoriaCreate(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        String descripcion
) {
    public Categoria toEntity() {
        // Lo correcto es llamar a Categoria usando `.builder` (patrón builder), ya que las entidades usan Lombok. Esto es distinto en el video demostrativo, ya que la entidad no está gestionada con Lombok.
        return Categoria.builder()
                .nombre(this.nombre)
                .descripcion(this.descripcion)
                // Utilizamos el patrón Builder de Lombok (es más seguro y limpio que invocar constructores complejos)
                .build();
    }
}