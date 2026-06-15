package com.final_prog3.foodstore_backend.dtos.usuario;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.entities.Usuario;
import com.final_prog3.foodstore_backend.enums.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioCreate(
        // TPI: Se agregaron anotaciones de validacion específicas con Spring Boot para los campos en este DTO
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        @NotBlank(message = "El apellido es obligatorio")
        String apellido,
        @NotBlank(message = "El mail es obligatorio")
        @Email(message = "Debe ser un email válido")
        String mail,
        String celular,
        @NotBlank(message = "La contraseña es obligatoria")
        String password,
        @NotNull(message = "El rol es obligatorio")
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