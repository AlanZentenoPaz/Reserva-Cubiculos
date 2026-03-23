// Configuración global
const API_BASE_URL = 'http://localhost:8080';

// Función para mostrar loading
function mostrarLoading() {
    const loader = document.createElement('div');
    loader.className = 'spinner-overlay';
    loader.id = 'global-loader';
    loader.innerHTML = `
        <div class="spinner-border text-light" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
    `;
    document.body.appendChild(loader);
}

function ocultarLoading() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.remove();
}

// Función para mostrar notificaciones
function mostrarNotificacion(tipo, mensaje, titulo = '') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });

    Toast.fire({
        icon: tipo,
        title: titulo || mensaje,
        text: titulo ? mensaje : ''
    });
}

// Función para manejar errores
function manejarError(error, mensajePersonalizado = '') {
    console.error('Error:', error);

    let mensaje = mensajePersonalizado || 'Ocurrió un error al procesar la solicitud';

    if (error.message.includes('Failed to fetch')) {
        mensaje = 'No se puede conectar al servidor. Verifica que el backend esté corriendo en ' + API_BASE_URL;
    } else if (error.message.includes('401')) {
        mensaje = 'No autorizado. Por favor, inicia sesión nuevamente';
    } else if (error.message.includes('403')) {
        mensaje = 'No tienes permisos para realizar esta acción';
    } else if (error.message.includes('404')) {
        mensaje = 'El recurso solicitado no existe';
    }

    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonText: 'Entendido'
    });
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

// Función para formatear hora
function formatearHora(horaStr) {
    if (!horaStr) return 'N/A';
    return horaStr.substring(0, 5);
}

// Función para obtener iniciales
function obtenerIniciales(nombre, apellidoPaterno) {
    if (!nombre) return '?';
    return (nombre.charAt(0) + (apellidoPaterno ? apellidoPaterno.charAt(0) : '')).toUpperCase();
}

// Activar menú según la página actual
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
});