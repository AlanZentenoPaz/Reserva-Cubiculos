package mx.uam.cua.proyecto.cubiculos.entity;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "Horario_Disponible")
public class HorarioDisponible {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idHorario;

    private String diaSemana;

    private LocalTime horaInicio;

    private LocalTime horaFin;

    // 🔥 RELACIÓN CON CUBÍCULO
    @ManyToOne
    @JoinColumn(name = "idCubiculo")
    private Cubiculo cubiculo;

    public HorarioDisponible() {
    }

    public HorarioDisponible(Integer idHorario, String diaSemana, LocalTime horaInicio,
                             LocalTime horaFin, Cubiculo cubiculo) {
        this.idHorario = idHorario;
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.cubiculo = cubiculo;
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

    public Cubiculo getCubiculo() {
        return cubiculo;
    }

    public void setCubiculo(Cubiculo cubiculo) {
        this.cubiculo = cubiculo;
    }
}