package mx.uam.cua.proyecto.cubiculos.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaDTO {

    private Integer idReserva;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String estado;
    private Integer idCubiculo;
    private Integer idUsuario;

    public ReservaDTO() {
    }

    public ReservaDTO(Integer idReserva, LocalDate fecha, LocalTime horaInicio,
                      LocalTime horaFin, String estado, Integer idCubiculo, Integer idUsuario) {
        this.idReserva = idReserva;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.estado = estado;
        this.idCubiculo = idCubiculo;
        this.idUsuario = idUsuario;
    }

    // Getters y Setters
    public Integer getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Integer idReserva) {
        this.idReserva = idReserva;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getIdCubiculo() {
        return idCubiculo;
    }

    public void setIdCubiculo(Integer idCubiculo) {
        this.idCubiculo = idCubiculo;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
}