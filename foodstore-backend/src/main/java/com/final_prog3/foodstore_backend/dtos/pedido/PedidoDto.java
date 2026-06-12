package com.final_prog3.foodstore_backend.dtos.pedido;

import com.final_prog3.foodstore_backend.entities.Pedido;
import com.final_prog3.foodstore_backend.enums.Estado;
import com.final_prog3.foodstore_backend.enums.FormaPago;
import com.final_prog3.foodstore_backend.dtos.detallePedido.DetallePedidoDto;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public record PedidoDto(
        Long id,
        LocalDate fecha,
        Estado estado,
        Double total,
        FormaPago formaPago,
        List<DetallePedidoDto> detalles
) {
    public static PedidoDto toDto(Pedido pedido) {
        return new PedidoDto(
                pedido.getId(),
                pedido.getFecha(),
                pedido.getEstado(),
                pedido.getTotal(),
                pedido.getFormaPago(),
                pedido.getDetalles() != null
                        ? pedido.getDetalles().stream().map(DetallePedidoDto::toDto).collect(Collectors.toList())
                        : null
        );
    }
}
