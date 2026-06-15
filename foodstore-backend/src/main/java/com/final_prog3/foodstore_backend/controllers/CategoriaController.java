package com.final_prog3.foodstore_backend.controllers;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaCreate;
import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaDto;
import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaEdit;
import com.final_prog3.foodstore_backend.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;



    // Inclusión de los endpoints básicos

    // TP10 - Es más preciso usar `getAll` `getById` en el @GetMapping, ya que el cliente justamente peticiona "obtener" un recurso a través de la API. `findById` es más propio de la capa de persistencia, que sí está buscando un registro en la BD (servicio, repositorio; en el video explicativo está distinto)

    @GetMapping
    public ResponseEntity<List<CategoriaDto>> getAll() {
        return ResponseEntity.ok(categoriaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.findById(id));
    }

    // TP10 - Es más preciso usar `create` en el @PostMapping, ya que el cliente justamente crea un recursos. `save` (guardar) se encarga la capa de persistencia (servicio, repositorio; en el video explicativo está distinto)
    // TPI - Se agrega @Valid como anotación de validación de Spring Boot
    @PostMapping
    public ResponseEntity<CategoriaDto> create(@Valid @RequestBody CategoriaCreate categoriaCreate) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.save(categoriaCreate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoriaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // TP10 - Para la parte de "Actualizar 1 Categoria"
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDto> update(@PathVariable Long id, @RequestBody CategoriaEdit categoriaEdit) {
        return ResponseEntity.ok(categoriaService.update(categoriaEdit, id));
    }
}
