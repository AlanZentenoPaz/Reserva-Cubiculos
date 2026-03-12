package mx.uam.cua.proyecto.cubiculos.controller;

import mx.uam.cua.proyecto.cubiculos.dto.UsuarioDTO;
import mx.uam.cua.proyecto.cubiculos.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")

public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public UsuarioDTO crearUsuario(@RequestBody UsuarioDTO usuarioDTO){

        return usuarioService.guardarUsuario(usuarioDTO);

    }

    @GetMapping
    public List<UsuarioDTO> obtenerUsuarios(){

        return usuarioService.obtenerUsuarios();

    }

    @GetMapping("/{id}")
    public UsuarioDTO obtenerUsuario(@PathVariable Integer id){

        return usuarioService.obtenerUsuarioPorId(id);

    }

    @PutMapping("/{id}")
    public UsuarioDTO actualizarUsuario(@PathVariable Integer id,
                                        @RequestBody UsuarioDTO usuarioDTO){

        return usuarioService.actualizarUsuario(id, usuarioDTO);

    }

    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Integer id){

        usuarioService.eliminarUsuario(id);

    }

}