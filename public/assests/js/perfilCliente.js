// perfilCliente.js
class PerfilCliente {
    constructor() {
        this.usuarioActual = null;
        this.firebaseInicializado = false;
        this.auth = null;
        this.db = null;
        this.compras = [];
        this.resenas = [];
        this.init();
    }

    async init() {
        console.log('Iniciando PerfilCliente...');
        await this.inicializarFirebase();
        this.cargarUsuarioActual();
        if (!this.usuarioActual) {
            console.error("Usuario no autenticado, redirigiendo a login...");
            window.location.href = '../login.html'; // Ajusta la ruta si es necesario
            return;
        }
        this.configurarNavegacion();
        this.inicializarNavegacion();
        await this.cargarDashboardData();
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
            this.auth = firebase.auth();
            this.db = firebase.firestore();
            this.firebaseInicializado = true;
            console.log('Firebase inicializado correctamente');
            return true;
        } catch (error) {
            console.error('Error inicializando Firebase:', error);
            return false;
        }
    }

    cargarUsuarioActual() {
        const usuarioStr = localStorage.getItem("usuario");
        if (usuarioStr) {
            this.usuarioActual = JSON.parse(usuarioStr);
            // Validar que sea un cliente o vendedor (pueden acceder a perfilCliente)
            if (this.usuarioActual.rol !== 'cliente' && this.usuarioActual.rol !== 'vendedor') {
                 console.error("Usuario no es cliente ni vendedor, redirigiendo...");
                 window.location.href = '../login.html'; // O a donde corresponda
                 return;
            }
            console.log("Usuario cliente actual cargado:", this.usuarioActual);
        } else {
            console.error("No hay usuario en localStorage");
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
        if (seccion === 'dashboard') {
            this.cargarDashboardData();
        } else if (seccion === 'historial-compras') {
            this.cargarHistorialCompras();
        } else if (seccion === 'historial-resenas') {
            this.cargarHistorialResenas();
        } else if (seccion === 'configuracion-perfil') {
            this.cargarDatosPerfilForm();
        }
    }

    // ==================== MÉTODOS DASHBOARD ====================
    async cargarDashboardData() {
        if (!this.usuarioActual || !this.firebaseInicializado) {
            console.log('No se pueden cargar datos del dashboard - Firebase no inicializado o usuario no logueado');
            return;
        }
        try {
            // Cargar compras del usuario actual usando run
            await this.cargarComprasUsuario();
            // Calcular estadísticas
            const totalCompras = this.compras.filter(c => c.estado === 'completada').length;
            const gastoTotal = this.compras
                .filter(c => c.estado === 'completada')
                .reduce((sum, compra) => sum + (compra.total || 0), 0);
            // Cargar reseñas del usuario actual usando run
            await this.cargarResenasUsuario();
            const totalResenas = this.resenas.length;
            // Actualizar UI
            document.getElementById('totalComprasCliente').textContent = totalCompras;
            document.getElementById('totalResenasCliente').textContent = totalResenas;
            document.getElementById('gastoTotalCliente').textContent = `$${gastoTotal.toLocaleString('es-CL')}`;
        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
            // Puedes mostrar mensajes de error en la UI aquí si lo deseas
        }
    }

    async cargarComprasUsuario() {
        if (!this.usuarioActual || !this.firebaseInicializado) return;
        try {
            // Cambiado: Usar 'cliente.run' en lugar de 'cliente.correo'
            const snapshot = await this.db.collection("compras")
                .where("cliente.run", "==", this.usuarioActual.run) // Ajustado a 'run'
                .get();
            this.compras = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Compras del usuario cargadas:", this.compras);
        } catch (error) {
            console.error("Error al cargar compras del usuario:", error);
            this.compras = []; // Asegurar array vacío en caso de error
        }
    }

    // ==================== MÉTODO CARGA RESEÑAS (CORREGIDO) ====================
    async cargarResenasUsuario() {
        if (!this.usuarioActual || !this.firebaseInicializado) return;
        try {
            // Cambiado: Usar 'run' en lugar de 'correo' Y usar la colección correcta 'resena'
            const snapshot = await this.db.collection("resena") // <-- AQUÍ: Cambiado de 'resena*' a 'resena'
                .where("run", "==", this.usuarioActual.run) // <-- AQUÍ: Asegúrate que 'run' sea el nombre del campo en la colección 'resena'
                .get();
            this.resenas = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Reseñas del usuario cargadas:", this.resenas);
        } catch (error) {
            console.error("Error al cargar reseñas del usuario:", error);
            this.resenas = []; // Asegurar array vacío en caso de error
        }
    }

    // ==================== MÉTODOS HISTORIAL COMPRAS ====================
    async cargarHistorialCompras() {
        await this.cargarComprasUsuario(); // Asegura que los datos estén actualizados
        const tbody = document.getElementById("compras-tbody");
        tbody.innerHTML = "";
        if (this.compras.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="no-data">No has realizado ninguna compra aún.</td></tr>`;
            return;
        }
        // Aplicar filtro si existe
        const filtroEstado = document.getElementById('filtroEstadoCompras').value;
        const comprasFiltradas = filtroEstado ? this.compras.filter(c => c.estado === filtroEstado) : this.compras;
        if (comprasFiltradas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="no-data">No hay compras con el estado seleccionado.</td></tr>`;
            return;
        }
        comprasFiltradas.forEach((compra) => {
            const productosNombres = compra.productos.map(p => p.nombre).join(', ');
            const cantidadTotal = compra.productos.reduce((sum, p) => sum + (p.cantidad || 1), 0);
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${compra.id}</td>
                <td>${productosNombres}</td>
                <td>${cantidadTotal}</td>
                <td>$${compra.total?.toLocaleString('es-CL') || 0}</td>
                <td>${compra.estado || 'Pendiente'}</td>
                <td>${compra.fecha ? compra.fecha.toDate ? compra.fecha.toDate().toLocaleString() : compra.fecha : 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetallesCompra('${compra.id}')">Ver Detalles</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filtrarCompras() {
        // Vuelve a llamar a cargarHistorialCompras para aplicar el filtro
        this.cargarHistorialCompras();
    }

    // ==================== MÉTODOS HISTORIAL RESEÑAS (CORREGIDO) ====================
    async cargarHistorialResenas() {
        await this.cargarResenasUsuario(); // Asegura que los datos estén actualizados
        const tbody = document.getElementById("resenas-tbody");
        tbody.innerHTML = "";
        if (this.resenas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="no-data">No has enviado ninguna reseña aún.</td></tr>`;
            return;
        }
        this.resenas.forEach((resena) => {
            // CORREGIDO: Usar los campos que realmente tiene 'resena' guardada por formularioContacto.js
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${resena.run || 'N/A'}</td> <!-- Mostrar el RUN del usuario que hizo la reseña -->
                <td>${resena.nombre || 'N/A'}</td> <!-- Mostrar el nombre del usuario -->
                <td>${resena.correo || 'N/A'}</td> <!-- Mostrar el correo del usuario -->
                <td>${resena.comentario || 'Sin comentario'}</td> <!-- Mostrar el comentario -->
                <td>${resena.fecha ? resena.fecha.toDate ? resena.fecha.toDate().toLocaleString() : resena.fecha : 'N/A'}</td> <!-- Mostrar la fecha -->
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarResena('${resena.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarResena('${resena.id}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // ==================== MÉTODOS CONFIGURACIÓN PERFIL ==================
    cargarDatosPerfilForm() {
        if (this.usuarioActual) {
            document.getElementById('nombreCliente').value = this.usuarioActual.nombre || '';
            document.getElementById('correoClienteEdit').value = this.usuarioActual.correo || '';
        }
    }

    async manejarSubmitPerfil(event) {
        event.preventDefault();
        const form = event.target;
        if (!this.usuarioActual || !this.firebaseInicializado) {
            alert("Error: Usuario no autenticado o Firebase no inicializado.");
            return;
        }
        const nuevoNombre = form.querySelector('#nombreCliente').value.trim();
        const nuevoCorreo = form.querySelector('#correoClienteEdit').value.trim();
        const nuevaClave = form.querySelector('#claveCliente').value.trim(); // Puede estar vacía

        // Validaciones básicas
        if (!nuevoNombre || !nuevoCorreo) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        // No es necesario verificar si el correo cambió para mostrar un mensaje de Auth.
        // El manejo se hace directamente en Firestore.
        try {
            const updates = {
                nombre: nuevoNombre,
                correo: nuevoCorreo, // Actualizar el correo en Firestore también
            };
            // Actualizar datos en la colección 'usuario*' de Firestore
            await this.db.collection("usuario").doc(this.usuarioActual.id).update(updates); // Asegúrate de usar 'usuario*'

            // Si hay nueva clave, actualizarla también en Firestore
            if (nuevaClave) {
                updates.clave = nuevaClave; // Agregar clave a los updates
                await this.db.collection("usuario").doc(this.usuarioActual.id).update(updates); // Actualizar con clave incluida
                alert("Contraseña actualizada en Firestore.");
            } else {
                // Si no hay nueva clave, solo actualizar nombre y correo
                 await this.db.collection("usuario").doc(this.usuarioActual.id).update({ nombre: nuevoNombre, correo: nuevoCorreo });
            }

            // Actualizar datos en localStorage para reflejar los cambios
            this.usuarioActual.nombre = nuevoNombre;
            this.usuarioActual.correo = nuevoCorreo;
            if (nuevaClave) {
                this.usuarioActual.clave = nuevaClave; // Opcional, si lo almacenas
            }
            localStorage.setItem("usuario", JSON.stringify(this.usuarioActual));

            alert("Perfil actualizado correctamente.");
            // Opcional: Recargar la página o actualizar la UI del header
            this.actualizarBienvenida();
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            alert("Error al actualizar el perfil: " + error.message);
        }
    }

    // ==================== MÉTODOS UI ====================
    actualizarBienvenida() {
        if (this.usuarioActual) {
            const bienvenidoCliente = document.getElementById('bienvenidoCliente');
            const correoCliente = document.getElementById('correoCliente');
            if (bienvenidoCliente) {
                bienvenidoCliente.textContent = `Bienvenido, ${this.usuarioActual.nombre}`;
            }
            if (correoCliente) {
                correoCliente.textContent = this.usuarioActual.correo;
            }
        }
    }
}

// Funciones globales
function navegarA(seccion) {
    if (window.perfilCliente) {
        window.perfilCliente.navegarASeccion(seccion);
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = '../login.html';
}

// Funciones para historial de compras
function verDetallesCompra(id) {
    alert(`Detalles de la compra: ${id}`);
    // Aquí puedes abrir un modal con más información o redirigir a una página de detalle
}

// Funciones para historial de reseñas (placeholders)
function editarResena(id) {
    alert(`Editar reseña con ID: ${id}. Funcionalidad no implementada.`);
}

function eliminarResena(id) {
    if (confirm(`¿Estás seguro de que deseas eliminar la reseña con ID: ${id}?`)) {
        alert(`Eliminar reseña con ID: ${id}. Funcionalidad no implementada.`);
    }
}

// Función para manejar el submit del formulario de perfil
function guardarPerfil(event) {
    if (window.perfilCliente) {
        window.perfilCliente.manejarSubmitPerfil(event);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM Cargado - Inicializando PerfilCliente...');
    window.perfilCliente = new PerfilCliente();
    // Asociar evento de submit al formulario de configuración de perfil
    document.getElementById('formConfiguracionPerfil')?.addEventListener('submit', (e) => window.perfilCliente.manejarSubmitPerfil(e));
});