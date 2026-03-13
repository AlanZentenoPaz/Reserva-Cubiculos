package mx.uam.cua.proyecto.cubiculos.service;

import mx.uam.cua.proyecto.cubiculos.dto.CubiculoDTO;
import java.util.List;

public interface CubiculoService {

    CubiculoDTO guardarCubiculo(CubiculoDTO cubiculoDTO);

    List<CubiculoDTO> obtenerCubiculos();

    CubiculoDTO obtenerCubiculoPorId(Integer id);

    CubiculoDTO actualizarCubiculo(Integer id, CubiculoDTO cubiculoDTO);

    void eliminarCubiculo(Integer id);

}