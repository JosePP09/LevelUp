// dashboard.js

class DashboardManager {
    constructor() {
        this.estadisticas = null;
        this.estaCargando = false;
        this.firebaseInicializado = false;
        this.db = null;
        this.usuarioActual = null;
        this.init();
    }

    async init() {
        console.log('Iniciando DashboardManager...');
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
                totalCompras,
                proyeccion,
                totalProductos,
                inventario,
                totalUsuarios,
                nuevosUsuarios
            ] = await Promise.all([
                this.getTotalCompras(),
                this.getProyeccionCompras(),
                this.getTotalProductos(),
                this.getInventarioTotal(),
                this.getTotalUsuarios(),
                this.getNuevosUsuariosMes()
            ]);

            this.estadisticas = {
                totalCompras,
                proyeccionCompras: proyeccion,
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

    async getTotalCompras() {
        try {
            const snapshot = await this.db.collection("compras").get();
            return snapshot.size;
        } catch (error) {
            console.error("Error al obtener total de compras:", error);
            return 24;
        }
    }

    async getProyeccionCompras() {
        try {
            const ahora = new Date();
            const mesActualInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
            const mesAnteriorInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
            const mesAnteriorFin = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

            const snapshotActual = await this.db.collection("compras")
                .where("fecha", ">=", mesActualInicio)
                .where("fecha", "<=", ahora)
                .get();
            const comprasActual = snapshotActual.size;

            const snapshotAnterior = await this.db.collection("compras")
                .where("fecha", ">=", mesAnteriorInicio)
                .where("fecha", "<=", mesAnteriorFin)
                .get();
            const comprasAnterior = snapshotAnterior.size;

            if (comprasAnterior === 0) return comprasActual > 0 ? 100 : 0;

            const aumento = ((comprasActual - comprasAnterior) / comprasAnterior) * 100;
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

    // ==================== MÉTODOS CRUD ====================

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
                    <td>${data.correo || 'N/A'}</td>
                    <td>••••••</td>
                    <td>${data.fecha || 'N/A'}</td>
                    <td>${data.telefono || 'N/A'}</td>
                    <td>${data.direccion || 'N/A'}</td>
                    <td>${data.rol || 'N/A'}</td>
                    <td>${data.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>${data.createdAt ? data.createdAt.toDate ? data.createdAt.toDate().toLocaleDateString() : data.createdAt : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="window.dashboardManager.prepararEdicionUsuario('${doc.id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="window.dashboardManager.eliminarUsuario('${doc.id}')">Eliminar</button>
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

    async prepararEdicionUsuario(id) {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para editar usuario.");
            return;
        }
        try {
            const doc = await this.db.collection("usuario").doc(id).get();
            if (!doc.exists) {
                console.error("Usuario no encontrado para editar.");
                return;
            }
            const data = doc.data();
            this.editarUsuario(id, data);
        } catch (error) {
            console.error("Error al preparar edición de usuario:", error);
            alert("Error al preparar edición de usuario: " + error.message);
        }
    }

    async manejarSubmitUsuario(event) {
        event.preventDefault();
        const form = event.target;
        const id = document.getElementById('usuarioId').value;

        const run = form.querySelector('#usuarioRun')?.value?.trim() || '';
        const nombre = form.querySelector('#usuarioNombre')?.value?.trim() || '';
        const correo = form.querySelector('#usuarioEmail')?.value?.trim() || '';
        const fecha = form.querySelector('#usuarioFecha')?.value?.trim() || '';
        const telefono = form.querySelector('#usuarioTelefono')?.value?.trim() || '';
        const direccion = form.querySelector('#usuarioDireccion')?.value?.trim() || '';
        const rol = form.querySelector('#usuarioRol')?.value?.trim() || 'cliente';
        const activo = form.querySelector('#usuarioActivo')?.checked || false;

        // Si es nuevo usuario, validar que se ingrese una clave
        if (!id) {
            const clave = form.querySelector('#usuarioClave')?.value?.trim();
            if (!clave) {
                alert("La clave es obligatoria para crear un nuevo usuario.");
                return;
            }

            const nuevoUsuario = {
                run,
                nombre,
                correo,
                fecha,
                telefono,
                direccion,
                rol,
                activo,
                clave,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection("usuario").add(nuevoUsuario);
            alert("Usuario creado correctamente.");
        } else {
            // Si es edición, solo actualizar los campos específicos sin clave
            await this.db.collection("usuario").doc(id).update({
                run: run,
                nombre: nombre,
                correo: correo,
                fecha: fecha,
                telefono: telefono,
                direccion: direccion,
                rol: rol,
                activo: activo,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert("Usuario actualizado correctamente.");
        }

        this.cerrarModal('modalUsuario');
        this.cargarUsuarios();
    }

    // The guardarUsuario method is now handled directly in manejarSubmitUsuario

    editarUsuario(id, datos) {
        document.getElementById('usuarioId').value = id;
        document.getElementById('usuarioRun').value = datos.run || '';
        document.getElementById('usuarioNombre').value = datos.nombre || '';
        document.getElementById('usuarioEmail').value = datos.correo || '';
        document.getElementById('usuarioFecha').value = datos.fecha || '';
        document.getElementById('usuarioTelefono').value = datos.telefono || '';
        document.getElementById('usuarioDireccion').value = datos.direccion || '';
        document.getElementById('usuarioRol').value = datos.rol || 'cliente';
        document.getElementById('usuarioActivo').checked = datos.activo !== false;

        // Mostrar u ocultar el campo de contraseña según sea edición o creación
        const passwordField = document.getElementById('passwordField');
        if (passwordField) {
            if (id) {
                // Es edición, ocultar campo de contraseña
                passwordField.style.display = 'none';
            } else {
                // Es creación, mostrar campo de contraseña
                passwordField.style.display = 'block';
            }
        }

        document.getElementById('modalUsuarioTitulo').textContent = id ? 'Editar Usuario' : 'Nuevo Usuario';
        this.mostrarModal('modalUsuario');
    }

    async eliminarUsuario(id) {
        if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para eliminar usuario.");
            return;
        }
        try {
            await this.db.collection("usuario").doc(id).delete();
            alert("Usuario eliminado correctamente.");
            this.cargarUsuarios();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("Error al eliminar usuario: " + error.message);
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
                        <button class="btn btn-sm btn-warning" onclick="window.dashboardManager.prepararEdicionProducto('${doc.id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="window.dashboardManager.eliminarProducto('${doc.id}')">Eliminar</button>
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

    async prepararEdicionProducto(id) {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para editar producto.");
            return;
        }
        try {
            const doc = await this.db.collection("producto").doc(id).get();
            if (!doc.exists) {
                console.error("Producto no encontrado para editar.");
                return;
            }
            const data = doc.data();
            this.editarProducto(id, data);
        } catch (error) {
            console.error("Error al preparar edición de producto:", error);
            alert("Error al preparar edición de producto: " + error.message);
        }
    }

    async manejarSubmitProducto(event) {
        event.preventDefault();
        const form = event.target;
        const id = document.getElementById('productoId').value;

        const nombre = form.querySelector('#productoNombre')?.value?.trim() || '';
        const precio = form.querySelector('#productoPrecio')?.value?.trim() || '0';
        const stock = form.querySelector('#productoStock')?.value?.trim() || '0';
        const categoria = form.querySelector('#productoCategoria')?.value?.trim() || '';
        const imagen = form.querySelector('#productoImagen')?.value?.trim() || '';

        const datos = {
            id: id || null,
            nombre,
            precio: parseFloat(precio) || 0,
            stock: parseInt(stock) || 0,
            categoria,
            imagen
        };

        await this.guardarProducto(datos);
    }

    async guardarProducto(datos) {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para guardar producto.");
            return;
        }
        try {
            const collection = this.db.collection("producto");
            if (datos.id) {
                await collection.doc(datos.id).update({
                    nombre: datos.nombre,
                    precio: datos.precio,
                    stock: datos.stock,
                    categoria: datos.categoria,
                    imagen: datos.imagen,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert("Producto actualizado correctamente.");
            } else {
                const nuevoProducto = {
                    ...datos,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                await collection.add(nuevoProducto);
                alert("Producto creado correctamente.");
            }
            this.cerrarModal('modalProducto');
            this.cargarProductos();
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert("Error al guardar producto: " + error.message);
        }
    }

    editarProducto(id, datos) {
        document.getElementById('productoId').value = id;
        document.getElementById('productoNombre').value = datos.nombre || '';
        document.getElementById('productoPrecio').value = datos.precio || '';
        document.getElementById('productoStock').value = datos.stock || '';
        document.getElementById('productoCategoria').value = datos.categoria || '';
        document.getElementById('productoImagen').value = datos.imagen || '';

        document.getElementById('modalProductoTitulo').textContent = id ? 'Editar Producto' : 'Nuevo Producto';
        this.mostrarModal('modalProducto');
    }

    async eliminarProducto(id) {
        if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para eliminar producto.");
            return;
        }
        try {
            await this.db.collection("producto").doc(id).delete();
            alert("Producto eliminado correctamente.");
            this.cargarProductos();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert("Error al eliminar producto: " + error.message);
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
                        <button class="btn btn-sm btn-warning" onclick="window.dashboardManager.prepararEdicionCategoria('${doc.id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="window.dashboardManager.eliminarCategoria('${doc.id}')">Eliminar</button>
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

    async prepararEdicionCategoria(id) {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para editar categoría.");
            return;
        }
        try {
            const doc = await this.db.collection("categorias").doc(id).get();
            if (!doc.exists) {
                console.error("Categoría no encontrada para editar.");
                return;
            }
            const data = doc.data();
            this.editarCategoriaDirecta(id, data);
        } catch (error) {
            console.error("Error al preparar edición de categoría:", error);
            alert("Error al preparar edición de categoría: " + error.message);
        }
    }

    async manejarSubmitCategoria(event) {
        event.preventDefault();
        const form = event.target;
        const id = document.getElementById('categoriaId').value;

        const nombre = form.querySelector('#categoriaNombre')?.value?.trim() || '';
        const descripcion = form.querySelector('#categoriaDescripcion')?.value?.trim() || '';
        const estado = form.querySelector('#categoriaEstado')?.value?.trim() || 'Activa';

        const datos = {
            id: id || null,
            nombre,
            descripcion,
            estado
        };

        await this.guardarCategoria(datos);
    }

    async guardarCategoria(datos) {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para guardar categoría.");
            return;
        }
        try {
            const collection = this.db.collection("categorias");
            if (datos.id) {
                await collection.doc(datos.id).update({
                    nombre: datos.nombre,
                    descripcion: datos.descripcion,
                    estado: datos.estado,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert("Categoría actualizada correctamente.");
            } else {
                const nuevaCategoria = {
                    ...datos,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                await collection.add(nuevaCategoria);
                alert("Categoría creada correctamente.");
            }
            this.cerrarModal('modalCategoria');
            this.cargarCategorias();
        } catch (error) {
            console.error("Error al guardar categoría:", error);
            alert("Error al guardar categoría: " + error.message);
        }
    }

    editarCategoriaDirecta(id, datos) {
        document.getElementById('categoriaId').value = id;
        document.getElementById('categoriaNombre').value = datos.nombre || '';
        document.getElementById('categoriaDescripcion').value = datos.descripcion || '';
        document.getElementById('categoriaEstado').value = datos.estado || 'Activa';

        document.getElementById('modalCategoriaTitulo').textContent = id ? 'Editar Categoría' : 'Nueva Categoría';
        this.mostrarModal('modalCategoria');
    }

    async eliminarCategoria(id) {
        if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return;
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para eliminar categoría.");
            return;
        }
        try {
            await this.db.collection("categorias").doc(id).delete();
            alert("Categoría eliminada correctamente.");
            this.cargarCategorias();
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            alert("Error al eliminar categoría: " + error.message);
        }
    }

    async crearCategoria() {
        this.cerrarModal('modalCategoria');
        document.getElementById('formCategoria').reset();
        document.getElementById('categoriaId').value = '';
        document.getElementById('modalCategoriaTitulo').textContent = 'Nueva Categoría';
        this.mostrarModal('modalCategoria');
    }

    // --- Órdenes (Corregido para mostrar el correo del cliente desde la orden) ---
    async cargarOrdenes() {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para cargar órdenes.");
            return;
        }

        try {
            console.log("Cargando órdenes desde Firestore...");
            const snapshot = await this.db.collection("compras").get(); // Asumiendo colección 'compras'
            const tbody = document.getElementById("ordenes-tbody");
            tbody.innerHTML = "";

            if (snapshot.empty) {
                tbody.innerHTML = `<tr><td colspan="6" class="no-data">No hay órdenes registradas.</td></tr>`;
                return;
            }

            // Iterar sobre las órdenes directamente, ya que el cliente está dentro de cada orden
            snapshot.forEach((doc) => {
                const data = doc.data();

                // Acceder al correo directamente desde el objeto 'cliente' dentro de la orden
                const userEmail = data.cliente?.correo || 'N/A'; // Usar operador de encadenamiento opcional

                const row = document.createElement("tr");
                // Añadir onclick para ver detalles y editar estado
                row.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${userEmail}</td> <!-- Mostrar el correo del cliente desde la orden -->
                    <td>$${data.total || 0}</td>
                    <td>${data.estado || 'Pendiente'}</td>
                    <td>${data.fecha ? data.fecha.toDate ? data.fecha.toDate().toLocaleString() : data.fecha : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="window.dashboardManager.verDetallesOrden('${doc.id}')">Ver Detalles</button>
                        <button class="btn btn-sm btn-warning" onclick="window.dashboardManager.prepararEditarEstadoOrden('${doc.id}', '${data.estado}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="window.dashboardManager.cancelarOrden('${doc.id}')">Cancelar</button>
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
        // Puedes mostrar un alert simple o abrir un modal con más detalles
        alert(`ID de la Orden: ${id}`);
        // O abre un modal si prefieres una UI más elaborada
        // this.mostrarModalDetallesOrden(id);
    }

    // Función para preparar la edición del estado
    prepararEditarEstadoOrden(id, estadoActual) {
        // Llena el formulario de edición con el ID y el estado actual
        document.getElementById('editarEstadoOrdenId').value = id;
        document.getElementById('editarEstadoOrdenEstado').value = estadoActual;

        // Muestra el modal
        this.mostrarModal('modalEditarEstadoOrden');
    }

    // Función para guardar el nuevo estado de la orden
    async guardarEstadoOrden(event) {
        event.preventDefault();
        const form = event.target;
        const id = document.getElementById('editarEstadoOrdenId').value;
        const nuevoEstado = document.getElementById('editarEstadoOrdenEstado').value;

        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para actualizar el estado de la orden.");
            alert("Error al actualizar el estado: Firebase no inicializado.");
            return;
        }

        try {
            // Actualiza el campo 'estado' en la colección 'compras'
            await this.db.collection("compras").doc(id).update({
                estado: nuevoEstado,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp() // Opcional: registrar fecha de actualización
            });

            alert("Estado de la orden actualizado correctamente.");
            this.cerrarModal('modalEditarEstadoOrden');
            this.cargarOrdenes(); // Recarga la tabla para reflejar el cambio

        } catch (error) {
            console.error("Error al actualizar el estado de la orden:", error);
            alert("Error al actualizar el estado: " + error.message);
        }
    }

    // Función para cancelar una orden (solo como ejemplo, puedes reutilizar editar estado)
    async cancelarOrden(id) {
        if (!confirm("¿Estás seguro de que deseas cancelar esta orden?")) return;

        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para cancelar la orden.");
            alert("Error al cancelar: Firebase no inicializado.");
            return;
        }

        try {
            await this.db.collection("compras").doc(id).update({
                estado: 'cancelado', // Cambia el estado a 'cancelado'
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert("Orden cancelada correctamente.");
            this.cargarOrdenes(); // Recarga la tabla

        } catch (error) {
            console.error("Error al cancelar la orden:", error);
            alert("Error al cancelar la orden: " + error.message);
        }
    }


    // ==================== MÉTODOS UI ====================

    usarDatosEjemplo() {
        this.estadisticas = {
            totalCompras: 24,
            proyeccionCompras: 15,
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
            'totalCompras': this.estadisticas.totalCompras,
            'proyeccionCompras': this.estadisticas.proyeccionCompras,
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
            if (id === 'modalUsuario') {
                document.getElementById('formUsuario').reset();
                document.getElementById('passwordField').style.display = 'block';
                document.getElementById('modalUsuarioTitulo').textContent = 'Nuevo Usuario';
            }
            if (id === 'modalProducto') {
                document.getElementById('formProducto').reset();
                document.getElementById('modalProductoTitulo').textContent = 'Nuevo Producto';
            }
            if (id === 'modalCategoria') {
                document.getElementById('formCategoria').reset();
                document.getElementById('modalCategoriaTitulo').textContent = 'Nueva Categoría';
            }
            // Reiniciar formularios de órdenes al cerrar también
            if (id === 'modalEditarEstadoOrden') {
                document.getElementById('formEditarEstadoOrden').reset();
            }
        }
    }

    // ==================== FUNCIONES GLOBALES ====================

    mostrarModalUsuario() {
        document.getElementById('formUsuario').reset();
        document.getElementById('passwordField').style.display = 'block';
        document.getElementById('modalUsuarioTitulo').textContent = 'Nuevo Usuario';
        document.getElementById('usuarioId').value = '';
        this.mostrarModal('modalUsuario');
    }

    mostrarModalProducto() {
        document.getElementById('formProducto').reset();
        document.getElementById('modalProductoTitulo').textContent = 'Nuevo Producto';
        document.getElementById('productoId').value = '';
        this.mostrarModal('modalProducto');
    }

    mostrarModalCategoria() {
        document.getElementById('formCategoria').reset();
        document.getElementById('modalCategoriaTitulo').textContent = 'Nueva Categoría';
        document.getElementById('categoriaId').value = '';
        this.mostrarModal('modalCategoria');
    }

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
    if (window.dashboardManager) {
        window.dashboardManager.navegarASeccion(seccion);
    }
}

function irATienda() {
    window.location.href = '../../index.html';
}

function irALauncher() {
    window.location.href = '../../docs/api-launcher.html';
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = '../../index.html';
}

function guardarUsuario(event) {
    if (window.dashboardManager) {
        window.dashboardManager.manejarSubmitUsuario(event);
    }
}

function guardarProducto(event) {
    if (window.dashboardManager) {
        window.dashboardManager.manejarSubmitProducto(event);
    }
}

function guardarCategoria(event) {
    if (window.dashboardManager) {
        window.dashboardManager.manejarSubmitCategoria(event);
    }
}

function actualizarPerfil(event) {
    event.preventDefault();
    if (window.dashboardManager) {
        window.dashboardManager.manejarSubmitPerfil(event);
    }
}

// Nuevas funciones globales para órdenes
function guardarEstadoOrden(event) {
    if (window.dashboardManager) {
        window.dashboardManager.guardarEstadoOrden(event);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM Cargado - Inicializando DashboardManager...');
    window.dashboardManager = new DashboardManager();

    // Asociar eventos de submit a los formularios
    document.getElementById('formUsuario')?.addEventListener('submit', (e) => window.dashboardManager.manejarSubmitUsuario(e));
    document.getElementById('formProducto')?.addEventListener('submit', (e) => window.dashboardManager.manejarSubmitProducto(e));
    document.getElementById('formCategoria')?.addEventListener('submit', (e) => window.dashboardManager.manejarSubmitCategoria(e));
    document.getElementById('formPerfil')?.addEventListener('submit', (e) => window.dashboardManager.manejarSubmitPerfil(e));
    // Asociar evento submit al nuevo formulario de edición de estado
    document.getElementById('formEditarEstadoOrden')?.addEventListener('submit', (e) => window.dashboardManager.guardarEstadoOrden(e));
});
