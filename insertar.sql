INSERT INTO Usuario (
    matricula,
    numero_empleado,
    nombre,
    apellido_paterno,
    apellido_materno,
    correo_institucional,
    telefono,
    tipo_usuario,
    estado
)
VALUES
    ('2203065778', NULL, 'Alan', 'Zenteno', 'Paz', 'alan.zenteno@uam.mx', '5512345678', 'estudiante', 'activo'),

    (NULL, 'EMP1023', 'Carlos', 'Aguilar', 'Chaparro', 'carlos.aguilar@uam.mx', '5587654321', 'profesor', 'activo');


INSERT INTO Cubiculo (
    numero_cubiculo,
    capacidad,
    ubicacion,
    tipo,
    equipamiento,
    estado
)
VALUES
    ('C101', 1, 'Biblioteca Piso 6', 'individual', 'Escritorio, lámpara', 'disponible'),

    ('C202', 4, 'Biblioteca Piso 6', 'grupal', 'Mesa grande, pizarrón, monitor', 'disponible');


INSERT INTO Horario_Disponible (
    id_cubiculo,
    dia_semana,
    hora_inicio,
    hora_fin
)
VALUES
    (1, 'lunes', '09:00:00', '12:00:00'),

    (2, 'martes', '13:00:00', '16:00:00');


INSERT INTO Reserva (
    id_usuario,
    id_cubiculo,
    fecha_reserva,
    hora_inicio,
    hora_fin,
    motivo
)
VALUES
    (1, 1, '2026-03-20', '09:00:00', '10:30:00', 'Estudio individual'),

    (2, 2, '2026-03-21', '13:00:00', '15:00:00', 'Reunión de investigación');


INSERT INTO Sancion (
    id_usuario,
    motivo,
    activa
)
VALUES
    (1, 'No respetó horario de salida del cubículo', TRUE),

    (2, 'Uso indebido del cubículo', FALSE);

