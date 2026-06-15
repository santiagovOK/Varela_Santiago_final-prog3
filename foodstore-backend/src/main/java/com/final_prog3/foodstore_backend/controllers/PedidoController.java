package com.final_prog3.foodstore_backend.controllers;

import com.final_prog3.foodstore_backend.dtos.pedido.PedidoCreate;
import com.final_prog3.foodstore_backend.dtos.pedido.PedidoDto;
import com.final_prog3.foodstore_backend.dtos.pedido.PedidoEdit;
import com.final_prog3.foodstore_backend.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // TP10 - Es más preciso usar `getAll` `getById` en el @GetMapping, ya que el cliente justamente peticiona "obtener" un recurso a través de la API. `findById` es más propio de la capa de persistencia, que sí está buscando un registro en la BD (servicio, repositorio; en el video explicativo está distinto)

    @GetMapping
    public ResponseEntity<List<PedidoDto>> getAll() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.findById(id));
    }

    // TP10 - Es más preciso usar `create` en el @PostMapping, ya que el cliente justamente crea un recursos. `save` (guardar) se encarga la capa de persistencia (servicio, repositorio; en el video explicativo está distinto)

    @PostMapping
    public ResponseEntity<PedidoDto> create(@RequestBody PedidoCreate pedidoCreate) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.save(pedidoCreate));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDto> update(@PathVariable Long id, @RequestBody PedidoEdit pedidoEdit) {
        return ResponseEntity.ok(pedidoService.update(pedidoEdit, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pedidoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // TPI: endpoint para poder usar el método findByUsuario() de PedidosServiceImp
    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<PedidoDto>> getByUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.findByUsuarioId(id));
    }

    // TPI: endpoint con PATCH para poder usar el método updateStatus() de PedidosServiceImp
    @PatchMapping("/{id}/status")
    public ResponseEntity<PedidoDto> updateStatus(@PathVariable Long id, @jakarta.validation.Valid @RequestBody com.final_prog3.foodstore_backend.dtos.pedido.PedidoStatusEdit statusEdit) {
        return ResponseEntity.ok(pedidoService.updateStatus(id, statusEdit.estado()));
    }
}
