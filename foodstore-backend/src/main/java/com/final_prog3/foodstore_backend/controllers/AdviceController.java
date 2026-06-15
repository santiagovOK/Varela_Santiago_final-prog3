package com.final_prog3.foodstore_backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class AdviceController {

    // Maneja los errores cuando no se encuentra una entidad (ya que en los servicios se está lanzando NullPointerException)
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, String>> handleNullPointerException(NullPointerException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Recurso no encontrado");
        response.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // TPI: Maneja los errores de validación de los DTOs (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errores.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
    }

    // Maneja errores de validación o argumentos incorrectos
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Petición inválida (Bad Request)");
        response.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Un catch genérico para cualquier otro error no controlado
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Error interno del servidor");
        response.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
