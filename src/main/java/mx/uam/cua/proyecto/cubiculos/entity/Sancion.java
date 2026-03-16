package mx.uam.cua.proyecto.cubiculos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="Sancion")

public class Sancion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSancion;

    private String motivo;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private String estado;

    public Sancion() {
    }

    public Sancion(Integer idSancion, String motivo, LocalDate fechaInicio,
                   LocalDate fechaFin, String estado) {

        this.idSancion = idSancion;
        this.motivo = motivo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
    }

    public Integer getIdSancion() {
        return idSancion;
    }

    public void setIdSancion(Integer idSancion) {
        this.idSancion = idSancion;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

}









package mx.uam.cua.proyecto.cubiculos.dto;

import java.time.LocalDate;

public class SancionDTO {

    private Integer idSancion;
    private String motivo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;

    public SancionDTO(){}

    public SancionDTO(Integer idSancion, String motivo,
                      LocalDate fechaInicio, LocalDate fechaFin, String estado){

        this.idSancion = idSancion;
        this.motivo = motivo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
    }

    public Integer getIdSancion() {
        return idSancion;
    }

    public void setIdSancion(Integer idSancion) {
        this.idSancion = idSancion;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

}




repository - SancionRepository

package mx.uam.cua.proyecto.cubiculos.repository;

import mx.uam.reservas.entity.Sancion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SancionRepository extends JpaRepository<Sancion, Integer> {

}






service - SancionService


package mx.uam.cua.proyecto.cubiculos.service;

import mx.uam.reservas.dto.SancionDTO;
import java.util.List;

public interface SancionService {

    SancionDTO guardar(SancionDTO dto);

    List<SancionDTO> obtener();

    SancionDTO obtenerPorId(Integer id);

    SancionDTO actualizar(Integer id, SancionDTO dto);

    void eliminar(Integer id);

}





impl - SancionServiceImpl

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




controller - SancionController


package mx.uam.cua.proyecto.cubiculos.controller;

import mx.uam.reservas.dto.SancionDTO;
import mx.uam.reservas.service.SancionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/sanciones")

public class SancionController {

    @Autowired
    private SancionService service;

    @PostMapping
    public SancionDTO crear(@RequestBody SancionDTO dto){

        return service.guardar(dto);
    }

    @GetMapping
    public List<SancionDTO> obtener(){

        return service.obtener();
    }

    @GetMapping("/{id}")
    public SancionDTO obtenerPorId(@PathVariable Integer id){

        return service.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public SancionDTO actualizar(@PathVariable Integer id,
                                 @RequestBody SancionDTO dto){

        return service.actualizar(id,dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id){

        service.eliminar(id);
    }

}