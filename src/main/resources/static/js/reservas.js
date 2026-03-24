// Configuración de la API
const API_RESERVAS = `${API_BASE_URL}/reservas`;
const API_CUBICULOS = `${API_BASE_URL}/cubiculos`;
const API_USUARIOS = `${API_BASE_URL}/usuarios`;

let idEliminar = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarReservas();
    cargarCubiculos();
    cargarUsuarios();
});

async function cargarReservas() {
    try {
        mostrarLoading();

        const response = await fetch(API_RESERVAS);
        if (!response.ok) throw new Error('Error al cargar reservas');

        const reservas = await response.json();
        console.log('Reservas cargadas:', reservas);
        actualizarTabla(reservas);

    } catch (error) {
        console.error('Error:', error);
        manejarError(error, 'No se pudieron cargar las reservas');
        mostrarErrorTabla();
    } finally {
        ocultarLoading();
    }
}

async function cargarCubiculos() {
    try {
        const response = await fetch(API_CUBICULOS);
        if (!response.ok) throw new Error('Error al cargar cubículos');

        const cubiculos = await response.json();
        const selectCubiculo = document.getElementById('idCubiculo');

        if (selectCubiculo) {
            selectCubiculo.innerHTML = '<option value="">Seleccione un cubículo</option>';

            cubiculos.forEach(cubiculo => {
                // Mostrar todos los cubículos disponibles y en mantenimiento
                if (cubiculo.estado === 'disponible' || cubiculo.estado === 'mantenimiento') {
                    const option = document.createElement('option');
                    option.value = cubiculo.idCubiculo;
                    option.textContent = `${cubiculo.numeroCubiculo} - Cap: ${cubiculo.capacidad} - ${cubiculo.ubicacion} (${cubiculo.estado === 'disponible' ? 'Disponible' : 'En mantenimiento'})`;
                    selectCubiculo.appendChild(option);
                }
            });
        }

    } catch (error) {
        console.error('Error cargando cubículos:', error);
        mostrarNotificacion('error', 'Error al cargar la lista de cubículos');
    }
}

async function cargarUsuarios() {
    try {
        const response = await fetch(API_USUARIOS);
        if (!response.ok) throw new Error('Error al cargar usuarios');

        const usuarios = await response.json();
        const selectUsuario = document.getElementById('idUsuario');

        if (selectUsuario) {
            selectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>';

            usuarios.forEach(usuario => {
                if (usuario.estado === 'activo') {
                    const option = document.createElement('option');
                    option.value = usuario.idUsuario;
                    const identificador = usuario.matricula || usuario.numeroEmpleado || 'ID: ' + usuario.idUsuario;
                    option.textContent = `${usuario.nombre} ${usuario.apellidoPaterno} - ${identificador}`;
                    selectUsuario.appendChild(option);
                }
            });
        }

    } catch (error) {
        console.error('Error cargando usuarios:', error);
        mostrarNotificacion('error', 'Error al cargar la lista de usuarios');
    }
}

function actualizarTabla(reservas) {
    const tbody = document.getElementById('reservasTableBody');

    if (!reservas || reservas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <i class="bi bi-calendar-x display-4 d-block text-muted mb-3"></i>
                    <p class="text-muted">No hay reservas registradas</p>
                    <button class="btn btn-success btn-sm" onclick="abrirModalCrear()">
                        <i class="bi bi-plus-circle me-2"></i>Nueva reserva
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = reservas.map(reserva => {
        // Determinar el badge de estado
        let estadoBadge = '';
        if (reserva.estado === 'activa') {
            estadoBadge = '<span class="badge bg-success">Activa</span>';
        } else if (reserva.estado === 'cancelada') {
            estadoBadge = '<span class="badge bg-danger">Cancelada</span>';
        } else if (reserva.estado === 'completada') {
            estadoBadge = '<span class="badge bg-secondary">Completada</span>';
        } else {
            estadoBadge = '<span class="badge bg-info">' + (reserva.estado || 'Pendiente') + '</span>';
        }

        return `
            <tr>
                <td><span class="badge bg-secondary">${reserva.idReserva || 'N/A'}</span></td>
                <td><strong>Usuario ID: ${reserva.idUsuario || 'N/A'}</strong></td>
                <td><strong>Cubículo ID: ${reserva.idCubiculo || 'N/A'}</strong></td>
                <td>${formatearFecha(reserva.fecha)}</td>
                <td>${formatearHora(reserva.horaInicio)}</td>
                <td>${formatearHora(reserva.horaFin)}</td>
                <td>${estadoBadge}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarReserva(${reserva.idReserva})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="mostrarModalEliminar(${reserva.idReserva})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function mostrarErrorTabla() {
    const tbody = document.getElementById('reservasTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <i class="bi bi-exclamation-triangle text-warning display-4 d-block mb-3"></i>
                    <h6 class="text-danger">Error al cargar los datos</h6>
                    <p class="text-muted">Verifica que el backend esté corriendo en ${API_BASE_URL}</p>
                    <button class="btn btn-success btn-sm mt-2" onclick="cargarReservas()">
                        <i class="bi bi-arrow-repeat me-2"></i>Reintentar
                    </button>
                </td>
            </tr>
        `;
    }
}

async function guardarReserva() {
    if (!validarFormulario()) return;

    const id = document.getElementById('reservaId').value;
    const reserva = {
        idUsuario: parseInt(document.getElementById('idUsuario').value),
        idCubiculo: parseInt(document.getElementById('idCubiculo').value),
        fecha: document.getElementById('fecha').value,
        horaInicio: document.getElementById('horaInicio').value,
        horaFin: document.getElementById('horaFin').value,
        estado: document.getElementById('estado').value
    };

    console.log('Guardando reserva:', reserva);

    try {
        const url = id ? `${API_RESERVAS}/${id}` : API_RESERVAS;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(reserva)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(errorText || 'Error al guardar la reserva');
        }

        const result = await response.json();
        console.log('Reserva guardada:', result);

        const modal = bootstrap.Modal.getInstance(document.getElementById('reservaModal'));
        if (modal) modal.hide();

        mostrarNotificacion('success', id ? 'Reserva actualizada correctamente' : 'Reserva creada correctamente');
        cargarReservas();
        limpiarFormulario();

    } catch (error) {
        console.error('Error:', error);
        manejarError(error, error.message || 'Error al guardar la reserva');
    }
}

function validarFormulario() {
    const idUsuario = document.getElementById('idUsuario').value;
    const idCubiculo = document.getElementById('idCubiculo').value;
    const fecha = document.getElementById('fecha').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFin = document.getElementById('horaFin').value;

    if (!idUsuario || !idCubiculo || !fecha || !horaInicio || !horaFin) {
        mostrarNotificacion('warning', 'Complete todos los campos obligatorios');
        return false;
    }

    const fechaObj = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaObj < hoy) {
        mostrarNotificacion('warning', 'No se pueden hacer reservas en fechas pasadas');
        return false;
    }

    if (horaInicio >= horaFin) {
        mostrarNotificacion('warning', 'La hora de inicio debe ser menor a la hora de fin');
        return false;
    }

    return true;
}

async function editarReserva(id) {
    try {
        const response = await fetch(`${API_RESERVAS}/${id}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al obtener la reserva');
        }

        const reserva = await response.json();
        console.log('Editando reserva:', reserva);

        document.getElementById('reservaId').value = reserva.idReserva;
        document.getElementById('idUsuario').value = reserva.idUsuario;
        document.getElementById('idCubiculo').value = reserva.idCubiculo;
        document.getElementById('fecha').value = reserva.fecha;
        document.getElementById('horaInicio').value = reserva.horaInicio;
        document.getElementById('horaFin').value = reserva.horaFin;
        document.getElementById('estado').value = reserva.estado || 'activa';

        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Reserva';

        const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
        modal.show();

    } catch (error) {
        console.error('Error:', error);
        manejarError(error, 'No se pudo cargar la información de la reserva');
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
        const response = await fetch(`${API_RESERVAS}/${idEliminar}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar la reserva');
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        if (modal) modal.hide();

        mostrarNotificacion('success', 'Reserva eliminada correctamente');
        cargarReservas();

    } catch (error) {
        console.error('Error:', error);
        manejarError(error, error.message || 'Error al eliminar la reserva');
    } finally {
        idEliminar = null;
    }
}

function limpiarFormulario() {
    const form = document.getElementById('reservaForm');
    if (form) form.reset();

    const reservaId = document.getElementById('reservaId');
    if (reservaId) reservaId.value = '';

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nueva Reserva';

    // Valores por defecto
    const hoy = new Date().toISOString().split('T')[0];
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) fechaInput.value = hoy;

    const horaInicio = document.getElementById('horaInicio');
    if (horaInicio) horaInicio.value = '09:00';

    const horaFin = document.getElementById('horaFin');
    if (horaFin) horaFin.value = '10:00';

    const estado = document.getElementById('estado');
    if (estado) estado.value = 'activa';
}

function abrirModalCrear() {
    limpiarFormulario();
    const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
    modal.show();
}

// Función auxiliar para formatear fecha
function formatearFecha(fechaStr) {
    if (!fechaStr) return 'N/A';
    try {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (e) {
        return fechaStr;
    }
}

// Función auxiliar para formatear hora
function formatearHora(horaStr) {
    if (!horaStr) return 'N/A';
    if (typeof horaStr === 'string' && horaStr.length > 5) {
        return horaStr.substring(0, 5);
    }
    return horaStr;
}