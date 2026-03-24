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
        actualizarTabla(horarios);

    } catch (error) {
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
        const selectCubiculo = document.getElementById('idCubiculo');

        if (selectCubiculo) {
            selectCubiculo.innerHTML = '<option value="">Seleccione un cubículo</option>';

            cubiculosData.forEach(cubiculo => {
                const option = document.createElement('option');
                option.value = cubiculo.idCubiculo;
                option.textContent = `${cubiculo.numeroCubiculo} - ${cubiculo.ubicacion} (${cubiculo.tipo})`;
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
        const cubiculo = cubiculosData.find(c => c.idCubiculo === horario.idCubiculo);
        const diaSemanaFormateado = formatearDiaSemana(horario.diaSemana);

        return `
            <tr>
                <td><span class="badge bg-secondary">${horario.idHorario}</span></td>
                <td>
                    <strong>${cubiculo ? cubiculo.numeroCubiculo : 'ID: ' + horario.idCubiculo}</strong>
                    <div class="small text-muted">${cubiculo ? cubiculo.ubicacion : ''}</div>
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
    const horario = {
        idCubiculo: parseInt(document.getElementById('idCubiculo').value),
        diaSemana: document.getElementById('diaSemana').value,
        horaInicio: document.getElementById('horaInicio').value,
        horaFin: document.getElementById('horaFin').value
    };

    try {
        const url = id ? `${API_HORARIOS}/${id}` : API_HORARIOS;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(horario)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al guardar el horario');
        }

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

    if (!idCubiculo || !diaSemana || !horaInicio || !horaFin) {
        mostrarNotificacion('warning', 'Complete todos los campos obligatorios');
        return false;
    }

    if (horaInicio >= horaFin) {
        mostrarNotificacion('warning', 'La hora de inicio debe ser menor a la hora de fin');
        return false;
    }

    // Validar que no exista un horario duplicado para el mismo cubículo y día
    const horaInicioNum = parseInt(horaInicio.replace(':', ''));
    const horaFinNum = parseInt(horaFin.replace(':', ''));

    // Esta validación se hace en el backend, pero podemos hacer una validación básica en frontend
    // si tenemos los datos cargados
    if (window.horariosExistentes && window.horariosExistentes.length > 0) {
        const existeDuplicado = window.horariosExistentes.some(h =>
            h.idCubiculo === parseInt(idCubiculo) &&
            h.diaSemana === diaSemana &&
            ((horaInicioNum >= parseInt(h.horaInicio.replace(':', '')) && horaInicioNum < parseInt(h.horaFin.replace(':', ''))) ||
                (horaFinNum > parseInt(h.horaInicio.replace(':', '')) && horaFinNum <= parseInt(h.horaFin.replace(':', ''))) ||
                (horaInicioNum <= parseInt(h.horaInicio.replace(':', '')) && horaFinNum >= parseInt(h.horaFin.replace(':', ''))))
        );

        if (existeDuplicado) {
            mostrarNotificacion('warning', 'Ya existe un horario para este cubículo en el mismo día y horario');
            return false;
        }
    }

    return true;
}

async function editarHorario(id) {
    try {
        const response = await fetch(`${API_HORARIOS}/${id}`);
        if (!response.ok) throw new Error('Error al obtener el horario');

        const horario = await response.json();

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

// Función para filtrar horarios por cubículo
function filtrarPorCubiculo(idCubiculo) {
    if (!idCubiculo || idCubiculo === 'todos') {
        cargarHorarios();
        return;
    }

    fetch(API_HORARIOS)
        .then(response => response.json())
        .then(horarios => {
            const filtrados = horarios.filter(h => h.idCubiculo === parseInt(idCubiculo));
            actualizarTabla(filtrados);
        })
        .catch(error => console.error('Error:', error));
}

// Función para filtrar horarios por día
function filtrarPorDia(dia) {
    if (!dia || dia === 'todos') {
        cargarHorarios();
        return;
    }

    fetch(API_HORARIOS)
        .then(response => response.json())
        .then(horarios => {
            const filtrados = horarios.filter(h => h.diaSemana === dia);
            actualizarTabla(filtrados);
        })
        .catch(error => console.error('Error:', error));
}

// Función para exportar horarios a Excel (opcional)
function exportarHorarios() {
    fetch(API_HORARIOS)
        .then(response => response.json())
        .then(horarios => {
            const datos = horarios.map(h => {
                const cubiculo = cubiculosData.find(c => c.idCubiculo === h.idCubiculo);
                return {
                    'ID': h.idHorario,
                    'Cubículo': cubiculo ? cubiculo.numeroCubiculo : h.idCubiculo,
                    'Ubicación': cubiculo ? cubiculo.ubicacion : '',
                    'Día': formatearDiaSemana(h.diaSemana),
                    'Hora Inicio': h.horaInicio,
                    'Hora Fin': h.horaFin
                };
            });

            // Convertir a CSV
            const headers = Object.keys(datos[0] || {});
            const csv = [
                headers.join(','),
                ...datos.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
            ].join('\n');

            // Descargar archivo
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'horarios.csv');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            mostrarNotificacion('success', 'Horarios exportados correctamente');
        })
        .catch(error => {
            console.error('Error:', error);
            manejarError(error, 'Error al exportar los horarios');
        });
}









