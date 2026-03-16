package mx.uam.cua.proyecto.cubiculos.service.impl;

import mx.uam.reservas.dto.HorarioDisponibleDTO;
import mx.uam.reservas.entity.HorarioDisponible;
import mx.uam.reservas.repository.HorarioDisponibleRepository;
import mx.uam.reservas.service.HorarioDisponibleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HorarioDisponibleServiceImpl implements HorarioDisponibleService {

    @Autowired
    private HorarioDisponibleRepository repository;

    private HorarioDisponibleDTO convertirDTO(HorarioDisponible h){

        return new HorarioDisponibleDTO(
                h.getIdHorario(),
                h.getDiaSemana(),
                h.getHoraInicio(),
                h.getHoraFin()
        );
    }

    @Override
    public HorarioDisponibleDTO guardarHorario(HorarioDisponibleDTO dto){

        HorarioDisponible h = new HorarioDisponible();
        h.setDiaSemana(dto.getDiaSemana());
        h.setHoraInicio(dto.getHoraInicio());
        h.setHoraFin(dto.getHoraFin());

        h = repository.save(h);

        return convertirDTO(h);
    }

    @Override
    public List<HorarioDisponibleDTO> obtenerHorarios(){

        return repository.findAll()
                .stream()
                .map(this::convertirDTO)
                .collect(Collectors.toList());
    }

    @Override
    public HorarioDisponibleDTO obtenerHorarioPorId(Integer id){

        HorarioDisponible h = repository.findById(id).orElseThrow();

        return convertirDTO(h);
    }

    @Override
    public HorarioDisponibleDTO actualizarHorario(Integer id, HorarioDisponibleDTO dto){

        HorarioDisponible h = repository.findById(id).orElseThrow();

        h.setDiaSemana(dto.getDiaSemana());
        h.setHoraInicio(dto.getHoraInicio());
        h.setHoraFin(dto.getHoraFin());

        repository.save(h);

        return convertirDTO(h);
    }

    @Override
    public void eliminarHorario(Integer id){

        repository.deleteById(id);

    }

}
