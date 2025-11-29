// Inicializar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCzRZxZWREqvUp9_snuvgs33DaUnU6ry6Q",
    authDomain: "tiendalevelup-f5867.firebaseapp.com",
    projectId: "tiendalevelup-f5867",
    storageBucket: "tiendalevelup-f5867.appspot.com",
    messagingSenderId: "49561303717",
    appId: "1:49561303717:web:711b2ab36f8100a134eb4c",
    measurementId: "G-V7732K0H9Z"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Variables globales
let productosGlobal = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Elementos del DOM
const buscarInput = document.getElementById("buscar-producto");
const productosDestacadosContainer = document.getElementById("productos-destacados");

// Funciones
function actualizarContadorCarrito() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.textContent = carrito.length;
    }
}

async function cargarProductos() {
    try {
        // Mostrar spinner mientras carga
        productosDestacadosContainer.innerHTML = `
            <div class="col-12 text-center text-light">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-3">Cargando productos destacados...</p>
            </div>`;

        const snapshot = await db.collection("producto").get();
        productosGlobal = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        mostrarProductos(productosGlobal);

    } catch (error) {
        console.error("Error cargando productos:", error);
        productosDestacadosContainer.innerHTML = `
            <div class="col-12 text-center text-danger">
                <p>Error al cargar los productos. Intenta recargar la página.</p>
            </div>`;
    }
}

function mostrarProductos(productos) {
    if (productos.length === 0) {
        productosDestacadosContainer.innerHTML = `
            <div class="col-12 text-center text-light">
                <p>No se encontraron productos.</p>
            </div>`;
        return;
    }

    // Tomar solo los primeros 4 productos para mostrar en destacados
    const productosParaMostrar = productos.slice(0, 4);

    productosDestacadosContainer.innerHTML = productosParaMostrar.map(producto => `
        <div class="col-lg-3 col-md-6 mb-4">
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
                    <a href="assests/page/detalleProducto.html?producto=${producto.id}" class="btn btn-outline-primary">
                        <i class="bi bi-eye me-2"></i>Ver Detalle
                    </a>
                    <button class="btn btn-success" onclick="alert('Función de carrito deshabilitada')">
                        <i class="bi bi-cart-plus me-2"></i>Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `).join("");

}

// Evento de búsqueda en tiempo real
buscarInput?.addEventListener("input", () => {
    const term = buscarInput.value.toLowerCase().trim();
    // Redirigir inmediatamente a productos.html con el término de búsqueda
    if (term) {
        window.location.href = `assests/page/productos.html?busqueda=${encodeURIComponent(term)}`;
    } else {
        // Si no hay término, redirigir a productos.html sin parámetros
        window.location.href = 'assests/page/productos.html';
    }
});

// Cargar categorías desde Firestore y poblar el menú desplegable
async function cargarCategorias() {
    const categoriasDropdownMenu = document.getElementById('categoriasDropdownMenu');
    try {
        const snapshot = await db.collection('categorias').get();
        categoriasDropdownMenu.innerHTML = ''; // Limpiar el menú

        if (snapshot.empty) {
            categoriasDropdownMenu.innerHTML = '<li><a class="dropdown-item disabled" href="#">No hay categorías</a></li>';
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            const categoriaNombre = data.nombre || 'N/A'; // Asegura un nombre
            const categoriaId = doc.id; // ID del documento en Firestore

            // Crear un elemento de lista para cada categoría
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'dropdown-item';
            a.href = `assests/page/productos.html?categoria=${encodeURIComponent(categoriaNombre)}`; // Pasar categoría como parámetro
            a.textContent = categoriaNombre;
            li.appendChild(a);
            categoriasDropdownMenu.appendChild(li);
        });

    } catch (error) {
        console.error('Error al cargar categorías: ', error);
        categoriasDropdownMenu.innerHTML = '<li><a class="dropdown-item disabled" href="#">Error al cargar categorías</a></li>';
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    cargarProductos();
    cargarCategorias();
});