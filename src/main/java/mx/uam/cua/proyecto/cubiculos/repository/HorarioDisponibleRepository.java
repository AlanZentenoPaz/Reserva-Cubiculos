package mx.uam.cua.proyecto.cubiculos.repository;

import mx.uam.cua.proyecto.cubiculos.entity.HorarioDisponible;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HorarioDisponibleRepository extends JpaRepository<HorarioDisponible, Integer> {

}



