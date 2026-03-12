package mx.uam.cua.proyecto.cubiculos.service;

import mx.uam.cua.proyecto.cubiculos.dto.UsuarioDTO;

import java.util.List;

public interface UsuarioService {

    UsuarioDTO guardarUsuario(UsuarioDTO usuarioDTO);

    List<UsuarioDTO> obtenerUsuarios();

    UsuarioDTO obtenerUsuarioPorId(Integer id);

    UsuarioDTO actualizarUsuario(Integer id, UsuarioDTO usuarioDTO);

    void eliminarUsuario(Integer id);

}