package com.final_prog3.foodstore_backend.dtos.detallePedido;

import com.final_prog3.foodstore_backend.entities.DetallePedido;

public record DetallePedidoDto(
        Long id,
        int cantidad,
        Double subtotal,
        String nombreProducto
) {
    public static DetallePedidoDto toDto(DetallePedido detalle) {
        return new DetallePedidoDto(
                detalle.getId(),
                detalle.getCantidad(),
                detalle.getSubtotal(),
                detalle.getProducto() != null ? detalle.getProducto().getNombre() : null
        );
    }
}
