document.addEventListener("DOMContentLoaded", () => {
    // Obtener ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get("producto");

    // Validar que exista
    if (!idProducto || !productos[idProducto]) {
        document.getElementById("producto-detalle").innerHTML = "<p>Producto no encontrado 😢</p>";
        return;
    }

    const producto = productos[idProducto];
});