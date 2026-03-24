package mx.uam.cua.proyecto.cubiculos.controller;

import mx.uam.cua.proyecto.cubiculos.dto.CubiculoDTO;
import mx.uam.cua.proyecto.cubiculos.service.CubiculoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cubiculos")
@CrossOrigin(origins = "*")  // 🔥 AGREGAR ESTO
public class CubiculoController {

    @Autowired
    private CubiculoService cubiculoService;

    @PostMapping
    public CubiculoDTO crearCubiculo(@RequestBody CubiculoDTO cubiculoDTO){

        return cubiculoService.guardarCubiculo(cubiculoDTO);

    }

    @GetMapping
    public List<CubiculoDTO> obtenerCubiculos(){

        return cubiculoService.obtenerCubiculos();

    }

    @GetMapping("/{id}")
    public CubiculoDTO obtenerCubiculo(@PathVariable Integer id){

        return cubiculoService.obtenerCubiculoPorId(id);

    }

    @PutMapping("/{id}")
    public CubiculoDTO actualizarCubiculo(@PathVariable Integer id,
                                          @RequestBody CubiculoDTO cubiculoDTO){

        return cubiculoService.actualizarCubiculo(id, cubiculoDTO);

    }

    @DeleteMapping("/{id}")
    public void eliminarCubiculo(@PathVariable Integer id){

        cubiculoService.eliminarCubiculo(id);

    }

}