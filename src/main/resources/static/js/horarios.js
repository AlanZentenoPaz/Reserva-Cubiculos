// Configuración de la API
const API_HORARIOS = `${API_BASE_URL}/horarios`;
const API_CUBICULOS = `${API_BASE_URL}/cubiculos`;

let idEliminar = null;
let cubiculosData = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarHorarios();
    cargarCubiculos();
});

async function cargarHorarios() {
    try {
        mostrarLoading();

        const response = await fetch(API_HORARIOS);
        if (!response.ok) throw new Error('Error al cargar horarios');

        const horarios = await response.json();
        console.log('Horarios cargados:', horarios);
        actualizarTabla(horarios);

    } catch (error) {
        console.error('Error:', error);
        manejarError(error, 'No se pudieron cargar los horarios');
        mostrarErrorTabla();
    } finally {
        ocultarLoading();
    }
}

async function cargarCubiculos() {
    try {
        const response = await fetch(API_CUBICULOS);
        if (!response.ok) throw new Error('Error al cargar cubículos');

        cubiculosData = await response.json();
        console.log('Cubículos cargados:', cubiculosData);

        const selectCubiculo = document.getElementById('idCubiculo');

        if (selectCubiculo) {
            selectCubiculo.innerHTML = '<option value="">Seleccione un cubículo</option>';

            cubiculosData.forEach(cubiculo => {
                const option = document.createElement('option');
                option.value = cubiculo.idCubiculo;
                option.textContent = `${cubiculo.numeroCubiculo} - ${cubiculo.ubicacion} (Cap: ${cubiculo.capacidad}) - ${cubiculo.tipo}`;
                selectCubiculo.appendChild(option);
            });
        }

    } catch (error) {
        console.error('Error cargando cubículos:', error);
        mostrarNotificacion('error', 'Error al cargar la lista de cubículos');
    }
}

function actualizarTabla(horarios) {
    const tbody = document.getElementById('horariosTableBody');

    if (!tbody) return;

    if (!horarios || horarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="bi bi-clock display-4 d-block text-muted mb-3"></i>
                    <p class="text-muted">No hay horarios registrados</p>
                    <button class="btn btn-info btn-sm" onclick="abrirModalCrear()">
                        <i class="bi bi-plus-circle me-2"></i>Agregar horario
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = horarios.map(horario => {
        // Buscar el cubículo por ID
        const cubiculo = cubiculosData.find(c => c.idCubiculo === horario.idCubiculo);
        const numeroCubiculo = cubiculo ? cubiculo.numeroCubiculo : 'ID: ' + horario.idCubiculo;
        const ubicacion = cubiculo ? cubiculo.ubicacion : '';

        const diaSemanaFormateado = formatearDiaSemana(horario.diaSemana);

        return `
            <tr>
                <td><span class="badge bg-secondary">${horario.idHorario}</span></td>
                <td>
                    <strong>${numeroCubiculo}</strong>
                    <div class="small text-muted">${ubicacion}</div>
                </td>
                <td><span class="badge bg-primary">${diaSemanaFormateado}</span></td>
                <td><i class="bi bi-clock me-1"></i>${formatearHora(horario.horaInicio)}</td>
                <td><i class="bi bi-clock me-1"></i>${formatearHora(horario.horaFin)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarHorario(${horario.idHorario})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="mostrarModalEliminar(${horario.idHorario})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function formatearDiaSemana(dia) {
    const dias = {
        'lunes': 'Lunes',
        'martes': 'Martes',
        'miercoles': 'Miércoles',
        'jueves': 'Jueves',
        'viernes': 'Viernes',
        'sabado': 'Sábado',
        'domingo': 'Domingo'
    };
    return dias[dia] || dia;
}

function formatearHora(horaStr) {
    if (!horaStr) return 'N/A';
    if (typeof horaStr === 'string' && horaStr.length > 5) {
        return horaStr.substring(0, 5);
    }
    return horaStr;
}

function mostrarErrorTabla() {
    const tbody = document.getElementById('horariosTableBody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-4">
                <i class="bi bi-exclamation-triangle text-warning display-4 d-block mb-3"></i>
                <h6 class="text-danger">Error al cargar los datos</h6>
                <button class="btn btn-info btn-sm mt-2" onclick="cargarHorarios()">
                    <i class="bi bi-arrow-repeat me-2"></i>Reintentar
                </button>
            </td>
        </tr>
    `;
}

async function guardarHorario() {
    if (!validarFormulario()) return;

    const id = document.getElementById('horarioId').value;
    const idCubiculo = document.getElementById('idCubiculo').value;

    if (!idCubiculo) {
        mostrarNotificacion('warning', 'Por favor seleccione un cubículo');
        return;
    }

    const horario = {
        idCubiculo: parseInt(idCubiculo),
        diaSemana: document.getElementById('diaSemana').value,
        horaInicio: document.getElementById('horaInicio').value,
        horaFin: document.getElementById('horaFin').value
    };

    console.log('Guardando horario:', horario);

    try {
        const url = id ? `${API_HORARIOS}/${id}` : API_HORARIOS;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(horario)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(errorText || 'Error al guardar el horario');
        }

        const result = await response.json();
        console.log('Horario guardado:', result);

        const modal = bootstrap.Modal.getInstance(document.getElementById('horarioModal'));
        if (modal) modal.hide();

        mostrarNotificacion('success', id ? 'Horario actualizado correctamente' : 'Horario creado correctamente');
        cargarHorarios();
        limpiarFormulario();

    } catch (error) {
        console.error('Error:', error);
        manejarError(error, error.message || 'Error al guardar el horario');
    }
}

function validarFormulario() {
    const idCubiculo = document.getElementById('idCubiculo').value;
    const diaSemana = document.getElementById('diaSemana').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFin = document.getElementById('horaFin').value;

    if (!idCubiculo) {
        mostrarNotificacion('warning', 'Seleccione un cubículo');
        return false;
    }

    if (!diaSemana) {
        mostrarNotificacion('warning', 'Seleccione un día de la semana');
        return false;
    }

    if (!horaInicio || !horaFin) {
        mostrarNotificacion('warning', 'Complete las horas de inicio y fin');
        return false;
    }

    if (horaInicio >= horaFin) {
        mostrarNotificacion('warning', 'La hora de inicio debe ser menor a la hora de fin');
        return false;
    }

    return true;
}

async function editarHorario(id) {
    try {
        const response = await fetch(`${API_HORARIOS}/${id}`);
        if (!response.ok) throw new Error('Error al obtener el horario');

        const horario = await response.json();
        console.log('Editando horario:', horario);

        document.getElementById('horarioId').value = horario.idHorario;
        document.getElementById('idCubiculo').value = horario.idCubiculo;
        document.getElementById('diaSemana').value = horario.diaSemana;
        document.getElementById('horaInicio').value = horario.horaInicio;
        document.getElementById('horaFin').value = horario.horaFin;

        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Horario';

        const modal = new bootstrap.Modal(document.getElementById('horarioModal'));
        modal.show();

    } catch (error) {
        console.error('Error:', error);
        manejarError(error, 'No se pudo cargar la información del horario');
    }
}

function mostrarModalEliminar(id) {
    idEliminar = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

async function confirmarEliminar() {
    if (!idEliminar) return;

    try {
        const response = await fetch(`${API_HORARIOS}/${idEliminar}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar el horario');
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        if (modal) modal.hide();

        mostrarNotificacion('success', 'Horario eliminado correctamente');
        cargarHorarios();

    } catch (error) {
        console.error('Error:', error);
        manejarError(error, error.message || 'Error al eliminar el horario');
    } finally {
        idEliminar = null;
    }
}

function limpiarFormulario() {
    const form = document.getElementById('horarioForm');
    if (form) form.reset();

    const horarioId = document.getElementById('horarioId');
    if (horarioId) horarioId.value = '';

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nuevo Horario';

    // Valores por defecto
    const horaInicio = document.getElementById('horaInicio');
    const horaFin = document.getElementById('horaFin');
    if (horaInicio) horaInicio.value = '08:00';
    if (horaFin) horaFin.value = '17:00';
}

function abrirModalCrear() {
    limpiarFormulario();
    const modal = new bootstrap.Modal(document.getElementById('horarioModal'));
    modal.show();
}