package com.final_prog3.foodstore_backend.service;

// Santiago Octavio Varela / @santiagovOK (GitHub) <santiago.varela@tupad.utn.edu.ar>

import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaCreate;
import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaDto;
import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaEdit;
import com.final_prog3.foodstore_backend.entities.Categoria;
import com.final_prog3.foodstore_backend.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaServiceImpl implements CategoriaService {
    private final CategoriaRepository categoriaRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public CategoriaDto save(CategoriaCreate categoriaCreate) {
        Categoria categoria = categoriaCreate.toEntity();
        categoria = categoriaRepository.save(categoria);
        return CategoriaDto.toDto(categoria);
    }

    @Override
    public CategoriaDto findById(Long id) {
        Categoria categoria = categoriaRepository.findByIdAndEliminadoFalse(id) // TPI: se agregan los métodos para usar findBy correctamente con respecto a la baja lógica
                .orElseThrow(() -> new NullPointerException("No se encontró categoría con el id: " + id));
        return CategoriaDto.toDto(categoria);
    }

    @Override
    public List<CategoriaDto> findAll() {
        return categoriaRepository.findByEliminadoFalse().stream() // TPI: se agregan los métodos para usar findBy correctamente con respecto a la baja lógica
                .map(CategoriaDto::toDto).toList();
    }

    @Override
    public CategoriaDto update(CategoriaEdit categoriaEdit, Long idCategoria) {
        Categoria categoria = categoriaRepository.findByIdAndEliminadoFalse(idCategoria) // TPI: se agregan los métodos para usar findBy correctamente con respecto a la baja lógica
                .orElseThrow(() -> new NullPointerException("No se encontró categoría con el id: " + idCategoria));
        categoriaEdit.applyTo(categoria);
        categoria = categoriaRepository.save(categoria);
        return CategoriaDto.toDto(categoria);
    }

    @Override
    public void deleteById(Long id) {
        Categoria categoria = categoriaRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new NullPointerException("No se encontró categoría con el id: " + id));
        
        // Baja lógica: marcamos la entidad como eliminada en lugar de borrarla de la BD (ya estaba implementado en mis entidades desde Base).
        categoria.setEliminado(true);
        categoriaRepository.save(categoria);
    }
}