package com.final_prog3.foodstore_backend.repository;

/*
 *
 * @author Santiago Octavio Varela / @santiagovOK (GitHub)
 * <santiago.varela@tupad.utn.edu.ar>
 */

import com.final_prog3.foodstore_backend.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    // TPI: Nuevos métodos para que CategoriaRepository no traiga entidades eliminadas con findAll / findById
    List<Categoria> findByEliminadoFalse();
    Optional<Categoria> findByIdAndEliminadoFalse(Long id);
}
