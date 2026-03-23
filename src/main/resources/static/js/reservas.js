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
        actualizarTabla(reservas);

    } catch (error) {
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

        selectCubiculo.innerHTML = '<option value="">Seleccione un cubículo</option>';

        cubiculos.forEach(cubiculo => {
            if (cubiculo.estado === 'disponible') {
                const option = document.createElement('option');
                option.value = cubiculo.idCubiculo;
                option.textContent = `${cubiculo.numeroCubiculo} - Cap: ${cubiculo.capacidad} - ${cubiculo.ubicacion}`;
                selectCubiculo.appendChild(option);
            }
        });

    } catch (error) {
        console.error('Error cargando cubículos:', error);
    }
}

async function cargarUsuarios() {
    try {
        const response = await fetch(API_USUARIOS);
        if (!response.ok) throw new Error('Error al cargar usuarios');

        const usuarios = await response.json();
        const selectUsuario = document.getElementById('idUsuario');

        selectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>';

        usuarios.forEach(usuario => {
            if (usuario.estado === 'activo') {
                const option = document.createElement('option');
                option.value = usuario.idUsuario;
                option.textContent = `${usuario.nombre} ${usuario.apellidoPaterno} - ${usuario.matricula || usuario.numeroEmpleado}`;
                selectUsuario.appendChild(option);
            }
        });

    } catch (error) {
        console.error('Error cargando usuarios:', error);
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

    tbody.innerHTML = reservas.map(reserva => `
        <tr>
            <td><span class="badge bg-secondary">${reserva.idReserva}</span></td>
            <td><strong>Usuario ID: ${reserva.idUsuario}</strong></td>
            <td><strong>Cubículo ID: ${reserva.idCubiculo}</strong></td>
            <td>${formatearFecha(reserva.fechaReserva)}</td>
            <td>${formatearHora(reserva.horaInicio)}</td>
            <td>${formatearHora(reserva.horaFin)}</td>
            <td>${reserva.motivo || 'Sin motivo'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editarReserva(${reserva.idReserva})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="mostrarModalEliminar(${reserva.idReserva})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function mostrarErrorTabla() {
    const tbody = document.getElementById('reservasTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-4">
                <i class="bi bi-exclamation-triangle text-warning display-4 d-block mb-3"></i>
                <h6 class="text-danger">Error al cargar los datos</h6>
                <button class="btn btn-success btn-sm mt-2" onclick="cargarReservas()">
                    <i class="bi bi-arrow-repeat me-2"></i>Reintentar
                </button>
            </td>
        </tr>
    `;
}

async function guardarReserva() {
    if (!validarFormulario()) return;

    const id = document.getElementById('reservaId').value;
    const reserva = {
        idUsuario: parseInt(document.getElementById('idUsuario').value),
        idCubiculo: parseInt(document.getElementById('idCubiculo').value),
        fechaReserva: document.getElementById('fechaReserva').value,
        horaInicio: document.getElementById('horaInicio').value,
        horaFin: document.getElementById('horaFin').value,
        motivo: document.getElementById('motivo').value
    };

    try {
        const url = id ? `${API_RESERVAS}/${id}` : API_RESERVAS;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reserva)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('reservaModal'));
        modal.hide();

        mostrarNotificacion('success', id ? 'Reserva actualizada' : 'Reserva creada');
        cargarReservas();
        limpiarFormulario();

    } catch (error) {
        manejarError(error, error.message || 'Error al guardar la reserva');
    }
}

function validarFormulario() {
    const idUsuario = document.getElementById('idUsuario').value;
    const idCubiculo = document.getElementById('idCubiculo').value;
    const fechaReserva = document.getElementById('fechaReserva').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFin = document.getElementById('horaFin').value;

    if (!idUsuario || !idCubiculo || !fechaReserva || !horaInicio || !horaFin) {
        mostrarNotificacion('warning', 'Complete todos los campos obligatorios');
        return false;
    }

    const fecha = new Date(fechaReserva);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fecha < hoy) {
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
        if (!response.ok) throw new Error('Error al obtener');

        const reserva = await response.json();

        document.getElementById('reservaId').value = reserva.idReserva;
        document.getElementById('idUsuario').value = reserva.idUsuario;
        document.getElementById('idCubiculo').value = reserva.idCubiculo;
        document.getElementById('fechaReserva').value = reserva.fechaReserva;
        document.getElementById('horaInicio').value = reserva.horaInicio;
        document.getElementById('horaFin').value = reserva.horaFin;
        document.getElementById('motivo').value = reserva.motivo || '';

        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Reserva';

        const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
        modal.show();

    } catch (error) {
        manejarError(error, 'No se pudo cargar la reserva');
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
        const response = await fetch(`${API_RESERVAS}/${idEliminar}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar');

        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();

        mostrarNotificacion('success', 'Reserva eliminada');
        cargarReservas();

    } catch (error) {
        manejarError(error, 'Error al eliminar la reserva');
    } finally {
        idEliminar = null;
    }
}

function limpiarFormulario() {
    document.getElementById('reservaForm').reset();
    document.getElementById('reservaId').value = '';
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nueva Reserva';

    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaReserva').value = hoy;
    document.getElementById('horaInicio').value = '09:00';
    document.getElementById('horaFin').value = '10:00';
}

function abrirModalCrear() {
    limpiarFormulario();
    const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
    modal.show();
}