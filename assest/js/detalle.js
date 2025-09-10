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
    // Actualizar breadcrumb con la categoría
    const breadcrumbCategoria = document.getElementById("breadcrumb-categoria");
    if (breadcrumbCategoria) {
        breadcrumbCategoria.textContent = categorias[producto.categoria] || producto.categoria || "Categoría";
    }

    // Elementos para cantidad
    const btnMas = document.getElementById("btn-incrementar");
    const btnMenos = document.getElementById("btn-decrementar");
    const inputCantidad = document.getElementById("cantidad");

    // Inicializamos cantidad en 1
    let cantidad = 1;
    inputCantidad.value = cantidad;

    // Botón +
    btnMas.addEventListener("click", () => {
        cantidad++;
        inputCantidad.value = cantidad;
    });

    // Botón -
    btnMenos.addEventListener("click", () => {
        if (cantidad > 1) cantidad--;
        inputCantidad.value = cantidad;
    });

    // Botón agregar al carrito
    document.getElementById("btn-agregar-carrito").addEventListener("click", () => {
        alert(`Función de carrito deshabilitada. Producto: ${producto.nombre} (Cantidad: ${cantidad})`);
    });
});