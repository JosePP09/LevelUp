// perfil-header.js - Versión corregida y robusta
document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const perfilDropdown = document.getElementById('perfilDropdown');
    const nombreUsuario = document.getElementById('nombreUsuario');
    const loginLinks = document.getElementById('loginLinks');
    const registroLinks = document.getElementById('registroLinks');
    const irPerfil = document.getElementById('irPerfil');
    const cerrarSesion = document.getElementById('cerrarSesion');

    // Si no existen los elementos, salir (para páginas sin navbar de perfil)
    if (!perfilDropdown || !nombreUsuario || !loginLinks || !registroLinks) {
        return;
    }

    try {
        // Obtener usuario de localStorage
        const usuarioStr = localStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

        if (usuario && usuario.nombre) {
            // Usuario logueado
            perfilDropdown.style.display = 'block';
            nombreUsuario.textContent = usuario.nombre;
            loginLinks.style.display = 'none';
            registroLinks.style.display = 'none';

            // Configurar eventos solo si los elementos existen
            if (irPerfil) {
                irPerfil.addEventListener('click', function(e) {
                    e.preventDefault();
                    const destino = usuario.rol === 'admin' ? 'perfilAdmin.html' : 'perfilCliente.html';
                    window.location.href = destino;
                });
            }

            if (cerrarSesion) {
                cerrarSesion.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('carrito'); // Opcional
                    window.location.reload();
                });
            }

        } else {
            // Usuario no logueado
            perfilDropdown.style.display = 'none';
            loginLinks.style.display = 'block';
            registroLinks.style.display = 'block';
        }

    } catch (error) {
        console.error('Error en perfil-header.js:', error);
        // En caso de error, mostrar login/registro por seguridad
        if (perfilDropdown) perfilDropdown.style.display = 'none';
        if (loginLinks) loginLinks.style.display = 'block';
        if (registroLinks) registroLinks.style.display = 'block';
    }
});