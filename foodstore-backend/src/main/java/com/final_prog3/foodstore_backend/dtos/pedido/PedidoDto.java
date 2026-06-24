package com.final_prog3.foodstore_backend.dtos.pedido;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.entities.Pedido;
import com.final_prog3.foodstore_backend.enums.Estado;
import com.final_prog3.foodstore_backend.enums.FormaPago;
import com.final_prog3.foodstore_backend.dtos.detallePedido.DetallePedidoDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record PedidoDto(
        Long id,
        LocalDateTime fecha,
        Estado estado,
        Double total,
        FormaPago formaPago,
        String nombreCliente,
        List<DetallePedidoDto> detalles
) {
    public static PedidoDto toDto(Pedido pedido, String nombreCliente) {
        return new PedidoDto(
                pedido.getId(),
                pedido.getFecha(),
                pedido.getEstado(),
                pedido.getTotal(),
                pedido.getFormaPago(),
                nombreCliente,
                pedido.getDetalles() != null
                        ? pedido.getDetalles().stream().map(DetallePedidoDto::toDto).collect(Collectors.toList())
                        : null
        );
    }
    
    // Sobrecarga para mantener compatibilidad si no pasamos el nombre
    public static PedidoDto toDto(Pedido pedido) {
        return toDto(pedido, "Consumidor Final");
    }
}
