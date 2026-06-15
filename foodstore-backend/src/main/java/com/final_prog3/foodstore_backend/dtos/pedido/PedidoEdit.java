package com.final_prog3.foodstore_backend.dtos.pedido;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.entities.Pedido;
import com.final_prog3.foodstore_backend.enums.Estado;
import com.final_prog3.foodstore_backend.enums.FormaPago;

public record PedidoEdit(
        Estado estado,
        FormaPago formaPago
) {
    public void applyTo(Pedido pedido) {
        if (this.estado != null) {
            pedido.setEstado(this.estado);
        }
        if (this.formaPago != null) {
            pedido.setFormaPago(this.formaPago);
        }
    }
}
