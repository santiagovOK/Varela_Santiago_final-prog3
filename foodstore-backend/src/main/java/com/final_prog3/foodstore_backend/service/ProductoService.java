package com.final_prog3.foodstore_backend.service;

/*
 *
 * @author Santiago Octavio Varela / @santiagovOK (GitHub)
 * <santiago.varela@tupad.utn.edu.ar>
 */

import com.final_prog3.foodstore_backend.dtos.producto.ProductoCreate;
import com.final_prog3.foodstore_backend.dtos.producto.ProductoDto;
import com.final_prog3.foodstore_backend.dtos.producto.ProductoEdit;

import java.util.List;

public interface ProductoService {
    public ProductoDto save(ProductoCreate productoCreate);
    public ProductoDto findById(Long id);
    public List<ProductoDto> findAll();
    public ProductoDto update(ProductoEdit productoEdit, Long idProducto);
    public void deleteById(Long id);
}
