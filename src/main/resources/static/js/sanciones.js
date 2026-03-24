// Configuración de la API
const API_SANCIONES = `${API_BASE_URL}/sanciones`;
const API_USUARIOS = `${API_BASE_URL}/usuarios`;

let idEliminar = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarSanciones();
    cargarUsuarios();
});

async function cargarUsuarios() {
    try {
        const response = await fetch(API_USUARIOS);
        if (!response.ok) throw new Error('Error al cargar usuarios');

        const usuarios = await response.json();
        const selectUsuario = document.getElementById('idUsuario');

        selectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>';

        usuarios.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.idUsuario;
            option.textContent = `${usuario.nombre} ${usuario.apellidoPaterno} - ${usuario.matricula || usuario.numeroEmpleado}`;
            selectUsuario.appendChild(option);
        });

    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

async function cargarSanciones() {
    try {
        mostrarLoading();

        const response = await fetch(API_SANCIONES);
        if (!response.ok) throw new Error('Error al cargar sanciones');

        const sanciones = await response.json();
        actualizarTabla(sanciones);

    } catch (error) {
        manejarError(error, 'No se pudieron cargar las sanciones');
        mostrarErrorTabla();
    } finally {
        ocultarLoading();
    }
}

function actualizarTabla(sanciones) {
    const tbody = document.getElementById('sancionesTableBody');

    if (!sanciones || sanciones.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <i class="bi bi-inbox display-4 d-block text-muted mb-3"></i>
                    <p class="text-muted">No hay sanciones registradas</p>
                    <button class="btn btn-danger btn-sm" onclick="abrirModalCrear()">
                        <i class="bi bi-plus-circle me-2"></i>Agregar sanción
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = sanciones.map(sancion => {
        const fechaFin = new Date(sancion.fechaFin);
        const hoy = new Date();
        let claseFecha = '';

        if (fechaFin < hoy) claseFecha = 'text-danger';
        else if ((fechaFin - hoy) / (1000 * 60 * 60 * 24) <= 3) claseFecha = 'text-warning';

        return `
            <tr>
                <td><span class="badge bg-secondary">${sancion.idSancion}</span></td>
                <td><strong>Usuario ID: ${sancion.idUsuario}</strong></td>
                <td>${sancion.motivo}</td>
                <td>${formatearFecha(sancion.fechaInicio)}</td>
                <td class="${claseFecha}">${formatearFecha(sancion.fechaFin)}</td>
                <td>${obtenerBadgeEstado(sancion.estado)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editarSancion(${sancion.idSancion})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="mostrarModalEliminar(${sancion.idSancion})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function obtenerBadgeEstado(estado) {
    const badges = {
        'activa': '<span class="badge bg-danger">Activa</span>',
        'cumplida': '<span class="badge bg-success">Cumplida</span>',
        'cancelada': '<span class="badge bg-secondary">Cancelada</span>'
    };
    return badges[estado] || '<span class="badge bg-secondary">No definido</span>';
}

function mostrarErrorTabla() {
    const tbody = document.getElementById('sancionesTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-4">
                <i class="bi bi-exclamation-triangle text-warning display-4 d-block mb-3"></i>
                <h6 class="text-danger">Error al cargar los datos</h6>
                <button class="btn btn-danger btn-sm mt-2" onclick="cargarSanciones()">
                    <i class="bi bi-arrow-repeat me-2"></i>Reintentar
                </button>
            </td>
        </tr>
    `;
}

async function guardarSancion() {
    if (!validarFormulario()) return;

    const id = document.getElementById('sancionId').value;
    const sancion = {
        idUsuario: parseInt(document.getElementById('idUsuario').value),
        motivo: document.getElementById('motivo').value,
        fechaInicio: document.getElementById('fechaInicio').value,
        fechaFin: document.getElementById('fechaFin').value,
        estado: document.getElementById('estado').value
    };

    try {
        const url = id ? `${API_SANCIONES}/${id}` : API_SANCIONES;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sancion)
        });

        if (!response.ok) throw new Error('Error al guardar');

        const modal = bootstrap.Modal.getInstance(document.getElementById('sancionModal'));
        modal.hide();

        mostrarNotificacion('success', id ? 'Sanción actualizada' : 'Sanción creada');
        cargarSanciones();
        limpiarFormulario();

    } catch (error) {
        manejarError(error, 'Error al guardar la sanción');
    }
}

function validarFormulario() {
    const idUsuario = document.getElementById('idUsuario').value;
    const motivo = document.getElementById('motivo').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const estado = document.getElementById('estado').value;

    if (!idUsuario || !motivo || !fechaInicio || !fechaFin || !estado) {
        mostrarNotificacion('warning', 'Complete todos los campos');
        return false;
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (fin < inicio) {
        mostrarNotificacion('warning', 'La fecha de fin no puede ser menor a la fecha de inicio');
        return false;
    }

    return true;
}

async function editarSancion(id) {
    try {
        const response = await fetch(`${API_SANCIONES}/${id}`);
        if (!response.ok) throw new Error('Error al obtener');

        const sancion = await response.json();

        document.getElementById('sancionId').value = sancion.idSancion;
        document.getElementById('idUsuario').value = sancion.idUsuario;
        document.getElementById('motivo').value = sancion.motivo;
        document.getElementById('fechaInicio').value = sancion.fechaInicio;
        document.getElementById('fechaFin').value = sancion.fechaFin;
        document.getElementById('estado').value = sancion.estado;

        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Sanción';

        const modal = new bootstrap.Modal(document.getElementById('sancionModal'));
        modal.show();

    } catch (error) {
        manejarError(error, 'No se pudo cargar la sanción');
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
        const response = await fetch(`${API_SANCIONES}/${idEliminar}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar');

        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();

        mostrarNotificacion('success', 'Sanción eliminada');
        cargarSanciones();

    } catch (error) {
        manejarError(error, 'Error al eliminar la sanción');
    } finally {
        idEliminar = null;
    }
}

function limpiarFormulario() {
    document.getElementById('sancionForm').reset();
    document.getElementById('sancionId').value = '';
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nueva Sanción';

    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaInicio').value = hoy;

    const semana = new Date();
    semana.setDate(semana.getDate() + 7);
    document.getElementById('fechaFin').value = semana.toISOString().split('T')[0];
}

function abrirModalCrear() {
    limpiarFormulario();
    const modal = new bootstrap.Modal(document.getElementById('sancionModal'));
    modal.show();
}





