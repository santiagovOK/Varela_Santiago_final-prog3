package com.final_prog3.foodstore_backend.dtos.pedido;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.enums.Estado;
import jakarta.validation.constraints.NotNull;

// TPI: Nuevo DTO para validar y recibir de forma limpia el Estado
public record PedidoStatusEdit(
        @NotNull(message = "El estado es obligatorio")
        Estado estado
) {}
