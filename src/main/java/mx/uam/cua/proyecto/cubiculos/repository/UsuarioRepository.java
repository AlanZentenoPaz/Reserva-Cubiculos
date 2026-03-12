package mx.uam.cua.proyecto.cubiculos.repository;

import mx.uam.cua.proyecto.cubiculos.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

}