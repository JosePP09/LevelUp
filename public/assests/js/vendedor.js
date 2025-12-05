// vendedor.js

class VendedorManager {
    constructor() {
        this.estadisticas = null;
        this.estaCargando = false;
        this.firebaseInicializado = false;
        this.db = null;
        this.usuarioActual = null;
        this.init();
    }

    async init() {
        console.log('Iniciando VendedorManager...');
        await this.inicializarFirebase();
        this.cargarUsuarioActual();
        this.configurarNavegacion();
        this.inicializarNavegacion();
        await this.cargarEstadisticasReales();
    }

    cargarUsuarioActual() {
        const usuarioStr = localStorage.getItem("usuario");
        if (usuarioStr) {
            this.usuarioActual = JSON.parse(usuarioStr);
            // Validar que sea un vendedor (solo vendedores pueden acceder a este panel)
            if (this.usuarioActual.rol !== 'vendedor') {
                 console.error("Usuario no es vendedor, redirigiendo...");
                 window.location.href = '../login.html'; // O a donde corresponda
                 return;
            }
            console.log("Usuario actual cargado:", this.usuarioActual);
        }
    }

    async inicializarFirebase() {
        try {
            console.log('Inicializando Firebase...');

            const firebaseConfig = {
                apiKey: "AIzaSyCzRZxZWREqvUp9_snuvgs33DaUnU6ry6Q",
                authDomain: "tiendalevelup-f5867.firebaseapp.com",
                projectId: "tiendalevelup-f5867",
                storageBucket: "tiendalevelup-f5867.appspot.com",
                messagingSenderId: "49561303717",
                appId: "1:49561303717:web:711b2ab36f8100a134eb4c",
                measurementId: "G-V7732K0H9Z"
            };

            if (typeof firebase === 'undefined') {
                console.error('Firebase no está cargado');
                return false;
            }

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.db = firebase.firestore();
            this.firebaseInicializado = true;

            console.log('Firebase inicializado correctamente');
            return true;

        } catch (error) {
            console.error('Error inicializando Firebase:', error);
            return false;
        }
    }

    configurarNavegacion() {
        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const seccion = link.getAttribute('href').substring(1);
                    this.navegarASeccion(seccion);
                }
            });
        });
    }

    inicializarNavegacion() {
        this.navegarASeccion('dashboard');
        this.actualizarBienvenida();
    }

    navegarASeccion(seccion) {
        const sections = document.querySelectorAll('main > section:not(.welcome-section)');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        const targetSection = document.getElementById(seccion);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${seccion}`) {
                link.classList.add('active');
            }
        });

        if (seccion === 'dashboard' && this.firebaseInicializado) {
            this.cargarEstadisticasReales();
        } else if (seccion === 'usuarios' && this.firebaseInicializado) {
            this.cargarUsuarios();
        } else if (seccion === 'productos' && this.firebaseInicializado) {
            this.cargarProductos();
        } else if (seccion === 'ordenes' && this.firebaseInicializado) {
            this.cargarOrdenes();
        } else if (seccion === 'categorias' && this.firebaseInicializado) {
            this.cargarCategorias();
        }
    }

    // ==================== MÉTODOS DEL DASHBOARD ====================

    async cargarEstadisticasReales() {
        if (this.estaCargando || !this.firebaseInicializado) {
            console.log('No se pueden cargar estadísticas - Firebase no inicializado');
            this.usarDatosEjemplo();
            return;
        }

        try {
            this.estaCargando = true;
            this.mostrarEstadoCarga(true);

            console.log('Cargando estadísticas REALES de Firebase...');

            const [
                totalVentas,
                proyeccion,
                totalProductos,
                inventario,
                totalUsuarios,
                nuevosUsuarios
            ] = await Promise.all([
                this.getTotalVentas(),
                this.getProyeccionVentas(),
                this.getTotalProductos(),
                this.getInventarioTotal(),
                this.getTotalUsuarios(),
                this.getNuevosUsuariosMes()
            ]);

            this.estadisticas = {
                totalVentas,
                proyeccionVentas: proyeccion,
                totalProductos,
                inventarioTotal: inventario,
                totalUsuarios,
                nuevosUsuariosMes: nuevosUsuarios
            };

            console.log('Estadísticas REALES obtenidas:', this.estadisticas);
            this.actualizarUI();

        } catch (error) {
            console.error('Error cargando estadísticas reales:', error);
            this.usarDatosEjemplo();
        } finally {
            this.estaCargando = false;
            this.mostrarEstadoCarga(false);
        }
    }

    async getTotalVentas() {
        try {
            const snapshot = await this.db.collection("compras").get();
            return snapshot.size;
        } catch (error) {
            console.error("Error al obtener total de ventas:", error);
            return 24;
        }
    }

    async getProyeccionVentas() {
        try {
            const ahora = new Date();
            const mesActualInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
            const mesAnteriorInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
            const mesAnteriorFin = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

            const snapshotActual = await this.db.collection("compras")
                .where("fecha", ">=", mesActualInicio)
                .where("fecha", "<=", ahora)
                .get();
            const ventasActual = snapshotActual.size;

            const snapshotAnterior = await this.db.collection("compras")
                .where("fecha", ">=", mesAnteriorInicio)
                .where("fecha", "<=", mesAnteriorFin)
                .get();
            const ventasAnterior = snapshotAnterior.size;

            if (ventasAnterior === 0) return ventasActual > 0 ? 100 : 0;

            const aumento = ((ventasActual - ventasAnterior) / ventasAnterior) * 100;
            return Math.round(aumento);
        } catch (error) {
            console.error("Error al calcular proyección:", error);
            return 15;
        }
    }

    async getTotalProductos() {
        try {
            const snapshot = await this.db.collection("producto").get();
            return snapshot.size;
        } catch (error) {
            console.error("Error al obtener total de productos:", error);
            return 156;
        }
    }

    async getInventarioTotal() {
        try {
            const snapshot = await this.db.collection("producto").get();
            let totalInventario = 0;

            snapshot.forEach(doc => {
                const producto = doc.data();
                totalInventario += producto.cantidad || producto.stock || 0;
            });

            return totalInventario;
        } catch (error) {
            console.error("Error al calcular inventario:", error);
            return 1248;
        }
    }

    async getTotalUsuarios() {
        try {
            const snapshot = await this.db.collection("usuario").get();
            return snapshot.size;
        } catch (error) {
            console.error("Error al obtener total de usuarios:", error);
            return 89;
        }
    }

    async getNuevosUsuariosMes() {
        try {
            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);

            const snapshot = await this.db.collection("usuario")
                .where("createdAt", ">=", inicioMes)
                .get();

            return snapshot.size;
        } catch (error) {
            console.error("Error al obtener nuevos usuarios:", error);
            return 12;
        }
    }

    // ==================== MÉTODOS VISUALIZACIÓN (SIN EDICIÓN/ELIMINACIÓN) ====================

    // --- Usuarios ---
    async cargarUsuarios() {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para cargar usuarios.");
            return;
        }

        try {
            console.log("Cargando usuarios desde Firestore...");
            const snapshot = await this.db.collection("usuario").get();
            const tbody = document.getElementById("usuarios-tbody");
            tbody.innerHTML = "";

            if (snapshot.empty) {
                tbody.innerHTML = `<tr><td colspan="11" class="no-data">No hay usuarios registrados.</td></tr>`;
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.run || 'N/A'}</td>
                    <td>${data.nombre || 'N/A'}</td>
                    <td>${data.email || 'N/A'}</td>
                    <td>••••••</td>
                    <td>${data.fecha || 'N/A'}</td>
                    <td>${data.telefono || 'N/A'}</td>
                    <td>${data.direccion || 'N/A'}</td>
                    <td>${data.rol || 'N/A'}</td>
                    <td>${data.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>${data.createdAt ? data.createdAt.toDate ? data.createdAt.toDate().toLocaleDateString() : data.createdAt : 'N/A'}</td>
                    <td>
                        <span class="btn btn-sm btn-secondary disabled" title="Vendedor no puede editar">Ver</span>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            const tbody = document.getElementById("usuarios-tbody");
            tbody.innerHTML = `<tr><td colspan="11" class="error-data">Error al cargar usuarios: ${error.message}</td></tr>`;
        }
    }

    // --- Productos ---
    async cargarProductos() {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para cargar productos.");
            return;
        }

        try {
            console.log("Cargando productos desde Firestore...");
            const snapshot = await this.db.collection("producto").get();
            const tbody = document.getElementById("productos-tbody");
            tbody.innerHTML = "";

            if (snapshot.empty) {
                tbody.innerHTML = `<tr><td colspan="6" class="no-data">No hay productos registrados.</td></tr>`;
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.nombre || 'N/A'}</td>
                    <td>$${data.precio || 0}</td>
                    <td>${data.stock || data.cantidad || 0}</td>
                    <td>${data.categoria || 'N/A'}</td>
                    <td>${data.estado || 'Activo'}</td>
                    <td>
                        <span class="btn btn-sm btn-secondary disabled" title="Vendedor no puede editar">Ver</span>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error("Error al cargar productos:", error);
            const tbody = document.getElementById("productos-tbody");
            tbody.innerHTML = `<tr><td colspan="6" class="error-data">Error al cargar productos: ${error.message}</td></tr>`;
        }
    }

    // --- Categorías ---
    async cargarCategorias() {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para cargar categorías.");
            return;
        }

        try {
            console.log("Cargando categorías desde la colección 'categorias' en Firestore...");
            const snapshot = await this.db.collection("categorias").get();
            const tbody = document.getElementById("categorias-tbody");
            tbody.innerHTML = "";

            if (snapshot.empty) {
                tbody.innerHTML = `<tr><td colspan="5" class="no-data"><i class="bi bi-inbox"></i><p>No hay categorías registradas.</p></td></tr>`;
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.nombre || 'N/A'}</td>
                    <td>${data.descripcion || 'N/A'}</td>
                    <td>${data.estado || 'Activa'}</td>
                    <td>N/A</td>
                    <td>
                        <span class="btn btn-sm btn-secondary disabled" title="Vendedor no puede editar">Ver</span>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error("Error al cargar categorías:", error);
            const tbody = document.getElementById("categorias-tbody");
            tbody.innerHTML = `<tr><td colspan="5" class="error-data">Error al cargar categorías: ${error.message}</td></tr>`;
        }
    }

    // --- Órdenes ---
    async cargarOrdenes() {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para cargar órdenes.");
            return;
        }

        try {
            console.log("Cargando órdenes desde Firestore...");
            const snapshot = await this.db.collection("compras").get();
            const tbody = document.getElementById("ordenes-tbody");
            tbody.innerHTML = "";

            if (snapshot.empty) {
                tbody.innerHTML = `<tr><td colspan="6" class="no-data">No hay órdenes registradas.</td></tr>`;
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();

                // Acceder al correo directamente desde el objeto 'cliente' dentro de la orden
                const userEmail = data.cliente?.correo || 'N/A';

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${userEmail}</td>
                    <td>$${data.total || 0}</td>
                    <td>${data.estado || 'Pendiente'}</td>
                    <td>${data.fecha ? data.fecha.toDate ? data.fecha.toDate().toLocaleString() : data.fecha : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="window.vendedorManager.verDetallesOrden('${doc.id}')">Ver Detalles</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error("Error al cargar órdenes:", error);
            const tbody = document.getElementById("ordenes-tbody");
            tbody.innerHTML = `<tr><td colspan="6" class="error-data">Error al cargar órdenes: ${error.message}</td></tr>`;
        }
    }

    // Función para mostrar detalles de la orden (solo ID en este caso)
    verDetallesOrden(id) {
        alert(`ID de la Orden: ${id}`);
    }

    // ==================== MÉTODOS UI ====================

    usarDatosEjemplo() {
        this.estadisticas = {
            totalVentas: 24,
            proyeccionVentas: 15,
            totalProductos: 156,
            inventarioTotal: 1248,
            totalUsuarios: 89,
            nuevosUsuariosMes: 12
        };
        this.actualizarUI();
    }

    actualizarUI() {
        if (!this.estadisticas) return;

        const mapeoElementos = {
            'totalVentas': this.estadisticas.totalVentas,
            'proyeccionVentas': this.estadisticas.proyeccionVentas,
            'totalProductos': this.estadisticas.totalProductos,
            'inventarioTotal': this.estadisticas.inventarioTotal,
            'totalUsuarios': this.estadisticas.totalUsuarios,
            'nuevosUsuariosMes': this.estadisticas.nuevosUsuariosMes
        };

        Object.entries(mapeoElementos).forEach(([id, valor]) => {
            this.actualizarElemento(id, valor);
        });
    }

    actualizarElemento(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
        }
    }

    mostrarEstadoCarga(mostrar) {
        const cards = document.querySelectorAll('.summary-card');
        const botones = document.querySelectorAll('.nav-button');

        cards.forEach(card => {
            card.classList.toggle('cargando', mostrar);
        });

        botones.forEach(boton => {
            boton.style.opacity = mostrar ? '0.6' : '1';
        });
    }

    actualizarBienvenida() {
        if (this.usuarioActual) {
            const bienvenidoPrincipal = document.getElementById('bienvenidoPrincipal');
            if (bienvenidoPrincipal) {
                bienvenidoPrincipal.textContent = `Bienvenido, ${this.usuarioActual.nombre}`;
            }
        }
    }

    // ==================== MÉTODOS MODALES ====================

    mostrarModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    cerrarModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
            // Reiniciar formularios de órdenes al cerrar también
            if (id === 'modalEditarEstadoOrden') {
                document.getElementById('formEditarEstadoOrden').reset();
            }
        }
    }

    // ==================== FUNCIONES GLOBALES ====================

    async manejarSubmitPerfil(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const datos = {
            profileNombre: formData.get('profileNombre'),
            profileCorreo: formData.get('profileCorreo'),
            profileTelefono: formData.get('profileTelefono')
        };

        alert("Actualizar perfil no implementado completamente.");
    }

    filtrarOrdenes() {
        console.log("Filtrando órdenes...");
        this.cargarOrdenes();
    }

    generarReporte() {
        console.log("Generando reporte...");
        document.getElementById("reporte-ventas").innerHTML = "<p>Reporte de Ventas (simulado)</p>";
        document.getElementById("reporte-productos").innerHTML = "<p>Productos Más Vendidos (simulado)</p>";
    }
}

// Funciones globales
function navegarA(seccion) {
    if (window.vendedorManager) {
        window.vendedorManager.navegarASeccion(seccion);
    }
}

function irATienda() {
    window.location.href = '../../index.html';
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = '../../index.html';
}

function actualizarPerfil(event) {
    event.preventDefault();
    if (window.vendedorManager) {
        window.vendedorManager.manejarSubmitPerfil(event);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM Cargado - Inicializando VendedorManager...');
    window.vendedorManager = new VendedorManager();

    // Asociar evento de submit al formulario de perfil
    document.getElementById('formPerfil')?.addEventListener('submit', (e) => window.vendedorManager.manejarSubmitPerfil(e));
});