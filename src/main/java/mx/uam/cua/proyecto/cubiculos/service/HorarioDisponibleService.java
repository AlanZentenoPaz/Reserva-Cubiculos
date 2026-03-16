package mx.uam.cua.proyecto.cubiculos.service;

import mx.uam.reservas.dto.HorarioDisponibleDTO;
import java.util.List;

public interface HorarioDisponibleService {

    HorarioDisponibleDTO guardarHorario(HorarioDisponibleDTO dto);

    List<HorarioDisponibleDTO> obtenerHorarios();

    HorarioDisponibleDTO obtenerHorarioPorId(Integer id);

    HorarioDisponibleDTO actualizarHorario(Integer id, HorarioDisponibleDTO dto);

    void eliminarHorario(Integer id);

}



