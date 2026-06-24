package com.final_prog3.foodstore_backend.entities;

/*
 *
 * @author Santiago Octavio Varela / @santiagovOK (GitHub)
 * <santiago.varela@tupad.utn.edu.ar>
 */

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import com.final_prog3.foodstore_backend.enums.Rol;

@Getter
@Setter
// Como buena práctica de seguridad, directamente evitamos que password se imprima en el ToString. Antes había usado "****", pero creo que esto es mejor para el uso de Lombok.
@ToString(exclude = {"password", "pedidos"})
@EqualsAndHashCode(callSuper = true, exclude = "pedidos")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor

@Entity
public class Usuario extends Base {
    private String nombre;
    private String apellido;
    @Column(unique = true) // Esto es para que no se repitan los mails en la base de datos.
    private String mail;
    private String celular;
    private String password;
    @Enumerated(EnumType.STRING) // Uso @Enumerated para que las posiciones del enum Rol sean catalogadas como Strings.
    private Rol rol;

    // TPI: La relación entre Usuarios y Pedidos no estaba correctamente formulada. Con las líneas subsiguientes se establece la relación unilateral uno a muchos con Pedido. La relación en Java es unilateral de Usuario a Pedido, pero en la BD de la tabla Pedidos se crea `usuario_id`, preservando la integridad.
    @jakarta.persistence.OneToMany(cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    @jakarta.persistence.JoinColumn(name = "usuario_id") // TPI: JoinColum permite la creación de usuario_id en la tabla Pedidos
    @lombok.Builder.Default
    private java.util.Set<Pedido> pedidos = new java.util.HashSet<>();

    public void addPedido(Pedido pedido) {
        this.pedidos.add(pedido);
    }
}

