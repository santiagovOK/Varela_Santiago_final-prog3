package com.final_prog3.foodstore_backend.dtos.usuario;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.entities.Usuario;
import com.final_prog3.foodstore_backend.enums.Rol;

public record UsuarioEdit(
        String nombre,
        String apellido,
        String celular,
        String password,
        Rol rol
) {
    public void applyTo(Usuario usuario) {
        if (this.nombre != null)
            usuario.setNombre(this.nombre);
        if (this.apellido != null)
            usuario.setApellido(this.apellido);
        if (this.celular != null)
            usuario.setCelular(this.celular);
        if (this.password != null)
            usuario.setPassword(this.password);
        if (this.rol != null)
            usuario.setRol(this.rol);
    }
}
