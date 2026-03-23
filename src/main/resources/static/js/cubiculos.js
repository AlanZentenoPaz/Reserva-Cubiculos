// Configuración de la API
const API_CUBICULOS = `${API_BASE_URL}/cubiculos`;

let idEliminar = null;

// Cargar cubículos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarCubiculos();
});

async function cargarCubiculos() {
    try {
        mostrarLoading();

        const response = await fetch(API_CUBICULOS);
        if (!response.ok) throw new Error('Error al cargar los cubículos');

        const cubiculos = await response.json();
        actualizarTabla(cubiculos);
        actualizarEstadisticas(cubiculos);

    } catch (error) {
        manejarError(error, 'No se pudieron cargar los cubículos');
        mostrarErrorTabla();
    } finally {
        ocultarLoading();
    }
}

function actualizarTabla(cubiculos) {
    const tbody = document.getElementById('cubiculosTableBody');

    if (!cubiculos || cubiculos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <i class="bi bi-inbox display-4 d-block text-muted mb-3"></i>
                    <p class="text-muted">No hay cubículos registrados</p>
                    <button class="btn btn-primary btn-sm" onclick="abrirModalCrear()">
                        <i class="bi bi-plus-circle me-2"></i>Agregar primer cubículo
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = cubiculos.map(cubiculo => `
        <tr>
            <td><span class="badge bg-secondary">${cubiculo.idCubiculo}</span></td>
            <td><strong>${cubiculo.numeroCubiculo}</strong></td>
            <td><i class="bi bi-people me-1"></i> ${cubiculo.capacidad} personas</td>
            <td><i class="bi bi-geo-alt me-1"></i> ${cubiculo.ubicacion}</td>
            <td>${obtenerBadgeTipo(cubiculo.tipo)}</td>
            <td>${cubiculo.equipamiento || 'Sin equipamiento'}</td>
            <td>${obtenerBadgeEstado(cubiculo.estado)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editarCubiculo(${cubiculo.idCubiculo})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="mostrarModalEliminar(${cubiculo.idCubiculo})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function actualizarEstadisticas(cubiculos) {
    const total = cubiculos.length;
    const disponibles = cubiculos.filter(c => c.estado === 'disponible').length;
    const mantenimiento = cubiculos.filter(c => c.estado === 'mantenimiento').length;
    const grupales = cubiculos.filter(c => c.tipo === 'grupal').length;

    document.getElementById('totalCubiculos').textContent = total;
    document.getElementById('disponiblesCount').textContent = disponibles;
    document.getElementById('mantenimientoCount').textContent = mantenimiento;
    document.getElementById('grupalesCount').textContent = grupales;
}

function obtenerBadgeTipo(tipo) {
    const badges = {
        'individual': '<span class="badge badge-individual">Individual</span>',
        'grupal': '<span class="badge badge-grupal">Grupal</span>'
    };
    return badges[tipo] || '<span class="badge bg-secondary">No definido</span>';
}

function obtenerBadgeEstado(estado) {
    const badges = {
        'disponible': '<span class="badge badge-disponible">Disponible</span>',
        'mantenimiento': '<span class="badge badge-mantenimiento">Mantenimiento</span>',
        'fuera_servicio': '<span class="badge badge-fuera_servicio">Fuera de Servicio</span>'
    };
    return badges[estado] || '<span class="badge bg-secondary">No definido</span>';
}

function mostrarErrorTabla() {
    const tbody = document.getElementById('cubiculosTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-4">
                <i class="bi bi-exclamation-triangle text-warning display-4 d-block mb-3"></i>
                <h6 class="text-danger">Error al cargar los datos</h6>
                <button class="btn btn-primary btn-sm mt-2" onclick="cargarCubiculos()">
                    <i class="bi bi-arrow-repeat me-2"></i>Reintentar
                </button>
            </td>
        </tr>
    `;
}

async function guardarCubiculo() {
    if (!validarFormulario()) return;

    const id = document.getElementById('cubiculoId').value;
    const cubiculo = {
        numeroCubiculo: document.getElementById('numeroCubiculo').value,
        capacidad: parseInt(document.getElementById('capacidad').value),
        ubicacion: document.getElementById('ubicacion').value,
        tipo: document.getElementById('tipo').value,
        equipamiento: document.getElementById('equipamiento').value,
        estado: document.getElementById('estado').value
    };

    try {
        const url = id ? `${API_CUBICULOS}/${id}` : API_CUBICULOS;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cubiculo)
        });

        if (!response.ok) throw new Error('Error al guardar');

        const modal = bootstrap.Modal.getInstance(document.getElementById('cubiculoModal'));
        modal.hide();

        mostrarNotificacion('success', id ? 'Cubículo actualizado' : 'Cubículo creado');
        cargarCubiculos();
        limpiarFormulario();

    } catch (error) {
        manejarError(error, 'Error al guardar el cubículo');
    }
}

function validarFormulario() {
    const numero = document.getElementById('numeroCubiculo').value;
    const capacidad = document.getElementById('capacidad').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const tipo = document.getElementById('tipo').value;
    const estado = document.getElementById('estado').value;

    if (!numero || !capacidad || !ubicacion || !tipo || !estado) {
        mostrarNotificacion('warning', 'Complete todos los campos obligatorios');
        return false;
    }

    if (capacidad < 1) {
        mostrarNotificacion('warning', 'La capacidad debe ser mayor a 0');
        return false;
    }

    return true;
}

async function editarCubiculo(id) {
    try {
        const response = await fetch(`${API_CUBICULOS}/${id}`);
        if (!response.ok) throw new Error('Error al obtener');

        const cubiculo = await response.json();

        document.getElementById('cubiculoId').value = cubiculo.idCubiculo;
        document.getElementById('numeroCubiculo').value = cubiculo.numeroCubiculo;
        document.getElementById('capacidad').value = cubiculo.capacidad;
        document.getElementById('ubicacion').value = cubiculo.ubicacion;
        document.getElementById('tipo').value = cubiculo.tipo;
        document.getElementById('equipamiento').value = cubiculo.equipamiento || '';
        document.getElementById('estado').value = cubiculo.estado;

        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Cubículo';

        const modal = new bootstrap.Modal(document.getElementById('cubiculoModal'));
        modal.show();

    } catch (error) {
        manejarError(error, 'No se pudo cargar el cubículo');
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
        const response = await fetch(`${API_CUBICULOS}/${idEliminar}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar');

        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();

        mostrarNotificacion('success', 'Cubículo eliminado');
        cargarCubiculos();

    } catch (error) {
        manejarError(error, 'Error al eliminar el cubículo');
    } finally {
        idEliminar = null;
    }
}

function limpiarFormulario() {
    document.getElementById('cubiculoForm').reset();
    document.getElementById('cubiculoId').value = '';
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nuevo Cubículo';
}

function abrirModalCrear() {
    limpiarFormulario();
    const modal = new bootstrap.Modal(document.getElementById('cubiculoModal'));
    modal.show();
}