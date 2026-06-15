package com.final_prog3.foodstore_backend.service;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioCreate;
import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioDto;
import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioEdit;

import java.util.List;

public interface UsuarioService {
    public UsuarioDto save(UsuarioCreate usuarioCreate);
    public UsuarioDto findById(Long id);
    public UsuarioDto findByMail(String mail); // TP10 - Firma del método findByMail para que devuelva el DTO correspondiente.
    public UsuarioDto login(String mail, String password); // TPI: método login para buscar al usuario por email y gestionar la encriptación de la contraseña
    public List<UsuarioDto> findAll();
    public UsuarioDto update(UsuarioEdit usuarioEdit, Long idUsuario);
    public void deleteById(Long id);
}
