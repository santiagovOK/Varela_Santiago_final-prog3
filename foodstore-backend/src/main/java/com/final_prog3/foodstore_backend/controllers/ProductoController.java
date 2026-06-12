package com.final_prog3.foodstore_backend.controllers;

import com.final_prog3.foodstore_backend.dtos.producto.ProductoCreate;
import com.final_prog3.foodstore_backend.dtos.producto.ProductoDto;
import com.final_prog3.foodstore_backend.dtos.producto.ProductoEdit;
import com.final_prog3.foodstore_backend.service.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // Inclusión de los endpoints básicos

    // TP10 - Es más preciso usar `getAll` `getById` en el @GetMapping, ya que el cliente justamente peticiona "obtener" un recurso a través de la API. `findById` es más propio de la capa de persistencia, que sí está buscando un registro en la BD (servicio, repositorio; en el video explicativo está distinto)

    @GetMapping
    public ResponseEntity<List<ProductoDto>> getAll() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findById(id));
    }

    // TP10 - Es más preciso usar `create` en el @PostMapping, ya que el cliente justamente crea un recursos. `save` (guardar) se encarga la capa de persistencia (servicio, repositorio; en el video explicativo está distinto)

    @PostMapping
    public ResponseEntity<ProductoDto> create(@RequestBody ProductoCreate productoCreate) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.save(productoCreate));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDto> update(@PathVariable Long id, @RequestBody ProductoEdit productoEdit) {
        return ResponseEntity.ok(productoService.update(productoEdit, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
