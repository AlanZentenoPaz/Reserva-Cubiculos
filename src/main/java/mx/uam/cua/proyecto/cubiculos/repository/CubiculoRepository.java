package mx.uam.cua.proyecto.cubiculos.repository;

import mx.uam.cua.proyecto.cubiculos.entity.Cubiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CubiculoRepository extends JpaRepository<Cubiculo, Integer> {

}
