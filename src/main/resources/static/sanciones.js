// Configuración de la API
const API_SANCIONES = 'http://localhost:8080/sanciones';
const API_USUARIOS = 'http://localhost:8080/usuarios'; // Ajusta según tu endpoint de usuarios

// Variables globales
let idEliminar = null;

// Cargar sanciones y usuarios al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada, iniciando carga de sanciones...');
    cargarSanciones();
    cargarUsuarios();
});

// Función para cargar todos los usuarios (para el select)
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

// Función para cargar todas las sanciones
async function cargarSanciones() {
    try {
        mostrarLoading();

        console.log('Intentando conectar a:', API_SANCIONES);

        const response = await fetch(API_SANCIONES, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });

        console.log('Respuesta recibida:', response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const sanciones = await response.json();
        console.log('Datos recibidos:', sanciones);

        actualizarTabla(sanciones);

    } catch (error) {
        console.error('Error detallado:', error);

        let mensajeError = 'No se pudieron cargar las sanciones';

        if (error.message.includes('Failed to fetch')) {
            mensajeError = 'No se puede conectar al servidor. Verifica que el backend esté corriendo';
        }

        mostrarError(mensajeError, error.message);
    }
}

// Función para actualizar la tabla con los datos
function actualizarTabla(sanciones) {
    const tbody = document.getElementById('sancionesTableBody');

    if (!sanciones || sanciones.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <i class="bi bi-inbox display-4 d-block text-muted mb-3"></i>
                    <p class="text-muted mb-0">No hay sanciones registradas</p>
                    <p class="text-muted small">Agrega una nueva sanción usando el botón "Nueva Sanción"</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = sanciones.map(sancion => {
        const fechaInicio = new Date(sancion.fechaInicio);
        const fechaFin = new Date(sancion.fechaFin);
        const hoy = new Date();

        let claseFecha = 'fecha-normal';
        if (fechaFin < hoy) {
            claseFecha = 'fecha-expirada';
        } else if ((fechaFin - hoy) / (1000 * 60 * 60 * 24) <= 3) {
            claseFecha = 'fecha-proxima';
        }

        return `
        <tr>
            <td><span class="badge bg-secondary">${sancion.idSancion || 'N/A'}</span></td>
            <td>
                <div class="usuario-info">
                    <div class="usuario-avatar">
                        ${obtenerInicialesUsuario(sancion)}
                    </div>
                    <div>
                        <div class="usuario-nombre">${sancion.nombreUsuario || 'Usuario ID: ' + sancion.idUsuario}</div>
                        <div class="usuario-matricula">${sancion.matricula || ''}</div>
                    </div>
                </div>
            </td>
            <td>
                <span title="${sancion.motivo}">
                    ${sancion.motivo ? sancion.motivo.substring(0, 50) + (sancion.motivo.length > 50 ? '...' : '') : 'Sin motivo'}
                </span>
            </td>
            <td class="${claseFecha}">
                <i class="bi bi-calendar3 me-1"></i>
                ${formatearFecha(sancion.fechaInicio)}
            </td>
            <td class="${claseFecha}">
                <i class="bi bi-calendar3 me-1"></i>
                ${formatearFecha(sancion.fechaFin)}
            </td>
            <td>
                ${obtenerBadgeEstado(sancion.estado)}
            </td>
            <td>
                <button class="btn btn-sm btn-action btn-edit" onclick="editarSancion(${sancion.idSancion})" 
                        title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-action btn-delete" onclick="mostrarModalEliminar(${sancion.idSancion})" 
                        title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `}).join('');
}

// Función para obtener iniciales del usuario
function obtenerInicialesUsuario(sancion) {
    if (sancion.nombreUsuario) {
        return sancion.nombreUsuario.charAt(0).toUpperCase();
    }
    return 'U';
}

// Función para formatear fecha
function formatearFecha(fechaStr) {
    if (!fechaStr) return 'N/A';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Función para obtener el badge del estado
function obtenerBadgeEstado(estado) {
    const badges = {
        'activa': '<span class="badge badge-activa">Activa</span>',
        'cumplida': '<span class="badge badge-cumplida">Cumplida</span>',
        'cancelada': '<span class="badge badge-cancelada">Cancelada</span>'
    };
    return badges[estado] || '<span class="badge bg-secondary">No definido</span>';
}

// Función para mostrar error
function mostrarError(mensaje, detalle) {
    const tbody = document.getElementById('sancionesTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-5">
                <i class="bi bi-exclamation-triangle text-warning display-4 d-block mb-3"></i>
                <h5 class="text-danger">Error al cargar los datos</h5>
                <p class="text-muted">${mensaje}</p>
                <p class="text-muted small">${detalle}</p>
                <button class="btn btn-danger mt-3" onclick="cargarSanciones()">
                    <i class="bi bi-arrow-repeat me-2"></i>
                    Reintentar
                </button>
            </td>
        </tr>
    `;

    Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: mensaje
    });
}

// Función para guardar una sanción (crear o actualizar)
async function guardarSancion() {
    if (!validarFormulario()) {
        return;
    }

    const id = document.getElementById('sancionId').value;
    const sancion = {
        idUsuario: parseInt(document.getElementById('idUsuario').value),
        motivo: document.getElementById('motivo').value,
        fechaInicio: document.getElementById('fechaInicio').value,
        fechaFin: document.getElementById('fechaFin').value,
        estado: document.getElementById('estado').value
    };

    if (id) {
        sancion.idSancion = parseInt(id);
    }

    try {
        const url = id ? `${API_SANCIONES}/${id}` : API_SANCIONES;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sancion)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al guardar la sanción');
        }

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('sancionModal'));
        modal.hide();

        // Mostrar mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: id ? '¡Actualizada!' : '¡Creada!',
            text: id ? 'Sanción actualizada correctamente' : 'Sanción creada correctamente',
            timer: 2000,
            showConfirmButton: false
        });

        // Recargar la tabla
        cargarSanciones();
        limpiarFormulario();

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Error al guardar la sanción',
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Función para validar el formulario
function validarFormulario() {
    const idUsuario = document.getElementById('idUsuario').value;
    const motivo = document.getElementById('motivo').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const estado = document.getElementById('estado').value;

    if (!idUsuario || !motivo || !fechaInicio || !fechaFin || !estado) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete todos los campos obligatorios',
            timer: 3000,
            showConfirmButton: false
        });
        return false;
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (fin < inicio) {
        Swal.fire({
            icon: 'warning',
            title: 'Fechas inválidas',
            text: 'La fecha de fin no puede ser menor a la fecha de inicio',
            timer: 3000,
            showConfirmButton: false
        });
        return false;
    }

    return true;
}

// Función para editar una sanción
async function editarSancion(id) {
    try {
        const response = await fetch(`${API_SANCIONES}/${id}`);
        if (!response.ok) throw new Error('Error al obtener la sanción');

        const sancion = await response.json();

        // Llenar el formulario
        document.getElementById('sancionId').value = sancion.idSancion;
        document.getElementById('idUsuario').value = sancion.idUsuario;
        document.getElementById('motivo').value = sancion.motivo;
        document.getElementById('fechaInicio').value = sancion.fechaInicio;
        document.getElementById('fechaFin').value = sancion.fechaFin;
        document.getElementById('estado').value = sancion.estado;

        // Cambiar título del modal
        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Sanción';

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('sancionModal'));
        modal.show();

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar la información de la sanción',
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Función para mostrar modal de confirmación de eliminación
function mostrarModalEliminar(id) {
    idEliminar = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Función para confirmar eliminación
async function confirmarEliminar() {
    if (!idEliminar) return;

    try {
        const response = await fetch(`${API_SANCIONES}/${idEliminar}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar la sanción');

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();

        // Mostrar mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: '¡Eliminada!',
            text: 'Sanción eliminada correctamente',
            timer: 2000,
            showConfirmButton: false
        });

        // Recargar la tabla
        cargarSanciones();

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Error al eliminar la sanción',
            timer: 3000,
            showConfirmButton: false
        });
    } finally {
        idEliminar = null;
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('sancionForm').reset();
    document.getElementById('sancionId').value = '';
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nueva Sanción';

    // Establecer fecha actual por defecto
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaInicio').value = hoy;

    // Establecer fecha de fin por defecto (7 días después)
    const semana = new Date();
    semana.setDate(semana.getDate() + 7);
    document.getElementById('fechaFin').value = semana.toISOString().split('T')[0];
}

// Función para mostrar loading
function mostrarLoading() {
    const tbody = document.getElementById('sancionesTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-5">
                <div class="spinner-border text-danger" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2 text-muted">Cargando sanciones...</p>
            </td>
        </tr>
    `;
}

// Función para filtrar sanciones por estado
function filtrarPorEstado(estado) {
    fetch(API_SANCIONES)
        .then(response => response.json())
        .then(sanciones => {
            if (estado === 'todas') {
                actualizarTabla(sanciones);
            } else {
                const filtradas = sanciones.filter(s => s.estado === estado);
                actualizarTabla(filtradas);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para buscar sanciones
function buscarSanciones() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';

    if (!searchTerm) {
        cargarSanciones();
        return;
    }

    fetch(API_SANCIONES)
        .then(response => response.json())
        .then(sanciones => {
            const filtradas = sanciones.filter(s =>
                s.motivo?.toLowerCase().includes(searchTerm) ||
                s.nombreUsuario?.toLowerCase().includes(searchTerm) ||
                s.estado?.toLowerCase().includes(searchTerm)
            );
            actualizarTabla(filtradas);
        })
        .catch(error => console.error('Error:', error));
}