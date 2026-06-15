package com.final_prog3.foodstore_backend.service;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

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
        usuario.setPassword(hashPassword(usuario.getPassword()));
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

    // TPI: Método login, que verifica que el password cifrado que ingresa el usuario coincida con el que está guardado en la base de datos
    @Override
    public UsuarioDto login(String mail, String password) {
        Usuario usuario = usuarioRepository.findByMail(mail)
                .orElseThrow(() -> new NullPointerException("Credenciales inválidas"));
        if (!usuario.getPassword().equals(hashPassword(password))) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }
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
        // TPI: Condición para cambio de password con cifrado
        if (usuarioEdit.password() != null) {
            usuario.setPassword(hashPassword(usuarioEdit.password()));
        }
        usuario = usuarioRepository.save(usuario);
        return UsuarioDto.toDto(usuario);
    }

    @Override
    public void deleteById(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new NullPointerException("No se encontró el usuario con id: " + id));
        usuario.setEliminado(true);
        usuarioRepository.save(usuario);
    }

    // TPI: Método hashPassword para tomar la contraseña en texto plano y transformarla en una cadena alfanumérica (un hash) utilizando el algoritmo SHA-256, para guardarlo de forma segura.
    private String hashPassword(String password) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256"); // Obtención del algoritmo SHA-256 a través de MessageDigest
            byte[] encodedhash = digest.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8)); // Conversión a bytes para encriptar
            StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
            // Conversión de bytes a hexadecimal para hacer legible la contraseña encriptada
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            // Retorna String final que va con una longitud fija de 64 caracteres. Es el texto cifrado que finalmente se guarda en la base de datos
            return hexString.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al encriptar contraseña", e);
        }
    }
}