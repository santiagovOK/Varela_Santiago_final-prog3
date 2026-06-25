package com.final_prog3.foodstore_backend.service;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.dtos.detallePedido.DetallePedidoCreate;
import com.final_prog3.foodstore_backend.dtos.pedido.PedidoCreate;
import com.final_prog3.foodstore_backend.dtos.pedido.PedidoDto;
import com.final_prog3.foodstore_backend.dtos.pedido.PedidoEdit;
import com.final_prog3.foodstore_backend.entities.Pedido;
import com.final_prog3.foodstore_backend.entities.Producto;
import com.final_prog3.foodstore_backend.enums.Estado;
import com.final_prog3.foodstore_backend.repository.PedidoRepository;
import com.final_prog3.foodstore_backend.repository.ProductoRepository;
import com.final_prog3.foodstore_backend.repository.UsuarioRepository;
import com.final_prog3.foodstore_backend.entities.Usuario;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PedidoServiceImp implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoServiceImp(PedidoRepository pedidoRepository, ProductoRepository productoRepository, UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public PedidoDto save(PedidoCreate pedidoCreate) {
        Pedido pedido = pedidoCreate.toEntity();
        
        Usuario usuario = null;
        if (pedidoCreate.idUsuario() != null) {
            usuario = usuarioRepository.findById(pedidoCreate.idUsuario())
                    .orElseThrow(() -> new NullPointerException("No se encontró el usuario con id: " + pedidoCreate.idUsuario()));
        }

        if (pedidoCreate.detalles() != null) {
            for (DetallePedidoCreate detalleCreate : pedidoCreate.detalles()) {
                Producto producto = productoRepository.findById(detalleCreate.idProducto())
                        .orElseThrow(() -> new NullPointerException("No se encontró el producto con id: " + detalleCreate.idProducto()));

                // TPI: Condición para buscar en la base de datos el stock preexistente de cada producto, buscando que los pedidos no superen ese stock
                if (producto.getStock() < detalleCreate.cantidad()) {
                    throw new IllegalArgumentException("Stock insuficiente para el producto: " + producto.getNombre());
                }
                producto.setStock(producto.getStock() - detalleCreate.cantidad());
                if (producto.getStock() == 0) {
                    producto.setDisponible(false);
                }
                productoRepository.save(producto);
                
                pedido.addDetallePedido(detalleCreate.cantidad(), producto);
            }
        }
        
        pedido = pedidoRepository.save(pedido);
        if (usuario != null) {
            usuario.addPedido(pedido);
            usuarioRepository.save(usuario);
        }
        return mapToDto(pedido);
    }

    @Override
    public PedidoDto findById(Long id) {
        Pedido pedido = pedidoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new NullPointerException("No se encontró el pedido con id: " + id));
        return mapToDto(pedido);
    }

    @Override
    public List<PedidoDto> findAll() {
        List<Pedido> pedidos = pedidoRepository.findByEliminadoFalse();
        return pedidos.stream().map(this::mapToDto).toList();
    }

    @Override
    public PedidoDto update(PedidoEdit pedidoEdit, Long idPedido) {
        Pedido pedido = pedidoRepository.findByIdAndEliminadoFalse(idPedido)
                .orElseThrow(() -> new NullPointerException("No se encontró el pedido con id: " + idPedido));
        pedidoEdit.applyTo(pedido);
        pedido = pedidoRepository.save(pedido);
        return mapToDto(pedido);
    }

    @Override
    public void deleteById(Long id) {
        Pedido pedido = pedidoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new NullPointerException("No se encontró el pedido con id: " + id));
        pedido.setEliminado(true);
        pedidoRepository.save(pedido);
    }

    // TPI: findByUsuarioId, respecto al primer findBy (que es solo para buscar pedidos), es creado para poder listar todos los pedidos de un usuario específico, siguiendo uno de los requerimientos solicitados en las consignas.
    @Override
    public List<PedidoDto> findByUsuarioId(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NullPointerException("No se encontró el usuario con id: " + usuarioId));
        return usuario.getPedidos().stream()
                .filter(p -> !p.isEliminado())
                .map(this::mapToDto).toList();
    }

    // TPI: el primer update() existe para, a partir de una petición PUT, modificar un recurso de forma completa. updateStatus() se creó puntualmente para el requerimiento que indica que el Administrador cambie solo el Estado, un cambio parcial del objeto, a través del uso de PATCH
    @Override
    public PedidoDto updateStatus(Long id, Estado nuevoEstado) {
        Pedido pedido = pedidoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new NullPointerException("No se encontró el pedido con id: " + id));
        pedido.setEstado(nuevoEstado);
        pedido = pedidoRepository.save(pedido);
        return mapToDto(pedido);
    }

    private PedidoDto mapToDto(Pedido pedido) {
        String nombreCliente = usuarioRepository.findByPedidosId(pedido.getId())
                .map(u -> u.getNombre() + " " + u.getApellido())
                .orElse("Consumidor Final");
        return PedidoDto.toDto(pedido, nombreCliente);
    }
}