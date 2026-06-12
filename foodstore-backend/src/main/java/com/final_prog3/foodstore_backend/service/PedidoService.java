package com.final_prog3.foodstore_backend.service;

import com.final_prog3.foodstore_backend.dtos.pedido.PedidoCreate;
import com.final_prog3.foodstore_backend.dtos.pedido.PedidoDto;
import com.final_prog3.foodstore_backend.dtos.pedido.PedidoEdit;

import java.util.List;

public interface PedidoService {
    public PedidoDto save(PedidoCreate pedidoCreate);
    public PedidoDto findById(Long id);
    public List<PedidoDto> findAll();
    public PedidoDto update(PedidoEdit pedidoEdit, Long idPedido);
    public void deleteById(Long id);
}
