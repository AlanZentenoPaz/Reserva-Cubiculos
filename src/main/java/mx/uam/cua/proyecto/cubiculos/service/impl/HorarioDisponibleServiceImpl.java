package mx.uam.cua.proyecto.cubiculos.service.impl;

import mx.uam.cua.proyecto.cubiculos.dto.HorarioDisponibleDTO;
import mx.uam.cua.proyecto.cubiculos.entity.Cubiculo;
import mx.uam.cua.proyecto.cubiculos.entity.HorarioDisponible;
import mx.uam.cua.proyecto.cubiculos.repository.CubiculoRepository;
import mx.uam.cua.proyecto.cubiculos.repository.HorarioDisponibleRepository;
import mx.uam.cua.proyecto.cubiculos.service.HorarioDisponibleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HorarioDisponibleServiceImpl implements HorarioDisponibleService {

    @Autowired
    private HorarioDisponibleRepository repository;

    @Autowired
    private CubiculoRepository cubiculoRepository;  // 🔥 AGREGAR

    private HorarioDisponibleDTO convertirDTO(HorarioDisponible h) {
        return new HorarioDisponibleDTO(
                h.getIdHorario(),
                h.getDiaSemana(),
                h.getHoraInicio(),
                h.getHoraFin(),
                h.getCubiculo() != null ? h.getCubiculo().getIdCubiculo() : null
        );
    }

    @Override
    public HorarioDisponibleDTO guardarHorario(HorarioDisponibleDTO dto) {
        // 🔥 Buscar el cubículo
        Cubiculo cubiculo = cubiculoRepository.findById(dto.getIdCubiculo())
                .orElseThrow(() -> new RuntimeException("Cubículo no encontrado con ID: " + dto.getIdCubiculo()));

        HorarioDisponible h = new HorarioDisponible();
        h.setDiaSemana(dto.getDiaSemana());
        h.setHoraInicio(dto.getHoraInicio());
        h.setHoraFin(dto.getHoraFin());
        h.setCubiculo(cubiculo);  // 🔥 ASIGNAR CUBÍCULO

        h = repository.save(h);

        return convertirDTO(h);
    }

    @Override
    public List<HorarioDisponibleDTO> obtenerHorarios() {
        return repository.findAll()
                .stream()
                .map(this::convertirDTO)
                .collect(Collectors.toList());
    }

    @Override
    public HorarioDisponibleDTO obtenerHorarioPorId(Integer id) {
        HorarioDisponible h = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado con ID: " + id));
        return convertirDTO(h);
    }

    @Override
    public HorarioDisponibleDTO actualizarHorario(Integer id, HorarioDisponibleDTO dto) {
        HorarioDisponible h = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado con ID: " + id));

        Cubiculo cubiculo = cubiculoRepository.findById(dto.getIdCubiculo())
                .orElseThrow(() -> new RuntimeException("Cubículo no encontrado con ID: " + dto.getIdCubiculo()));

        h.setDiaSemana(dto.getDiaSemana());
        h.setHoraInicio(dto.getHoraInicio());
        h.setHoraFin(dto.getHoraFin());
        h.setCubiculo(cubiculo);

        repository.save(h);

        return convertirDTO(h);
    }

    @Override
    public void eliminarHorario(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Horario no encontrado con ID: " + id);
        }
        repository.deleteById(id);
    }
}