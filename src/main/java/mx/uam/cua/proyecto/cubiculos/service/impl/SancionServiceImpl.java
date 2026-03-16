package mx.uam.cua.proyecto.cubiculos.service.impl;

import mx.uam.reservas.dto.SancionDTO;
import mx.uam.reservas.entity.Sancion;
import mx.uam.reservas.repository.SancionRepository;
import mx.uam.reservas.service.SancionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SancionServiceImpl implements SancionService {

    @Autowired
    private SancionRepository repository;

    private SancionDTO convertirDTO(Sancion s){

        return new SancionDTO(
                s.getIdSancion(),
                s.getMotivo(),
                s.getFechaInicio(),
                s.getFechaFin(),
                s.getEstado()
        );
    }

    @Override
    public SancionDTO guardar(SancionDTO dto){

        Sancion s = new Sancion();
        s.setMotivo(dto.getMotivo());
        s.setFechaInicio(dto.getFechaInicio());
        s.setFechaFin(dto.getFechaFin());
        s.setEstado(dto.getEstado());

        s = repository.save(s);

        return convertirDTO(s);
    }

    @Override
    public List<SancionDTO> obtener(){

        return repository.findAll()
                .stream()
                .map(this::convertirDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SancionDTO obtenerPorId(Integer id){

        Sancion s = repository.findById(id).orElseThrow();

        return convertirDTO(s);
    }

    @Override
    public SancionDTO actualizar(Integer id, SancionDTO dto){

        Sancion s = repository.findById(id).orElseThrow();

        s.setMotivo(dto.getMotivo());
        s.setFechaInicio(dto.getFechaInicio());
        s.setFechaFin(dto.getFechaFin());
        s.setEstado(dto.getEstado());

        repository.save(s);

        return convertirDTO(s);
    }

    @Override
    public void eliminar(Integer id){

        repository.deleteById(id);

    }

}

