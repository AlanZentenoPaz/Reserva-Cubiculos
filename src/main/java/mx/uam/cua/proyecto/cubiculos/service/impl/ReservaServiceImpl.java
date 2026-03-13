package mx.uam.cua.proyecto.cubiculos.service.impl;

import mx.uam.cua.proyecto.cubiculos.dto.ReservaDTO;
import mx.uam.cua.proyecto.cubiculos.entity.Cubiculo;
import mx.uam.cua.proyecto.cubiculos.entity.Reserva;
import mx.uam.cua.proyecto.cubiculos.repository.CubiculoRepository;
import mx.uam.cua.proyecto.cubiculos.repository.ReservaRepository;
import mx.uam.cua.proyecto.cubiculos.service.ReservaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservaServiceImpl implements ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private CubiculoRepository cubiculoRepository;

    private ReservaDTO convertirDTO(Reserva reserva){

        return new ReservaDTO(
                reserva.getIdReserva(),
                reserva.getFecha(),
                reserva.getHoraInicio(),
                reserva.getHoraFin(),
                reserva.getEstado(),
                reserva.getCubiculo().getIdCubiculo()
        );
    }

    @Override
    public ReservaDTO guardarReserva(ReservaDTO reservaDTO){

        Cubiculo cubiculo = cubiculoRepository.findById(reservaDTO.getIdCubiculo()).orElseThrow();

        Reserva reserva = new Reserva();
        reserva.setFecha(reservaDTO.getFecha());
        reserva.setHoraInicio(reservaDTO.getHoraInicio());
        reserva.setHoraFin(reservaDTO.getHoraFin());
        reserva.setEstado(reservaDTO.getEstado());
        reserva.setCubiculo(cubiculo);

        reserva = reservaRepository.save(reserva);

        return convertirDTO(reserva);
    }

    @Override
    public List<ReservaDTO> obtenerReservas(){

        return reservaRepository.findAll()
                .stream()
                .map(this::convertirDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReservaDTO obtenerReservaPorId(Integer id){

        Reserva reserva = reservaRepository.findById(id).orElseThrow();

        return convertirDTO(reserva);
    }

    @Override
    public ReservaDTO actualizarReserva(Integer id, ReservaDTO reservaDTO){

        Reserva reserva = reservaRepository.findById(id).orElseThrow();

        Cubiculo cubiculo = cubiculoRepository.findById(reservaDTO.getIdCubiculo()).orElseThrow();

        reserva.setFecha(reservaDTO.getFecha());
        reserva.setHoraInicio(reservaDTO.getHoraInicio());
        reserva.setHoraFin(reservaDTO.getHoraFin());
        reserva.setEstado(reservaDTO.getEstado());
        reserva.setCubiculo(cubiculo);

        reservaRepository.save(reserva);

        return convertirDTO(reserva);
    }

    @Override
    public void eliminarReserva(Integer id){

        reservaRepository.deleteById(id);

    }

}