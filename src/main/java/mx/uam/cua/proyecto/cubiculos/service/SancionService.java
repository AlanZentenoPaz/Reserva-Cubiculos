package mx.uam.cua.proyecto.cubiculos.service;

import mx.uam.cua.proyecto.cubiculos.dto.SancionDTO;
import java.util.List;

public interface SancionService {

    SancionDTO guardar(SancionDTO dto);

    List<SancionDTO> obtener();

    SancionDTO obtenerPorId(Integer id);

    SancionDTO actualizar(Integer id, SancionDTO dto);

    void eliminar(Integer id);

}

