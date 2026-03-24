package mx.uam.cua.proyecto.cubiculos.controller;

import mx.uam.cua.proyecto.cubiculos.dto.HorarioDisponibleDTO;
import mx.uam.cua.proyecto.cubiculos.service.HorarioDisponibleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
@CrossOrigin(origins = "*")  // 🔥 AGREGAR ESTO

public class HorarioDisponibleController {

    @Autowired
    private HorarioDisponibleService service;

    @PostMapping
    public HorarioDisponibleDTO crear(@RequestBody HorarioDisponibleDTO dto){

        return service.guardarHorario(dto);
    }

    @GetMapping
    public List<HorarioDisponibleDTO> obtener(){

        return service.obtenerHorarios();
    }

    @GetMapping("/{id}")
    public HorarioDisponibleDTO obtenerPorId(@PathVariable Integer id){

        return service.obtenerHorarioPorId(id);
    }

    @PutMapping("/{id}")
    public HorarioDisponibleDTO actualizar(@PathVariable Integer id,
                                           @RequestBody HorarioDisponibleDTO dto){

        return service.actualizarHorario(id,dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id){

        service.eliminarHorario(id);
    }

}