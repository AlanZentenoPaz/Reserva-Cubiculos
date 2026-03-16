package mx.uam.cua.proyecto.cubiculos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {

    @GetMapping("/api/test2")
    public String test2() {
        return "API funcionando correctamente - Carlos Miguel Aguilar Chaparro";
    }
    @GetMapping("/api/test1")
    public String test1() {
        return "API funcionando correctamente - Alan Zenteno Paz";
    }


}


