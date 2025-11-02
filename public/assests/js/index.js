// =========================
// Index.js - Página Principal
// =========================

document.addEventListener("DOMContentLoaded", () => {
    const perfilDropdown = document.getElementById("perfilDropdown");
    const nombreUsuario = document.getElementById("nombreUsuario");
    const loginLinks = document.getElementById("loginLinks");
    const registroLinks = document.getElementById("registroLinks");

    const irPerfil = document.getElementById("irPerfil");
    const cerrarSesion = document.getElementById("cerrarSesion");

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario) {
        // Mostrar menú de perfil
        perfilDropdown.style.display = "block";
        nombreUsuario.textContent = usuario.nombre || "Usuario";

        // Ocultar login y registro
        loginLinks.style.display = "none";
        registroLinks.style.display = "none";

        // Acción "Ir al perfil"
        irPerfil.addEventListener("click", (e) => {
            e.preventDefault();
            if (usuario.rol === "admin") {
                window.location.href = "assests/page/perfilAdmin.html";
            } else {
                window.location.href = "assests/page/perfilCliente.html";
            }
        });

        // Acción "Cerrar sesión"
        cerrarSesion.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("usuario");
            window.location.reload();
        });

    } else {
        // Si no hay sesión, mostrar login y registro
        perfilDropdown.style.display = "none";
        loginLinks.style.display = "block";
        registroLinks.style.display = "block";
    }
});


document.addEventListener("DOMContentLoaded", () => {
    // Ejecutar animaciones de productos destacados
    setTimeout(animarProductos, 500);
});

// =========================
// Animaciones
// =========================
function animarProductos() {
    const productos = document.querySelectorAll(".producto-card");
    productos.forEach((producto, index) => {
        producto.style.opacity = "0";
        producto.style.transform = "translateY(30px)";
        
        setTimeout(() => {
            producto.style.transition = "all 0.6s ease";
            producto.style.opacity = "1";
            producto.style.transform = "translateY(0)";
        }, index * 100);
    });
}