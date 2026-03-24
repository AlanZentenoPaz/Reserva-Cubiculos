package mx.uam.cua.proyecto.cubiculos.dto;

import java.time.LocalTime;

public class HorarioDisponibleDTO {

    private Integer idHorario;
    private String diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private Integer idCubiculo;  // 🔥 Agregar idCubiculo

    public HorarioDisponibleDTO() {
    }

    public HorarioDisponibleDTO(Integer idHorario, String diaSemana, LocalTime horaInicio,
                                LocalTime horaFin, Integer idCubiculo) {
        this.idHorario = idHorario;
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.idCubiculo = idCubiculo;
    }

    // Getters y Setters
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

    public Integer getIdCubiculo() {
        return idCubiculo;
    }

    public void setIdCubiculo(Integer idCubiculo) {
        this.idCubiculo = idCubiculo;
    }
}