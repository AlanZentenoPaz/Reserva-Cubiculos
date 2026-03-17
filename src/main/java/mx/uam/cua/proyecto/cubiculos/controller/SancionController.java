package mx.uam.cua.proyecto.cubiculos.controller;

import mx.uam.cua.proyecto.cubiculos.dto.SancionDTO;
import mx.uam.cua.proyecto.cubiculos.service.SancionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sanciones")

public class SancionController {

    @Autowired
    private SancionService service;

    @PostMapping
    public SancionDTO crear(@RequestBody SancionDTO dto){

        return service.guardar(dto);
    }

    @GetMapping
    public List<SancionDTO> obtener(){

        return service.obtener();
    }

    @GetMapping("/{id}")
    public SancionDTO obtenerPorId(@PathVariable Integer id){

        return service.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public SancionDTO actualizar(@PathVariable Integer id,
                                 @RequestBody SancionDTO dto){

        return service.actualizar(id,dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id){

        service.eliminar(id);
    }

}