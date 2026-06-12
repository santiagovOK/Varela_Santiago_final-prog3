package com.final_prog3.foodstore_backend.dtos.pedido;

import com.final_prog3.foodstore_backend.dtos.detallePedido.DetallePedidoCreate;
import com.final_prog3.foodstore_backend.entities.Pedido;
import com.final_prog3.foodstore_backend.enums.Estado;
import com.final_prog3.foodstore_backend.enums.FormaPago;

import java.time.LocalDate;
import java.util.List;

public record PedidoCreate(
        Estado estado,
        FormaPago formaPago,
        List<DetallePedidoCreate> detalles
) {
    public Pedido toEntity() {
        return Pedido.builder()
                .fecha(LocalDate.now())
                .estado(this.estado != null ? this.estado : Estado.PENDIENTE)
                .formaPago(this.formaPago)
                .build();
    }
}
