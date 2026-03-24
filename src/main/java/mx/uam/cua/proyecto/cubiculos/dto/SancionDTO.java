package mx.uam.cua.proyecto.cubiculos.dto;

import java.time.LocalDate;

public class SancionDTO {

    private Integer idSancion;
    private String motivo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;

    private Integer idUsuario;

    public SancionDTO(){}

    public SancionDTO(Integer idSancion, String motivo,
                      LocalDate fechaInicio, LocalDate fechaFin,
                      String estado, Integer idUsuario){

        this.idSancion = idSancion;
        this.motivo = motivo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.idUsuario = idUsuario;
    }

    //GETTERS Y SETTERS

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

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
}