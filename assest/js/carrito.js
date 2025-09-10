// =============================
// Funciones base del carrito
// =============================
function getCarrito() {
    try {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      // Limpiar datos corruptos o inválidos
      return carrito.filter(item => 
        item && 
        item.id && 
        typeof item.cantidad === 'number' && 
        item.cantidad > 0 &&
        productos[item.id] // Verificar que el producto existe
      );
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      return [];
    }
  }
  
  function saveCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  
  function agregarAlCarrito(idProducto) {
    let carrito = getCarrito();
    const index = carrito.findIndex(p => p.id === idProducto);
  
    if (index >= 0) {
      carrito[index].cantidad++;
    } else {
      carrito.push({ id: idProducto, cantidad: 1 });
    }
  
    saveCarrito(carrito);
    actualizarContadorCarrito();
  }
  
  function agregarAlCarritoConCantidad(idProducto, cantidad) {
    let carrito = getCarrito();
    const index = carrito.findIndex(p => p.id === idProducto);
  
    if (index >= 0) {
      carrito[index].cantidad += cantidad;
    } else {
      carrito.push({ id: idProducto, cantidad });
    }
  
    saveCarrito(carrito);
    actualizarContadorCarrito();
  }
  
  function quitarDelCarrito(idProducto) {
    let carrito = getCarrito();
    carrito = carrito.filter(p => p.id !== idProducto);
    saveCarrito(carrito);
    actualizarContadorCarrito();
  }
  
  function actualizarCantidad(idProducto, nuevaCantidad) {
    let carrito = getCarrito();
    const index = carrito.findIndex(p => p.id === idProducto);
    
    if (index >= 0) {
      if (nuevaCantidad <= 0) {
        carrito.splice(index, 1);
      } else {
        carrito[index].cantidad = nuevaCantidad;
      }
      saveCarrito(carrito);
      actualizarContadorCarrito();
    }
  }
  
  function vaciarCarrito() {
    // Limpiar completamente el carrito
    localStorage.removeItem("carrito");
    
    // Actualizar contador
    actualizarContadorCarrito();
    
    // Si estamos en la página del carrito, actualizar la vista
    if (document.getElementById("carrito-container")) {
      renderCarrito();
    }
    
    // Forzar actualización del total
    if (document.getElementById("total-suma")) {
      document.getElementById("total-suma").textContent = "0";
    }
  }
  
  function actualizarContadorCarrito() {
    let carrito = getCarrito();
    let total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  
    const linkCarrito = document.querySelector("a[href$='carrito.html']");
    if (linkCarrito) {
      linkCarrito.innerHTML = `<i class="bi bi-cart3"></i> Carrito(${total})`;
    }
  }
  
  // Actualizar contador siempre que se cargue la página
  document.addEventListener("DOMContentLoaded", function() {
      // Solo actualizar contador si no estamos en la página de detalle
      if (!window.location.pathname.includes('detalleProducto.html')) {
          actualizarContadorCarrito();
      }
  });
  
  // =============================
  // Render de la vista del carrito - Solo visualización
  // =============================
  function renderCarrito() {
    // Solo mantener el contador del carrito actualizado
    actualizarContadorCarrito();
  }
  
  function renderTotal() {
    const carrito = getCarrito();
    let total = carrito.reduce((sum, item) => sum + productos[item.id].precio * item.cantidad, 0);
    document.getElementById("total-suma").textContent = total.toLocaleString();
  }
  
  // =============================
  // Función para limpiar carrito corrupto
  // =============================
  function limpiarCarritoCorrupto() {
    console.log("Limpiando carrito corrupto...");
    localStorage.removeItem("carrito");
    actualizarContadorCarrito();
    if (document.getElementById("carrito-container")) {
      renderCarrito();
    }
  }
  
  // =============================
  // Funcionalidad de cupones
  // =============================
  function aplicarCupon(codigoCupon) {
    const cupones = {
      'LEVELUP20': 0.20,
      'DUOC20': 0.20,
      'GAMER10': 0.10
    };
    
    return cupones[codigoCupon.toUpperCase()] || 0;
  }

  function calcularTotalConDescuento(total, descuento) {
    return total * (1 - descuento);
  }

  // =============================
  // Botones globales - Solo visualización
  // =============================
  document.addEventListener("DOMContentLoaded", () => {
    // Solo mantener el contador del carrito actualizado
    actualizarContadorCarrito();
    
    if (document.getElementById("carrito-container")) {
      renderCarrito();
    }
  });
