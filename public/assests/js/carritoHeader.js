// carrito-header.js - Actualiza el contador del carrito en todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        // Leer carrito de localStorage
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        // Calcular total de productos (sumando cantidades)
        const totalProductos = carrito.reduce((sum, producto) => {
            return sum + (producto.cantidad || 1);
        }, 0);
        // Actualizar el contador
        cartCountElement.textContent = totalProductos;
    }
});