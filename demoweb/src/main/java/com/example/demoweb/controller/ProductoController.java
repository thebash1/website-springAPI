package com.example.demoweb.controller;

import com.example.demoweb.model.Producto;
import com.example.demoweb.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // Permite que tu frontend acceda sin bloqueos
public class ProductoController {

    @Autowired
    private ProductoRepository repository;

    // 1. LISTAR (GET): Obtiene todos los productos
    @GetMapping
    public List<Producto> listar() {
        return repository.findAll();
    }

    // 2. CREAR (POST): Recibe un JSON y lo guarda en la BD
    @PostMapping
    public Producto crear(@RequestBody Producto producto) {
        return repository.save(producto);
    }

    // 3. ACTUALIZAR (PUT): Modifica un producto existente por su ID
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @RequestBody Producto detalles) {
        return repository.findById(id)
                .map(producto -> {
                    producto.setTitle(detalles.getTitle());
                    producto.setPrice(detalles.getPrice());
                    producto.setStock(detalles.getStock());
                    producto.setImage(detalles.getImage());
                    Producto actualizado = repository.save(producto);
                    return ResponseEntity.ok(actualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. ELIMINAR (DELETE): Borra un producto de la base de datos
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
