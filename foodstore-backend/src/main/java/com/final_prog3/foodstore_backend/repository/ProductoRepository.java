package com.final_prog3.foodstore_backend.repository;

/*
 *
 * @author Santiago Octavio Varela / @santiagovOK (GitHub)
 * <santiago.varela@tupad.utn.edu.ar>
 */

import com.final_prog3.foodstore_backend.entities.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // TPI: Nuevos métodos para que ProductoRepository no traiga entidades eliminadas con findAll / findById
    List<Producto> findByEliminadoFalse();
    Optional<Producto> findByIdAndEliminadoFalse(Long id);
}
