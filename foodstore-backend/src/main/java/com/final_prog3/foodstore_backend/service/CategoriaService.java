package com.final_prog3.foodstore_backend.service;

/*
 *
 * @author Santiago Octavio Varela / @santiagovOK (GitHub)
 * <santiago.varela@tupad.utn.edu.ar>
 */

import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaCreate;
import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaDto;
import com.final_prog3.foodstore_backend.dtos.categoria.CategoriaEdit;

import java.util.List;

public interface CategoriaService {
    public CategoriaDto save(CategoriaCreate categoriaCreate);
    public CategoriaDto findById(Long id);
    public List<CategoriaDto> findAll();
    public CategoriaDto update(CategoriaEdit categoriaEdit, Long idCategoria);
    public void deleteById(Long id);
}
