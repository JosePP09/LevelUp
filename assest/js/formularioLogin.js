// =========================
// Sistema de Login - Level-Up Gamer
// =========================

// Usuarios administradores válidos
const usuariosAdmin = {
    'admin@levelupgamer.cl': { password: 'admin123', nombre: 'Administrador', rol: 'admin' },
    'admin@duoc.cl': { password: 'duoc123', nombre: 'Admin Duoc', rol: 'admin' },
    'admin@profesor.duoc.cl': { password: 'profesor123', nombre: 'Admin Profesor', rol: 'admin' },
    'admin@gmail.com': { password: 'gmail123', nombre: 'Admin Gmail', rol: 'admin' }
};

function validarCorreo(correo) {
    const regex = /^[^@\s]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

function validarCredenciales(correo, password) {
    const usuario = usuariosAdmin[correo.toLowerCase()];
    return usuario && usuario.password === password;
}

function iniciarSesion(usuario) {
    // Guardar datos del usuario en localStorage
    localStorage.setItem('usuarioLogueado', JSON.stringify({
        correo: usuario.correo,
        nombre: usuario.nombre,
        rol: usuario.rol,
        fechaLogin: new Date().toISOString()
    }));
    
    // Redirigir al dashboard de administrador
    window.location.href = "perfilAdmin.html";
}

function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    window.location.href = "login.html";
}

// Verificar si hay una sesión activa
function verificarSesion() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
    if (usuario && usuario.rol === 'admin') {
        return usuario;
    }
    return null;
}

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formLogin");
    const correoInput = document.getElementById("correo");
    const passwordInput = document.getElementById("clave");
    const mensaje = document.getElementById("mensaje");

    // Si ya hay una sesión activa, redirigir al dashboard
    if (verificarSesion()) {
        window.location.href = "perfilAdmin.html";
        return;
    }

    // Validación en el submit
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        mensaje.innerText = ""; // limpiar mensajes previos

        const correo = correoInput.value.trim();
        const password = passwordInput.value.trim();

        // Validar formato del correo
        if (!validarCorreo(correo)) {
            correoInput.setCustomValidity("El correo debe ser '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'");
            correoInput.reportValidity();
            mensaje.style.color = "red";
            mensaje.innerText = "❌ Correo inválido. Solo se permiten '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'.";
            return;
        }

        // Validar credenciales
        if (!validarCredenciales(correo, password)) {
            mensaje.style.color = "red";
            mensaje.innerText = "❌ Credenciales incorrectas. Verifica tu correo y contraseña.";
            return;
        }

        // ✅ Si es válido
        correoInput.setCustomValidity("");
        mensaje.style.color = "green";
        mensaje.innerText = "✅ Login exitoso. Redirigiendo al dashboard...";

        // Obtener datos del usuario
        const usuario = usuariosAdmin[correo.toLowerCase()];
        usuario.correo = correo;

        // Esperar 1 segundo antes de redirigir
        setTimeout(() => {
            iniciarSesion(usuario);
        }, 1000);
    });

    // Limpiar error cuando el usuario escriba de nuevo
    correoInput.addEventListener("input", () => {
        correoInput.setCustomValidity("");
        mensaje.innerText = "";
    });

    passwordInput.addEventListener("input", () => {
        mensaje.innerText = "";
    });
});
