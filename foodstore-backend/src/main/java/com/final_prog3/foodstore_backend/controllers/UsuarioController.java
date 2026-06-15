package com.final_prog3.foodstore_backend.controllers;

import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioCreate;
import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioDto;
import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioEdit;
import com.final_prog3.foodstore_backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // TP10 - Es más preciso usar `getAll` `getById` en el @GetMapping, ya que el cliente justamente peticiona "obtener" un recurso a través de la API. `findById` es más propio de la capa de persistencia, que sí está buscando un registro en la BD (servicio, repositorio; en el video explicativo está distinto)

    @GetMapping
    public ResponseEntity<List<UsuarioDto>> getAll() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    // TP10 - Get por ID solicitado en las consignas.

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> getById(@PathVariable Long id) {
        UsuarioDto usuario = usuarioService.findById(id);
        System.out.println("====== [CONSOLA] Búsqueda por ID ======");
        System.out.println("Usuario encontrado: " + usuario);
        System.out.println("=======================================");
        return ResponseEntity.ok(usuario);
    }

    // TP10 - Get por Email solicitado en las consignas.

    @GetMapping("/search")
    public ResponseEntity<UsuarioDto> getByMail(@RequestParam String mail) {
        UsuarioDto usuario = usuarioService.findByMail(mail);
        System.out.println("====== [CONSOLA] Búsqueda por MAIL ====");
        System.out.println("Usuario encontrado: " + usuario);
        System.out.println("=======================================");
        return ResponseEntity.ok(usuario);
    }
    // TPI - Se agrega @Valid como anotación de validación de Spring Boot
    @PostMapping
    public ResponseEntity<UsuarioDto> create(@Valid @RequestBody UsuarioCreate usuarioCreate) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.save(usuarioCreate));
    }
    // TPI - Creación de un endpoint para login con @PostMapping
    @PostMapping("/login")
    public ResponseEntity<UsuarioDto> login(@Valid @RequestBody com.final_prog3.foodstore_backend.dtos.usuario.UsuarioLogin loginDto) {
        return ResponseEntity.ok(usuarioService.login(loginDto.mail(), loginDto.password()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDto> update(@PathVariable Long id, @RequestBody UsuarioEdit usuarioEdit) {
        return ResponseEntity.ok(usuarioService.update(usuarioEdit, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
