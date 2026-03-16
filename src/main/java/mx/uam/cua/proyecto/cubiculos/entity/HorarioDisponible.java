package mx.uam.cua.proyecto.cubiculos.entity;



import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name="Horario_Disponible")

public class HorarioDisponible {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idHorario;

    private String diaSemana;

    private LocalTime horaInicio;

    private LocalTime horaFin;

    public HorarioDisponible() {
    }

    public HorarioDisponible(Integer idHorario, String diaSemana, LocalTime horaInicio, LocalTime horaFin) {
        this.idHorario = idHorario;
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }

    public Integer getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Integer idHorario) {
        this.idHorario = idHorario;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

}




dto - HorarioDisponible_DTO

package mx.uam.cua.proyecto.cubiculos.dto;

import java.time.LocalTime;

public class HorarioDisponibleDTO {

    private Integer idHorario;
    private String diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    public HorarioDisponibleDTO() {
    }

    public HorarioDisponibleDTO(Integer idHorario, String diaSemana, LocalTime horaInicio, LocalTime horaFin) {
        this.idHorario = idHorario;
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }

    public Integer getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Integer idHorario) {
        this.idHorario = idHorario;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

}




repository - HorarioDisponibleRepository

package mx.uam.cua.proyecto.cubiculos.repository;

import mx.uam.reservas.entity.HorarioDisponible;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HorarioDisponibleRepository extends JpaRepository<HorarioDisponible, Integer> {

}




service - HorarioDisponibleService


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




impl - HorarioDisponibleServiceImpl

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



controller - HorarioDisponibleController


package mx.uam.cua.proyecto.cubiculos.controller;

import mx.uam.reservas.dto.HorarioDisponibleDTO;
import mx.uam.reservas.service.HorarioDisponibleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/horarios")

public class HorarioDisponibleController {

    @Autowired
    private HorarioDisponibleService service;

    @PostMapping
    public HorarioDisponibleDTO crear(@RequestBody HorarioDisponibleDTO dto){

        return service.guardarHorario(dto);
    }

    @GetMapping
    public List<HorarioDisponibleDTO> obtener(){

        return service.obtenerHorarios();
    }

    @GetMapping("/{id}")
    public HorarioDisponibleDTO obtenerPorId(@PathVariable Integer id){

        return service.obtenerHorarioPorId(id);
    }

    @PutMapping("/{id}")
    public HorarioDisponibleDTO actualizar(@PathVariable Integer id,
                                           @RequestBody HorarioDisponibleDTO dto){

        return service.actualizarHorario(id,dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id){

        service.eliminarHorario(id);
    }

}