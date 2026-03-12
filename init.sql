CREATE DATABASE sistema_reservas_cubiculos;
USE sistema_reservas_cubiculos;

CREATE TABLE Usuario (
                         id_usuario INT AUTO_INCREMENT PRIMARY KEY,
                         matricula VARCHAR(20) UNIQUE,
                         numero_empleado VARCHAR(20) UNIQUE,
                         nombre VARCHAR(100) NOT NULL,
                         apellido_paterno VARCHAR(100) NOT NULL,
                         apellido_materno VARCHAR(100),
                         correo_institucional VARCHAR(150) UNIQUE NOT NULL,
                         telefono VARCHAR(20),
                         tipo_usuario ENUM('estudiante','profesor') NOT NULL,
                         estado ENUM('activo','suspendido') DEFAULT 'activo',
                         fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Cubiculo (
                          id_cubiculo INT AUTO_INCREMENT PRIMARY KEY,
                          numero_cubiculo VARCHAR(10) UNIQUE NOT NULL,
                          capacidad INT NOT NULL,
                          ubicacion VARCHAR(100),
                          tipo ENUM('individual','grupal') NOT NULL,
                          equipamiento VARCHAR(255),
                          estado ENUM('disponible','mantenimiento','fuera_servicio') DEFAULT 'disponible'
);

CREATE TABLE Horario_Disponible (
                                    id_horario INT AUTO_INCREMENT PRIMARY KEY,
                                    id_cubiculo INT NOT NULL,
                                    dia_semana ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
                                    hora_inicio TIME NOT NULL,
                                    hora_fin TIME NOT NULL,

                                    CONSTRAINT fk_horario_cubiculo
                                        FOREIGN KEY (id_cubiculo)
                                            REFERENCES Cubiculo(id_cubiculo)
                                            ON DELETE CASCADE
);

CREATE TABLE Reserva (
                         id_reserva INT AUTO_INCREMENT PRIMARY KEY,
                         id_usuario INT NOT NULL,
                         id_cubiculo INT NOT NULL,
                         fecha_reserva DATE NOT NULL,
                         hora_inicio TIME NOT NULL,
                         hora_fin TIME NOT NULL,
                         motivo VARCHAR(255),
                         fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,

                         CONSTRAINT fk_reserva_usuario
                             FOREIGN KEY (id_usuario)
                                 REFERENCES Usuario(id_usuario)
                                 ON DELETE CASCADE,

                         CONSTRAINT fk_reserva_cubiculo
                             FOREIGN KEY (id_cubiculo)
                                 REFERENCES Cubiculo(id_cubiculo)
                                 ON DELETE CASCADE
);

CREATE TABLE Sancion (
                         id_sancion INT AUTO_INCREMENT PRIMARY KEY,
                         id_usuario INT NOT NULL,
                         motivo VARCHAR(255) NOT NULL,
                         activa BOOLEAN DEFAULT TRUE,
                         fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,

                         CONSTRAINT fk_sancion_usuario
                             FOREIGN KEY (id_usuario)
                                 REFERENCES Usuario(id_usuario)
                                 ON DELETE CASCADE
);

CREATE INDEX idx_reserva_fecha ON Reserva(fecha_reserva);
CREATE INDEX idx_reserva_cubiculo ON Reserva(id_cubiculo);
CREATE INDEX idx_reserva_usuario ON Reserva(id_usuario);


DELIMITER $$

CREATE TRIGGER validar_fecha_reserva
    BEFORE INSERT ON Reserva
    FOR EACH ROW
BEGIN
    IF NEW.fecha_reserva < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se pueden hacer reservas en fechas pasadas';
END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER evitar_traslape_reservas
    BEFORE INSERT ON Reserva
    FOR EACH ROW
BEGIN

    IF EXISTS (
    SELECT 1
    FROM Reserva
    WHERE id_cubiculo = NEW.id_cubiculo
    AND fecha_reserva = NEW.fecha_reserva
    AND (
        NEW.hora_inicio < hora_fin AND
        NEW.hora_fin > hora_inicio
    )
) THEN

    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El cubículo ya está reservado en ese horario';

END IF;

END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER validar_usuario_sancionado
    BEFORE INSERT ON Reserva
    FOR EACH ROW
BEGIN

    IF EXISTS (
    SELECT 1
    FROM Sancion
    WHERE id_usuario = NEW.id_usuario
    AND activa = TRUE
) THEN

    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El usuario tiene una sanción activa y no puede reservar';

END IF;

END$$

DELIMITER ;