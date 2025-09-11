// =========================
// Index.js - Página Principal
// =========================

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