package mx.uam.cua.proyecto.cubiculos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="sancion") // 🔥 recomendable en minúsculas
public class Sancion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSancion;

    private String motivo;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private String estado;

    // 🔥 RELACIÓN
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    public Sancion() {
    }

    public Sancion(Integer idSancion, String motivo, LocalDate fechaInicio,
                   LocalDate fechaFin, String estado, Usuario usuario) {

        this.idSancion = idSancion;
        this.motivo = motivo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.usuario = usuario;
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

    // 🔥 ESTO TE FALTABA
    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}