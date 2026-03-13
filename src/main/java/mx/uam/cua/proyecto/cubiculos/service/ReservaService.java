package mx.uam.cua.proyecto.cubiculos.service;

import mx.uam.cua.proyecto.cubiculos.dto.ReservaDTO;
import java.util.List;

public interface ReservaService {

    ReservaDTO guardarReserva(ReservaDTO reservaDTO);

    List<ReservaDTO> obtenerReservas();

    ReservaDTO obtenerReservaPorId(Integer id);

    ReservaDTO actualizarReserva(Integer id, ReservaDTO reservaDTO);

    void eliminarReserva(Integer id);

}