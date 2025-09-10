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

    // Mostrar imagen del producto
    const imagenProducto = document.getElementById("producto-imagen");
    if (imagenProducto) {
        imagenProducto.src = producto.imagen;
        imagenProducto.alt = producto.nombre;
    }

    // Mostrar datos
    document.getElementById("producto-nombre").textContent = producto.nombre;
    document.getElementById("producto-precio").textContent = `$${producto.precio.toLocaleString()}`;
    document.getElementById("producto-descripcion").textContent = producto.descripcion;
    
    // Mostrar código del producto
    const codigoElement = document.getElementById("producto-codigo");
    if (codigoElement) {
        codigoElement.textContent = producto.codigo || "Sin código";
    }
    
    // Mostrar categoría
    const categoriaElement = document.getElementById("producto-categoria");
    if (categoriaElement) {
        categoriaElement.textContent = categorias[producto.categoria] || producto.categoria || "Sin categoría";
    }
    
    // Mostrar stock
    const stockElement = document.getElementById("producto-stock");
    if (stockElement) {
        stockElement.textContent = producto.stock || 0;
        
        // Mostrar alerta de stock bajo si es necesario
        const stockAlert = document.getElementById("stock-alert");
        if (producto.stock <= producto.stockCritico && stockAlert) {
            stockAlert.classList.remove("d-none");
        }
    }
});