package mx.uam.cua.proyecto.cubiculos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {

    @GetMapping("/api/test1")
    public String test() {
        return "API funcionando correctamente - Alan Zenteno Paz";
    }

}