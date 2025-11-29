// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCzRZxZWREqvUp9_snuvgs33DaUnU6ry6Q",
    authDomain: "tiendalevelup-f5867.firebaseapp.com",
    projectId: "tiendalevelup-f5867",
    storageBucket: "tiendalevelup-f5867.appspot.com",
    messagingSenderId: "49561303717",
    appId: "1:49561303717:web:711b2ab36f8100a134eb4c",
    measurementId: "G-V7732K0H9Z"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productosOferta = []; // Array para almacenar productos de la oferta

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarCarrito(); // Inicializar carrito (contador, etc.)
    cargarProductosOferta();
});

/**
 * Inicializa la interfaz del carrito (solo el contador en el header)
 */
function inicializarCarrito() {
    actualizarCarritoHeader();
}

/**
 * Carga productos en oferta desde Firestore
 */
async function cargarProductosOferta() {
    try {
        const snapshot = await db.collection("producto").get();
        productosOferta = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Todos los productos:", productosOferta);
        
        // Filtrar productos con oferta (precio anterior)
        const productosConOferta = productosOferta.filter(producto => producto.precioAnterior);
        renderizarProductosOferta(productosConOferta);
    } catch (error) {
        console.error("Error cargando productos en oferta:", error);
        const contenedor = document.getElementById('productosOferta');
        contenedor.innerHTML = `<div class="col-12 text-center text-danger"><p>Error al cargar las ofertas. Intenta recargar la página.</p></div>`;
    }
}

/**
 * Renderiza los productos en oferta
 */
function renderizarProductosOferta(productos) {
    const contenedor = document.getElementById('productosOferta');
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<div class="col-12 text-center text-light"><p>No hay productos en oferta en este momento.</p></div>';
        return;
    }

    contenedor.innerHTML = productos.map(producto => `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="producto-card h-100">
                <div class="text-center mb-3">
                    <img src="${producto.imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}" 
                         alt="${producto.nombre}" 
                         class="img-fluid rounded"
                         style="height: 200px; object-fit: cover; width: 100%;"
                         onerror="this.src='https://via.placeholder.com/400x300/cccccc/969696?text=Imagen+No+Disponible'">
                </div>
                <h5 class="text-center mb-2">${producto.nombre}</h5>
                <div class="precios-oferta text-center mb-2">
                    <span class="precio-anterior text-muted">$${(producto.precioAnterior || 0).toLocaleString('es-CL')}</span>
                    <span class="precio-actual fw-bold">$${(producto.precio || 0).toLocaleString('es-CL')}</span>
                </div>
                <p class="text-center mb-3">
                    <span class="badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}">
                        Stock: ${producto.stock || 0}
                    </span>
                </p>
                <div class="d-grid gap-2">
                    <a href="detalleProducto.html?producto=${producto.id}" class="btn btn-outline-primary">
                        <i class="bi bi-eye me-2"></i>Ver Detalle
                    </a>
                    <button class="btn btn-success btn-agregar-oferta" data-id="${producto.id}" ${producto.stock <= 0 ? 'disabled' : ''}>
                        <i class="bi bi-cart-plus me-2"></i>
                        ${producto.stock <= 0 ? 'Sin Stock' : 'Añadir al Carrito'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Agregar eventos a los botones de añadir
    document.querySelectorAll('.btn-agregar-oferta').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            agregarProductoAlCarrito(productId);
        });
    });
}

/**
 * Agrega un producto al carrito
 */
function agregarProductoAlCarrito(productId) {
    const producto = productosOferta.find(p => p.id === productId);
    
    if (producto) {
        // Verificar stock antes de agregar
        if (producto.stock <= 0) {
            mostrarNotificacion('Producto sin stock disponible', 'error');
            return;
        }
        
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === productId);
        
        if (productoExistente) {
            productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        guardarCarrito();
        actualizarCarritoHeader(); // Actualizar solo el contador
        
        // ACTUALIZAR STOCK EN FIREBASE
        actualizarStockFirebase(productId, 1);
        
        mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
    }
}

/**
 * Actualizar stock en Firebase y refrescar la vista dinámicamente
 */
async function actualizarStockFirebase(productId, cantidad) {
    try {
        const productoRef = db.collection("producto").doc(productId);
        const productoDoc = await productoRef.get();
        
        if (productoDoc.exists) {
            const data = productoDoc.data();
            const nuevoStock = (data.stock || 0) - cantidad;

            await productoRef.update({ stock: nuevoStock });
            console.log(`✅ Stock actualizado: ${data.nombre} → Nuevo stock: ${nuevoStock}`);

            // 🔄 Actualizar el stock en el array local
            const productoLocal = productosOferta.find(p => p.id === productId);
            if (productoLocal) productoLocal.stock = nuevoStock;

            // 🔁 Refrescar solo la vista de productos en oferta
            const productosConOferta = productosOferta.filter(p => p.precioAnterior);
            renderizarProductosOferta(productosConOferta);
        }
    } catch (error) {
        console.error("❌ Error actualizando stock en Firebase:", error);
    }
}

/**
 * Actualiza el header del carrito (contador)
 */
function actualizarCarritoHeader() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalProductos = carrito.reduce((sum, producto) => {
            return sum + (producto.cantidad || 1);
        }, 0);
        cartCount.textContent = totalProductos;
    }
}

/**
 * Guarda el carrito en localStorage
 */
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Muestra una notificación temporal
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${tipo === 'error' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        font-weight: 600;
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Exponer funciones globales si es necesario (aunque no se usan en este contexto específico)
// window.aumentarCantidad = aumentarCantidad;
// window.disminuirCantidad = disminuirCantidad;
// window.eliminarDelCarrito = eliminarDelCarrito;
