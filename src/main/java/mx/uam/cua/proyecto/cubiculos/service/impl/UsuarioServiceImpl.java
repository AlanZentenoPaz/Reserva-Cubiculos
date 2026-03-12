package mx.uam.cua.proyecto.cubiculos.service.impl;

import mx.uam.cua.proyecto.cubiculos.dto.UsuarioDTO;
import mx.uam.cua.proyecto.cubiculos.entity.Usuario;
import mx.uam.cua.proyecto.cubiculos.repository.UsuarioRepository;
import mx.uam.cua.proyecto.cubiculos.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private UsuarioDTO convertirDTO(Usuario usuario){

        return new UsuarioDTO(
                usuario.getIdUsuario(),
                usuario.getMatricula(),
                usuario.getNumeroEmpleado(),
                usuario.getNombre(),
                usuario.getApellidoPaterno(),
                usuario.getApellidoMaterno(),
                usuario.getCorreoInstitucional(),
                usuario.getTelefono(),
                usuario.getTipoUsuario(),
                usuario.getEstado()
        );
    }

    private Usuario convertirEntidad(UsuarioDTO dto){

        return new Usuario(
                dto.getIdUsuario(),
                dto.getMatricula(),
                dto.getNumeroEmpleado(),
                dto.getNombre(),
                dto.getApellidoPaterno(),
                dto.getApellidoMaterno(),
                dto.getCorreoInstitucional(),
                dto.getTelefono(),
                dto.getTipoUsuario(),
                dto.getEstado()
        );
    }

    @Override
    public UsuarioDTO guardarUsuario(UsuarioDTO usuarioDTO) {

        Usuario usuario = convertirEntidad(usuarioDTO);
        usuario = usuarioRepository.save(usuario);

        return convertirDTO(usuario);
    }

    @Override
    public List<UsuarioDTO> obtenerUsuarios() {

        return usuarioRepository.findAll()
                .stream()
                .map(this::convertirDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioDTO obtenerUsuarioPorId(Integer id) {

        Usuario usuario = usuarioRepository.findById(id).orElseThrow();

        return convertirDTO(usuario);
    }

    @Override
    public UsuarioDTO actualizarUsuario(Integer id, UsuarioDTO usuarioDTO) {

        Usuario usuario = usuarioRepository.findById(id).orElseThrow();

        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellidoPaterno(usuarioDTO.getApellidoPaterno());
        usuario.setCorreoInstitucional(usuarioDTO.getCorreoInstitucional());
        usuario.setTelefono(usuarioDTO.getTelefono());

        usuarioRepository.save(usuario);

        return convertirDTO(usuario);
    }

    @Override
    public void eliminarUsuario(Integer id) {

        usuarioRepository.deleteById(id);

    }

}