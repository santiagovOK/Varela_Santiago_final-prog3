package com.final_prog3.foodstore_backend.dtos.usuario;

import com.final_prog3.foodstore_backend.entities.Usuario;
import com.final_prog3.foodstore_backend.enums.Rol;

public record UsuarioCreate(
        String nombre,
        String apellido,
        String mail,
        String celular,
        String password,
        Rol rol
) {
    public Usuario toEntity() {
        return Usuario.builder()
                .nombre(this.nombre)
                .apellido(this.apellido)
                .mail(this.mail)
                .celular(this.celular)
                .password(this.password)
                .rol(this.rol)
                .build();
    }
}