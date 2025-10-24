document.addEventListener("DOMContentLoaded", () => {
  const productosContainer = document.getElementById("productos-container");
  const filtroBotones = document.querySelectorAll(".filtro-btn");
  const buscarInput = document.getElementById("buscar-producto");
  const limpiarBusquedaBtn = document.getElementById("limpiar-busqueda");
  const cartCount = document.getElementById("cart-count");

  // Si no estamos en productos.html, salir
  if (!productosContainer || !buscarInput || !limpiarBusquedaBtn || !cartCount) {
    return;
  }

  let productosGlobal = [];
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Configuración de Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCzRZxZWREqvUp9_snuvgs33DaUnU6ry6Q",
    authDomain: "tiendalevelup-f5867.firebaseapp.com",
    projectId: "tiendalevelup-f5867",
  };

  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Funciones
  function actualizarContadorCarrito() {
    cartCount.textContent = carrito.length;
  }

  async function cargarProductos() {
    try {
      productosContainer.innerHTML = `
        <div class="col-12 text-center text-light">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3">Cargando productos...</p>
        </div>`;

      const snapshot = await db.collection("producto").get();
      productosGlobal = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      mostrarProductos(productosGlobal);
    } catch (error) {
      console.error("Error cargando productos:", error);
      productosContainer.innerHTML = `
        <div class="col-12 text-center text-danger">
          <p>Error al cargar los productos. Intenta recargar la página.</p>
        </div>`;
    }
  }

  function mostrarProductos(productos) {
    if (productos.length === 0) {
      productosContainer.innerHTML = `
        <div class="col-12 text-center text-light">
          <p>No se encontraron productos.</p>
        </div>`;
      return;
    }

    productosContainer.innerHTML = productos.map(producto => `
      <div class="col-lg-3 col-md-6 mb-4 producto ${producto.categoria?.toLowerCase() || ""}" data-id="${producto.id}">
        <div class="producto-card h-100">
          <div class="text-center mb-3">
            <img src="${producto.imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}"
                 alt="${producto.nombre || 'Producto'}"
                 class="img-fluid rounded"
                 style="height: 200px; object-fit: cover; width: 100%;">
          </div>
          <h5 class="text-center mb-3">${producto.nombre || "Producto sin nombre"}</h5>
          <p class="precio text-center mb-3">$${(producto.precio || 0).toLocaleString("es-CL")}</p>
          <p class="text-light text-center small mb-3">${producto.descripcion || ""}</p>
          <div class="d-grid gap-2">
            <a href="detalleProducto.html?producto=${producto.id}" class="btn btn-outline-primary">
              <i class="bi bi-eye me-2"></i>Ver Detalle
            </a>
            <button class="btn btn-success btn-agregar-producto" data-id="${producto.id}">
              <i class="bi bi-cart-plus me-2"></i>Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    `).join("");

    // Agregar eventos a los botones
    document.querySelectorAll(".btn-agregar-producto").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const producto = productosGlobal.find(p => p.id === id);
        if (producto) {
          carrito.push(producto);
          localStorage.setItem("carrito", JSON.stringify(carrito));
          actualizarContadorCarrito();
          // Notificación simple
          const notif = document.createElement("div");
          notif.textContent = `"${producto.nombre}" agregado al carrito`;
          notif.className = "position-fixed top-0 end-0 m-4 p-3 bg-success text-white rounded shadow";
          notif.style.zIndex = "1050";
          document.body.appendChild(notif);
          setTimeout(() => notif.remove(), 3000);
        }
      });
    });
  }

  // Eventos
  filtroBotones.forEach(btn => {
    btn.addEventListener("click", () => {
      filtroBotones.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.categoria;
      const filtrados = cat === "todos" 
        ? productosGlobal 
        : productosGlobal.filter(p => p.categoria?.toLowerCase() === cat);
      mostrarProductos(filtrados);
    });
  });

  buscarInput.addEventListener("input", () => {
    const term = buscarInput.value.toLowerCase().trim();
    const resultados = term 
      ? productosGlobal.filter(p => 
          p.nombre?.toLowerCase().includes(term) ||
          p.descripcion?.toLowerCase().includes(term) ||
          p.categoria?.toLowerCase().includes(term)
        )
      : productosGlobal;
    mostrarProductos(resultados);
  });

  limpiarBusquedaBtn?.addEventListener("click", () => {
    buscarInput.value = "";
    mostrarProductos(productosGlobal);
  });

  // Iniciar
  actualizarContadorCarrito();
  cargarProductos();

  console.log("✅ Catálogo listo con Firebase");
});