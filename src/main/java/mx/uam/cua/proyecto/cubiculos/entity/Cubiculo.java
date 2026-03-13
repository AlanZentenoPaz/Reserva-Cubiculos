package mx.uam.cua.proyecto.cubiculos.entity;

import jakarta.persistence.*;

@Entity
@Table(name="Cubiculo")

public class Cubiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCubiculo;

    private String numeroCubiculo;

    private Integer capacidad;

    private String ubicacion;

    private String tipo;

    private String equipamiento;

    private String estado;

    public Cubiculo() {
    }

    public Cubiculo(Integer idCubiculo, String numeroCubiculo, Integer capacidad,
                    String ubicacion, String tipo, String equipamiento, String estado) {

        this.idCubiculo = idCubiculo;
        this.numeroCubiculo = numeroCubiculo;
        this.capacidad = capacidad;
        this.ubicacion = ubicacion;
        this.tipo = tipo;
        this.equipamiento = equipamiento;
        this.estado = estado;

    }

    public Integer getIdCubiculo() {
        return idCubiculo;
    }

    public void setIdCubiculo(Integer idCubiculo) {
        this.idCubiculo = idCubiculo;
    }

    public String getNumeroCubiculo() {
        return numeroCubiculo;
    }

    public void setNumeroCubiculo(String numeroCubiculo) {
        this.numeroCubiculo = numeroCubiculo;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getEquipamiento() {
        return equipamiento;
    }

    public void setEquipamiento(String equipamiento) {
        this.equipamiento = equipamiento;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

}
