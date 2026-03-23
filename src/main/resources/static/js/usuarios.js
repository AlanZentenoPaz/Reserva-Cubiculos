// Configuración de la API
const API_USUARIOS = `${API_BASE_URL}/usuarios`;

let idEliminar = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarUsuarios();
});

async function cargarUsuarios() {
    try {
        mostrarLoading();

        const response = await fetch(API_USUARIOS);
        if (!response.ok) throw new Error('Error al cargar usuarios');

        const usuarios = await response.json();
        actualizarTabla(usuarios);
        actualizarEstadisticas(usuarios);

    } catch (error) {
        manejarError(error, 'No se pudieron cargar los usuarios');
        mostrarErrorTabla();
    } finally {
        ocultarLoading();
    }
}

function actualizarTabla(usuarios) {
    const tbody = document.getElementById('usuariosTableBody');

    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    <i class="bi bi-people display-4 d-block text-muted mb-3"></i>
                    <p class="text-muted">No hay usuarios registrados</p>
                    <button class="btn btn-primary btn-sm" onclick="abrirModalCrear()">
                        <i class="bi bi-plus-circle me-2"></i>Agregar usuario
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = usuarios.map(usuario => `
        <tr>
            <td><span class="badge bg-secondary">${usuario.idUsuario}</span></td>
            <td>${usuario.matricula || '-'}</td>
            <td>${usuario.numeroEmpleado || '-'}</td>
            <td><strong>${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}</strong></td>
            <td>${usuario.correoInstitucional}</td>
            <td>${usuario.telefono || '-'}</td>
            <td>${obtenerBadgeTipo(usuario.tipoUsuario)}</td>
            <td>${obtenerBadgeEstado(usuario.estado)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editarUsuario(${usuario.idUsuario})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="mostrarModalEliminar(${usuario.idUsuario})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function actualizarEstadisticas(usuarios) {
    const total = usuarios.length;
    const estudiantes = usuarios.filter(u => u.tipoUsuario === 'estudiante').length;
    const profesores = usuarios.filter(u => u.tipoUsuario === 'profesor').length;
    const activos = usuarios.filter(u => u.estado === 'activo').length;

    document.getElementById('totalUsuarios').textContent = total;
    document.getElementById('estudiantesCount').textContent = estudiantes;
    document.getElementById('profesoresCount').textContent = profesores;
    document.getElementById('activosCount').textContent = activos;
}

function obtenerBadgeTipo(tipo) {
    const badges = {
        'estudiante': '<span class="badge badge-estudiante">Estudiante</span>',
        'profesor': '<span class="badge badge-profesor">Profesor</span>'
    };
    return badges[tipo] || '<span class="badge bg-secondary">No definido</span>';
}

function obtenerBadgeEstado(estado) {
    const badges = {
        'activo': '<span class="badge badge-activo">Activo</span>',
        'suspendido': '<span class="badge badge-suspendido">Suspendido</span>'
    };
    return badges[estado] || '<span class="badge bg-secondary">No definido</span>';
}

function mostrarErrorTabla() {
    const tbody = document.getElementById('usuariosTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="9" class="text-center py-4">
                <i class="bi bi-exclamation-triangle text-warning display-4 d-block mb-3"></i>
                <h6 class="text-danger">Error al cargar los datos</h6>
                <button class="btn btn-primary btn-sm mt-2" onclick="cargarUsuarios()">
                    <i class="bi bi-arrow-repeat me-2"></i>Reintentar
                </button>
            </td>
        </tr>
    `;
}

async function guardarUsuario() {
    if (!validarFormulario()) return;

    const id = document.getElementById('usuarioId').value;
    const usuario = {
        matricula: document.getElementById('matricula').value || null,
        numeroEmpleado: document.getElementById('numeroEmpleado').value || null,
        nombre: document.getElementById('nombre').value,
        apellidoPaterno: document.getElementById('apellidoPaterno').value,
        apellidoMaterno: document.getElementById('apellidoMaterno').value || null,
        correoInstitucional: document.getElementById('correoInstitucional').value,
        telefono: document.getElementById('telefono').value || null,
        tipoUsuario: document.getElementById('tipoUsuario').value,
        estado: document.getElementById('estado').value
    };

    try {
        const url = id ? `${API_USUARIOS}/${id}` : API_USUARIOS;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) throw new Error('Error al guardar');

        const modal = bootstrap.Modal.getInstance(document.getElementById('usuarioModal'));
        modal.hide();

        mostrarNotificacion('success', id ? 'Usuario actualizado' : 'Usuario creado');
        cargarUsuarios();
        limpiarFormulario();

    } catch (error) {
        manejarError(error, 'Error al guardar el usuario');
    }
}

function validarFormulario() {
    const nombre = document.getElementById('nombre').value;
    const apellidoPaterno = document.getElementById('apellidoPaterno').value;
    const correo = document.getElementById('correoInstitucional').value;
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const estado = document.getElementById('estado').value;

    if (!nombre || !apellidoPaterno || !correo || !tipoUsuario || !estado) {
        mostrarNotificacion('warning', 'Complete todos los campos obligatorios');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        mostrarNotificacion('warning', 'Ingrese un correo válido');
        return false;
    }

    const matricula = document.getElementById('matricula').value;
    const numeroEmpleado = document.getElementById('numeroEmpleado').value;

    if (tipoUsuario === 'estudiante' && !matricula) {
        mostrarNotificacion('warning', 'Los estudiantes deben tener matrícula');
        return false;
    }

    if (tipoUsuario === 'profesor' && !numeroEmpleado) {
        mostrarNotificacion('warning', 'Los profesores deben tener número de empleado');
        return false;
    }

    return true;
}

async function editarUsuario(id) {
    try {
        const response = await fetch(`${API_USUARIOS}/${id}`);
        if (!response.ok) throw new Error('Error al obtener');

        const usuario = await response.json();

        document.getElementById('usuarioId').value = usuario.idUsuario;
        document.getElementById('matricula').value = usuario.matricula || '';
        document.getElementById('numeroEmpleado').value = usuario.numeroEmpleado || '';
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('apellidoPaterno').value = usuario.apellidoPaterno;
        document.getElementById('apellidoMaterno').value = usuario.apellidoMaterno || '';
        document.getElementById('correoInstitucional').value = usuario.correoInstitucional;
        document.getElementById('telefono').value = usuario.telefono || '';
        document.getElementById('tipoUsuario').value = usuario.tipoUsuario;
        document.getElementById('estado').value = usuario.estado;

        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Usuario';

        const modal = new bootstrap.Modal(document.getElementById('usuarioModal'));
        modal.show();

    } catch (error) {
        manejarError(error, 'No se pudo cargar el usuario');
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
        const response = await fetch(`${API_USUARIOS}/${idEliminar}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar');

        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();

        mostrarNotificacion('success', 'Usuario eliminado');
        cargarUsuarios();

    } catch (error) {
        manejarError(error, 'Error al eliminar el usuario');
    } finally {
        idEliminar = null;
    }
}

function limpiarFormulario() {
    document.getElementById('usuarioForm').reset();
    document.getElementById('usuarioId').value = '';
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nuevo Usuario';
}

function abrirModalCrear() {
    limpiarFormulario();
    const modal = new bootstrap.Modal(document.getElementById('usuarioModal'));
    modal.show();
}

function actualizarCamposPorTipo() {
    const tipo = document.getElementById('tipoUsuario').value;
    const matriculaField = document.getElementById('matricula').parentElement;
    const empleadoField = document.getElementById('numeroEmpleado').parentElement;

    if (tipo === 'estudiante') {
        matriculaField.style.display = 'block';
        empleadoField.style.display = 'none';
        document.getElementById('numeroEmpleado').required = false;
        document.getElementById('matricula').required = true;
    } else if (tipo === 'profesor') {
        matriculaField.style.display = 'none';
        empleadoField.style.display = 'block';
        document.getElementById('matricula').required = false;
        document.getElementById('numeroEmpleado').required = true;
    } else {
        matriculaField.style.display = 'none';
        empleadoField.style.display = 'none';
        document.getElementById('matricula').required = false;
        document.getElementById('numeroEmpleado').required = false;
    }
}