package com.final_prog3.foodstore_backend.service;

import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioCreate;
import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioDto;
import com.final_prog3.foodstore_backend.dtos.usuario.UsuarioEdit;
import com.final_prog3.foodstore_backend.entities.Usuario;
import com.final_prog3.foodstore_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServiceImp implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImp(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UsuarioDto save(UsuarioCreate usuarioCreate) {
        Usuario usuario = usuarioCreate.toEntity();
        usuario = usuarioRepository.save(usuario);
        return UsuarioDto.toDto(usuario);
    }

    @Override
    public UsuarioDto findById(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new NullPointerException("No se encontró el usuario con id: " + id));
        return UsuarioDto.toDto(usuario);
    }
    // TP10 - Nuevo método para llamar al repositorio usando findByMail (similar al resto). La excepción ahora se va a empezar a capturar en la capa de controlador.
    @Override
    public UsuarioDto findByMail(String mail) {
        Usuario usuario = usuarioRepository.findByMail(mail).orElseThrow(() -> new NullPointerException("No se encontró el usuario con mail: " + mail));
        return UsuarioDto.toDto(usuario);
    }

    @Override
    public List<UsuarioDto> findAll() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream().map(UsuarioDto::toDto).toList();
    }

    @Override
    public UsuarioDto update(UsuarioEdit usuarioEdit, Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new NullPointerException("No se encontró el usuario con id: " + idUsuario));
        usuarioEdit.applyTo(usuario);
        usuario = usuarioRepository.save(usuario);
        return UsuarioDto.toDto(usuario);
    }

    @Override
    public void deleteById(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new NullPointerException("No se encontró el usuario con id: " + id));
        usuario.setEliminado(true);
        usuarioRepository.save(usuario);
    }
}