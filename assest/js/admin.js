// =========================
// Dashboard Administrador - Level-Up Gamer
// =========================

// Verificar si estamos en la página correcta
function esPaginaAdmin() {
    return window.location.pathname.includes('perfilAdmin.html');
}

// Inicializar sistema de productos del admin
function inicializarSistemaProductos() {
    // Si no hay productos en localStorage, inicializar con array vacío
    if (!localStorage.getItem('productosAdmin')) {
        localStorage.setItem('productosAdmin', JSON.stringify([]));
    }
}

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
    if (!esPaginaAdmin()) {
        console.log('admin.js se está ejecutando en una página incorrecta, saltando inicialización');
        return;
    }
    
    inicializarSistemaProductos();
    inicializarDashboard();
    configurarNavegacion();
    cargarDatosDashboard();
});

function inicializarDashboard() {
    // Mostrar contenido del dashboard por defecto
    mostrarSeccion('dashboard');
}

function configurarNavegacion() {
    // Obtener todos los enlaces del sidebar
    const enlaces = document.querySelectorAll('.nav-link[data-section]');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los enlaces
            enlaces.forEach(link => {
                link.classList.remove('active', 'text-gaming');
                link.classList.add('text-light');
            });
            
            // Agregar clase active al enlace clickeado
            this.classList.add('active', 'text-gaming');
            this.classList.remove('text-light');
            
            // Mostrar la sección correspondiente
            const seccion = this.getAttribute('data-section');
            mostrarSeccion(seccion);
        });
    });
}

function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    const secciones = ['dashboard', 'productos', 'usuarios', 'pedidos', 'estadisticas'];
    secciones.forEach(sec => {
        const elemento = document.getElementById(sec + '-content');
        if (elemento) {
            elemento.style.display = 'none';
        }
    });
    
    // Mostrar la sección seleccionada
    const seccionElemento = document.getElementById(seccion + '-content');
    if (seccionElemento) {
        seccionElemento.style.display = 'block';
        
        // Cargar datos específicos de la sección
        switch(seccion) {
            case 'productos':
                cargarProductos();
                break;
            case 'usuarios':
                cargarUsuarios();
                break;
            case 'pedidos':
                cargarPedidos();
                break;
            case 'estadisticas':
                cargarEstadisticas();
                break;
        }
    }
}

function cargarDatosDashboard() {
    // Cargar estadísticas generales
    cargarEstadisticasGenerales();
    
    // Cargar productos con stock bajo
    cargarStockBajo();
    
    // Cargar actividad reciente
    cargarActividadReciente();
}

// =========================
// Gestión de Datos
// =========================

function obtenerEstadisticasGenerales() {
    // Obtener productos del localStorage o usar array vacío
    const productosGuardados = JSON.parse(localStorage.getItem('productosAdmin') || '[]');
    
    return {
        totalProductos: productosGuardados.length,
        totalUsuarios: 1, // Solo el admin por ahora
        ventasMes: 0,
        pedidosPendientes: 0
    };
}

function cargarEstadisticasGenerales() {
    const stats = obtenerEstadisticasGenerales();
    
    actualizarElemento('total-productos', stats.totalProductos);
    actualizarElemento('total-usuarios', stats.totalUsuarios);
    actualizarElemento('ventas-mes', `$${stats.ventasMes.toLocaleString('es-CL')}`);
    actualizarElemento('pedidos-pendientes', stats.pedidosPendientes);
}

function actualizarElemento(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor;
    } else {
        console.warn(`No se encontró el elemento con ID: ${id}`);
    }
}

function obtenerProductosConStockBajo() {
    const productosGuardados = JSON.parse(localStorage.getItem('productosAdmin') || '[]');
    
    return productosGuardados.filter(producto => 
        producto.stock <= producto.stockCritico
    );
}

function crearElementoStockBajo(producto) {
    const li = document.createElement('li');
    li.className = 'mb-2';
    
    const warning = document.createElement('span');
    warning.className = 'text-warning';
    warning.textContent = '⚠️';
    
    const nombre = document.createElement('span');
    nombre.className = 'text-light';
    nombre.textContent = producto.nombre;
    
    const stock = document.createElement('small');
    stock.className = 'text-muted';
    stock.textContent = `(Stock: ${producto.stock})`;
    
    li.appendChild(warning);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(nombre);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(stock);
    
    return li;
}

function cargarStockBajo() {
    const stockBajo = document.getElementById('stock-bajo');
    if (!stockBajo) {
        console.warn('No se encontró el elemento stock-bajo');
        return;
    }
    
    // Limpiar contenido anterior
    stockBajo.innerHTML = '';
    
    const productosConStockBajo = obtenerProductosConStockBajo();
    
    if (productosConStockBajo.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.className = 'text-light';
        mensaje.textContent = 'No hay productos con stock bajo';
        stockBajo.appendChild(mensaje);
    } else {
        const ul = document.createElement('ul');
        ul.className = 'list-unstyled';
        
        productosConStockBajo.forEach(producto => {
            ul.appendChild(crearElementoStockBajo(producto));
        });
        
        stockBajo.appendChild(ul);
    }
}

function obtenerActividadReciente() {
    return [
        { usuario: 'admin@duoc.cl', accion: 'Inició sesión', fecha: 'Hace 5 minutos' },
        { usuario: 'cliente@duoc.cl', accion: 'Registró nuevo usuario', fecha: 'Hace 1 hora' },
        { usuario: 'admin@duoc.cl', accion: 'Agregó nuevo producto', fecha: 'Hace 2 horas' }
    ];
}

function crearFilaActividad(actividad) {
    const tr = document.createElement('tr');
    
    const usuario = document.createElement('td');
    usuario.textContent = actividad.usuario;
    
    const accion = document.createElement('td');
    accion.textContent = actividad.accion;
    
    const fecha = document.createElement('td');
    fecha.textContent = actividad.fecha;
    
    tr.appendChild(usuario);
    tr.appendChild(accion);
    tr.appendChild(fecha);
    
    return tr;
}

function cargarActividadReciente() {
    const actividad = document.getElementById('actividad-reciente');
    if (!actividad) {
        console.warn('No se encontró el elemento actividad-reciente');
        return;
    }
    
    // Limpiar contenido anterior
    actividad.innerHTML = '';
    
    const actividades = obtenerActividadReciente();
    actividades.forEach(act => {
        actividad.appendChild(crearFilaActividad(act));
    });
}

function crearFilaProducto(producto, index) {
    const tr = document.createElement('tr');
    
    // Código
    const codigo = document.createElement('td');
    codigo.textContent = producto.codigo || `PROD${index + 1}`;
    
    // Nombre
    const nombre = document.createElement('td');
    nombre.textContent = producto.nombre || 'Sin nombre';
    
    // Precio
    const precio = document.createElement('td');
    precio.textContent = `$${(producto.precio || 0).toLocaleString('es-CL')}`;
    
    // Stock
    const stockTd = document.createElement('td');
    const stockSpan = document.createElement('span');
    stockSpan.textContent = producto.stock || 0;
    stockSpan.className = (producto.stock || 0) <= (producto.stockCritico || 0) ? 'text-warning' : 'text-light';
    stockTd.appendChild(stockSpan);
    
    // Categoría
    const categoria = document.createElement('td');
    categoria.textContent = producto.categoria || 'Sin categoría';
    
    // Acciones
    const acciones = document.createElement('td');
    
    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn btn-sm btn-outline-primary me-1';
    btnEditar.innerHTML = '<i class="bi bi-pencil"></i>';
    btnEditar.addEventListener('click', () => editarProducto(index));
    
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn-sm btn-outline-danger';
    btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
    btnEliminar.addEventListener('click', () => eliminarProducto(index));
    
    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);
    
    // Ensamblar fila
    tr.appendChild(codigo);
    tr.appendChild(nombre);
    tr.appendChild(precio);
    tr.appendChild(stockTd);
    tr.appendChild(categoria);
    tr.appendChild(acciones);
    
    return tr;
}

function cargarProductos() {
    const tabla = document.getElementById('tabla-productos');
    if (!tabla) {
        console.warn('No se encontró el elemento tabla-productos');
        return;
    }
    
    // Limpiar contenido anterior
    tabla.innerHTML = '';
    
    const productosGuardados = JSON.parse(localStorage.getItem('productosAdmin') || '[]');
    
    if (productosGuardados.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 6;
        td.className = 'text-center text-light';
        td.textContent = 'No hay productos registrados. Agrega el primero desde el botón "Nuevo Producto"';
        tr.appendChild(td);
        tabla.appendChild(tr);
    } else {
        productosGuardados.forEach((producto, index) => {
            tabla.appendChild(crearFilaProducto(producto, index));
        });
    }
}

function obtenerUsuarios() {
    return [
        {
            run: '12345678-9',
            nombre: 'Administrador',
            email: 'admin@duoc.cl',
            tipo: 'Administrador',
            region: 'Metropolitana'
        }
    ];
}

function crearFilaUsuario(usuario) {
    const tr = document.createElement('tr');
    
    // RUN
    const run = document.createElement('td');
    run.textContent = usuario.run;
    
    // Nombre
    const nombre = document.createElement('td');
    nombre.textContent = usuario.nombre;
    
    // Email
    const email = document.createElement('td');
    email.textContent = usuario.email;
    
    // Tipo
    const tipo = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = 'badge bg-danger';
    badge.textContent = usuario.tipo;
    tipo.appendChild(badge);
    
    // Región
    const region = document.createElement('td');
    region.textContent = usuario.region;
    
    // Acciones
    const acciones = document.createElement('td');
    
    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn btn-sm btn-outline-primary me-1';
    btnEditar.innerHTML = '<i class="bi bi-pencil"></i>';
    btnEditar.addEventListener('click', () => editarUsuario(usuario.run));
    
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn-sm btn-outline-danger';
    btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
    btnEliminar.addEventListener('click', () => eliminarUsuario(usuario.run));
    
    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);
    
    // Ensamblar fila
    tr.appendChild(run);
    tr.appendChild(nombre);
    tr.appendChild(email);
    tr.appendChild(tipo);
    tr.appendChild(region);
    tr.appendChild(acciones);
    
    return tr;
}

function cargarUsuarios() {
    const tabla = document.getElementById('tabla-usuarios');
    if (!tabla) {
        console.warn('No se encontró el elemento tabla-usuarios');
        return;
    }
    
    // Limpiar contenido anterior
    tabla.innerHTML = '';
    
    const usuarios = obtenerUsuarios();
    usuarios.forEach(usuario => {
        tabla.appendChild(crearFilaUsuario(usuario));
    });
}

function cargarPedidos() {
    const pedidosContent = document.getElementById('pedidos-content');
    if (pedidosContent) {
        const cardBody = pedidosContent.querySelector('.card-body');
        if (cardBody) {
            cardBody.innerHTML = '<p class="text-light">Sistema de pedidos en desarrollo. Aquí se mostrarán los pedidos de los clientes.</p>';
        }
    }
}

function cargarEstadisticas() {
    const estadisticasContent = document.getElementById('estadisticas-content');
    if (estadisticasContent) {
        const cardBody = estadisticasContent.querySelector('.card-body');
        if (cardBody) {
            cardBody.innerHTML = '<p class="text-light">Gráficos y estadísticas en desarrollo. Aquí se mostrarán métricas de ventas y usuarios.</p>';
    }
    }
}


// =========================
// Utilidades
// =========================

function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    notificacion.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.remove();
        }
    }, 3000);
}

// =========================
// Funciones de Acción
// =========================

function editarProducto(index) {
    const productosGuardados = JSON.parse(localStorage.getItem('productosAdmin') || '[]');
    const producto = productosGuardados[index];
    
    if (producto) {
        mostrarNotificacion(`Editando producto: ${producto.nombre || 'Sin nombre'}`, 'info');
        // Aquí se implementaría la funcionalidad de edición
    } else {
        mostrarNotificacion('Producto no encontrado', 'error');
    }
}

function eliminarProducto(index) {
    const productosGuardados = JSON.parse(localStorage.getItem('productosAdmin') || '[]');
    const producto = productosGuardados[index];
    
    if (producto) {
        const nombreProducto = producto.nombre || 'Sin nombre';
        if (confirm(`¿Estás seguro de eliminar el producto ${nombreProducto}?`)) {
            productosGuardados.splice(index, 1);
            localStorage.setItem('productosAdmin', JSON.stringify(productosGuardados));
            mostrarNotificacion(`Producto ${nombreProducto} eliminado`, 'success');
            cargarProductos(); // Recargar la tabla
        }
    } else {
        mostrarNotificacion('Producto no encontrado', 'error');
    }
}

function editarUsuario(id) {
    mostrarNotificacion(`Editando usuario: ${id}`, 'info');
    // Aquí se implementaría la funcionalidad de edición de usuario
}

function eliminarUsuario(id) {
    if (confirm(`¿Estás seguro de eliminar este usuario?`)) {
        mostrarNotificacion(`Usuario ${id} eliminado`, 'success');
        // Aquí se implementaría la funcionalidad de eliminación de usuario
    }
}
