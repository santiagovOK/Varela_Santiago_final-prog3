package com.final_prog3.foodstore_backend.service;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.dtos.pedido.PedidoCreate;
import com.final_prog3.foodstore_backend.dtos.pedido.PedidoDto;
import com.final_prog3.foodstore_backend.dtos.pedido.PedidoEdit;

import java.util.List;

public interface PedidoService {
    public PedidoDto save(PedidoCreate pedidoCreate);
    public PedidoDto findById(Long id);
    public List<PedidoDto> findByUsuarioId(Long usuarioId);
    public List<PedidoDto> findAll();
    public PedidoDto update(PedidoEdit pedidoEdit, Long idPedido);
    public PedidoDto updateStatus(Long id, com.final_prog3.foodstore_backend.enums.Estado nuevoEstado);
    public void deleteById(Long id);
}
