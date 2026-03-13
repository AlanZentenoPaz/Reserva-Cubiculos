package mx.uam.cua.proyecto.cubiculos.controller;

import mx.uam.cua.proyecto.cubiculos.dto.ReservaDTO;
import mx.uam.cua.proyecto.cubiculos.service.ReservaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservas")

public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping
    public ReservaDTO crearReserva(@RequestBody ReservaDTO reservaDTO){

        return reservaService.guardarReserva(reservaDTO);
    }

    @GetMapping
    public List<ReservaDTO> obtenerReservas(){

        return reservaService.obtenerReservas();
    }

    @GetMapping("/{id}")
    public ReservaDTO obtenerReserva(@PathVariable Integer id){

        return reservaService.obtenerReservaPorId(id);
    }

    @PutMapping("/{id}")
    public ReservaDTO actualizarReserva(@PathVariable Integer id,
                                        @RequestBody ReservaDTO reservaDTO){

        return reservaService.actualizarReserva(id, reservaDTO);
    }

    @DeleteMapping("/{id}")
    public void eliminarReserva(@PathVariable Integer id){

        reservaService.eliminarReserva(id);
    }

}