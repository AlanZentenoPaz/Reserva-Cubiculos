package mx.uam.cua.proyecto.cubiculos.service.impl;

import mx.uam.cua.proyecto.cubiculos.dto.CubiculoDTO;
import mx.uam.cua.proyecto.cubiculos.entity.Cubiculo;
import mx.uam.cua.proyecto.cubiculos.repository.CubiculoRepository;
import mx.uam.cua.proyecto.cubiculos.service.CubiculoService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CubiculoServiceImpl implements CubiculoService {

    @Autowired
    private CubiculoRepository cubiculoRepository;

    private CubiculoDTO convertirDTO(Cubiculo cubiculo){

        return new CubiculoDTO(
                cubiculo.getIdCubiculo(),
                cubiculo.getNumeroCubiculo(),
                cubiculo.getCapacidad(),
                cubiculo.getUbicacion(),
                cubiculo.getTipo(),
                cubiculo.getEquipamiento(),
                cubiculo.getEstado()
        );

    }

    private Cubiculo convertirEntidad(CubiculoDTO dto){

        return new Cubiculo(
                dto.getIdCubiculo(),
                dto.getNumeroCubiculo(),
                dto.getCapacidad(),
                dto.getUbicacion(),
                dto.getTipo(),
                dto.getEquipamiento(),
                dto.getEstado()
        );

    }

    @Override
    public CubiculoDTO guardarCubiculo(CubiculoDTO cubiculoDTO){

        Cubiculo cubiculo = convertirEntidad(cubiculoDTO);
        cubiculo = cubiculoRepository.save(cubiculo);

        return convertirDTO(cubiculo);

    }

    @Override
    public List<CubiculoDTO> obtenerCubiculos(){

        return cubiculoRepository.findAll()
                .stream()
                .map(this::convertirDTO)
                .collect(Collectors.toList());

    }

    @Override
    public CubiculoDTO obtenerCubiculoPorId(Integer id){

        Cubiculo cubiculo = cubiculoRepository.findById(id).orElseThrow();

        return convertirDTO(cubiculo);

    }

    @Override
    public CubiculoDTO actualizarCubiculo(Integer id, CubiculoDTO cubiculoDTO){

        Cubiculo cubiculo = cubiculoRepository.findById(id).orElseThrow();

        cubiculo.setNumeroCubiculo(cubiculoDTO.getNumeroCubiculo());
        cubiculo.setCapacidad(cubiculoDTO.getCapacidad());
        cubiculo.setUbicacion(cubiculoDTO.getUbicacion());
        cubiculo.setTipo(cubiculoDTO.getTipo());
        cubiculo.setEquipamiento(cubiculoDTO.getEquipamiento());
        cubiculo.setEstado(cubiculoDTO.getEstado());

        cubiculoRepository.save(cubiculo);

        return convertirDTO(cubiculo);

    }

    @Override
    public void eliminarCubiculo(Integer id){

        cubiculoRepository.deleteById(id);

    }

}