package com.final_prog3.foodstore_backend.dtos.usuario;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
// TPI: Creación de UsuarioLogin como DTO específico para manejar de forma segura y válida las credenciales de usuario en el login.
public record UsuarioLogin(
        @NotBlank(message = "El mail es obligatorio")
        @Email(message = "Debe ser un email válido")
        String email,
        @NotBlank(message = "La contraseña es obligatoria")
        String password
) {}
