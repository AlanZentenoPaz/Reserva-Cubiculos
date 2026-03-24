-- Eliminar la base de datos si existe
DROP DATABASE IF EXISTS sistema_reservas_cubiculos;

-- Crear la base de datos
CREATE DATABASE sistema_reservas_cubiculos;

-- Usar la base de datos
USE sistema_reservas_cubiculos;

-- Crear tabla Usuario (con nombres iguales a los de Java)
CREATE TABLE usuario (
                         idUsuario INT AUTO_INCREMENT PRIMARY KEY,
                         matricula VARCHAR(20) UNIQUE,
                         numeroEmpleado VARCHAR(20) UNIQUE,
                         nombre VARCHAR(100) NOT NULL,
                         apellidoPaterno VARCHAR(100) NOT NULL,
                         apellidoMaterno VARCHAR(100),
                         correoInstitucional VARCHAR(150) UNIQUE NOT NULL,
                         telefono VARCHAR(20),
                         tipoUsuario ENUM('estudiante','profesor') NOT NULL,
                         estado ENUM('activo','suspendido') DEFAULT 'activo',
                         fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla Cubiculo (con nombres iguales a los de Java)
CREATE TABLE cubiculo (
                          idCubiculo INT AUTO_INCREMENT PRIMARY KEY,
                          numeroCubiculo VARCHAR(10) UNIQUE NOT NULL,
                          capacidad INT NOT NULL,
                          ubicacion VARCHAR(100),
                          tipo ENUM('individual','grupal') NOT NULL,
                          equipamiento VARCHAR(255),
                          estado ENUM('disponible','mantenimiento','fuera_servicio') DEFAULT 'disponible'
);

-- Crear tabla Horario_Disponible (con nombres iguales a los de Java)
CREATE TABLE horario_disponible (
                                    idHorario INT AUTO_INCREMENT PRIMARY KEY,
                                    idCubiculo INT NOT NULL,
                                    diaSemana ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
                                    horaInicio TIME NOT NULL,
                                    horaFin TIME NOT NULL,
                                    CONSTRAINT fk_horario_cubiculo
                                        FOREIGN KEY (idCubiculo)
                                            REFERENCES cubiculo(idCubiculo)
                                            ON DELETE CASCADE
);

-- Crear tabla Reserva (con nombres iguales a los de Java)
CREATE TABLE reserva (
                         idReserva INT AUTO_INCREMENT PRIMARY KEY,
                         idUsuario INT NOT NULL,
                         idCubiculo INT NOT NULL,
                         fechaReserva DATE NOT NULL,
                         horaInicio TIME NOT NULL,
                         horaFin TIME NOT NULL,
                         motivo VARCHAR(255),
                         fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_reserva_usuario
                             FOREIGN KEY (idUsuario)
                                 REFERENCES usuario(idUsuario)
                                 ON DELETE CASCADE,
                         CONSTRAINT fk_reserva_cubiculo
                             FOREIGN KEY (idCubiculo)
                                 REFERENCES cubiculo(idCubiculo)
                                 ON DELETE CASCADE
);

-- Crear tabla Sancion (con nombres iguales a los de Java)
CREATE TABLE sancion (
                         idSancion INT AUTO_INCREMENT PRIMARY KEY,
                         idUsuario INT NOT NULL,
                         motivo VARCHAR(255) NOT NULL,
                         fechaInicio DATE NOT NULL,
                         fechaFin DATE NOT NULL,
                         estado ENUM('activa','cumplida','cancelada') DEFAULT 'activa',
                         CONSTRAINT fk_sancion_usuario
                             FOREIGN KEY (idUsuario)
                                 REFERENCES usuario(idUsuario)
                                 ON DELETE CASCADE
);

-- Crear índices
CREATE INDEX idx_reserva_fecha ON reserva(fechaReserva);
CREATE INDEX idx_reserva_cubiculo ON reserva(idCubiculo);
CREATE INDEX idx_reserva_usuario ON reserva(idUsuario);

-- Insertar datos de prueba
INSERT INTO usuario (matricula, numeroEmpleado, nombre, apellidoPaterno, apellidoMaterno, correoInstitucional, telefono, tipoUsuario, estado) VALUES
                                                                                                                                                  ('A01234567', NULL, 'Juan', 'Pérez', 'García', 'juan.perez@universidad.edu', '5512345678', 'estudiante', 'activo'),
                                                                                                                                                  ('A01234568', NULL, 'Ana', 'Martínez', 'López', 'ana.martinez@universidad.edu', '5512345679', 'estudiante', 'activo'),
                                                                                                                                                  (NULL, 'EMP001', 'María', 'López', 'Martínez', 'maria.lopez@universidad.edu', '5587654321', 'profesor', 'activo'),
                                                                                                                                                  (NULL, 'EMP002', 'Carlos', 'Rodríguez', 'Sánchez', 'carlos.rodriguez@universidad.edu', '5587654322', 'profesor', 'activo');

INSERT INTO cubiculo (numeroCubiculo, capacidad, ubicacion, tipo, equipamiento, estado) VALUES
                                                                                            ('C-101', 4, 'Edificio A - Piso 1', 'grupal', 'Computadora, Proyector, Pizarrón', 'disponible'),
                                                                                            ('C-102', 2, 'Edificio A - Piso 1', 'individual', 'Computadora, Pizarrón', 'disponible'),
                                                                                            ('C-103', 6, 'Edificio A - Piso 1', 'grupal', 'Computadora, Proyector, Pizarrón, Aire acondicionado', 'disponible'),
                                                                                            ('C-201', 4, 'Edificio A - Piso 2', 'grupal', 'Computadora, Proyector, Pizarrón', 'mantenimiento'),
                                                                                            ('C-202', 2, 'Edificio A - Piso 2', 'individual', 'Computadora', 'disponible');

INSERT INTO sancion (idUsuario, motivo, fechaInicio, fechaFin, estado) VALUES
                                                                           (1, 'Llegar tarde 3 veces consecutivas a las reservas', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'activa'),
                                                                           (2, 'Daño al equipo del cubículo', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'activa');

INSERT INTO reserva (idUsuario, idCubiculo, fechaReserva, horaInicio, horaFin, motivo) VALUES
                                                                                           (1, 1, CURDATE(), '10:00:00', '12:00:00', 'Estudio para examen final'),
                                                                                           (2, 2, CURDATE(), '14:00:00', '16:00:00', 'Trabajo en equipo'),
                                                                                           (3, 3, CURDATE(), '09:00:00', '11:00:00', 'Clase de investigación'),
                                                                                           (1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', '13:00:00', 'Preparación de tesis');

INSERT INTO horario_disponible (idCubiculo, diaSemana, horaInicio, horaFin) VALUES
                                                                                (1, 'lunes', '08:00:00', '20:00:00'),
                                                                                (1, 'martes', '08:00:00', '20:00:00'),
                                                                                (1, 'miercoles', '08:00:00', '20:00:00'),
                                                                                (1, 'jueves', '08:00:00', '20:00:00'),
                                                                                (1, 'viernes', '08:00:00', '20:00:00'),
                                                                                (2, 'lunes', '09:00:00', '18:00:00'),
                                                                                (2, 'martes', '09:00:00', '18:00:00'),
                                                                                (2, 'miercoles', '09:00:00', '18:00:00'),
                                                                                (3, 'lunes', '08:00:00', '22:00:00'),
                                                                                (3, 'martes', '08:00:00', '22:00:00');

-- Verificar los datos insertados
SELECT 'Usuarios:' as Tabla, COUNT(*) as Total FROM usuario
UNION ALL
SELECT 'Cubículos:', COUNT(*) FROM cubiculo
UNION ALL
SELECT 'Sanciones:', COUNT(*) FROM sancion
UNION ALL
SELECT 'Reservas:', COUNT(*) FROM reserva
UNION ALL
SELECT 'Horarios:', COUNT(*) FROM horario_disponible;