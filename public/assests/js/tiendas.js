// tiendas.js

class TiendasManager {
    constructor() {
        this.firebaseInicializado = false;
        this.auth = null;
        this.db = null;
        this.usuarioActual = null;
        this.chartVentas = null;
        this.chartSatisfaccion = null;
        this.init();
    }

    async init() {
        console.log('Iniciando TiendasManager...');
        await this.inicializarFirebase();
        this.cargarUsuarioActual();
        this.verificarAcceso();
        this.configurarEventos();
        this.inicializarGraficos();
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
            console.log("Usuario actual cargado:", this.usuarioActual);
        }
    }

    verificarAcceso() {
        // Verificar que el usuario esté autenticado y tenga rol de admin
        if (!this.usuarioActual || this.usuarioActual.rol !== 'admin') {
            console.error("Acceso no autorizado. Redirigiendo a login...");
            window.location.href = 'login.html';
            return;
        }
        
        // Actualizar UI con información del usuario
        this.actualizarUIUsuario();
    }

    actualizarUIUsuario() {
        const nombreUsuario = document.getElementById('nombreUsuario');
        const perfilDropdown = document.getElementById('perfilDropdown');
        const loginLink = document.getElementById('loginLink');
        const registroLink = document.getElementById('registroLink');
        
        if (this.usuarioActual) {
            if (nombreUsuario) nombreUsuario.textContent = this.usuarioActual.nombre;
            if (perfilDropdown) perfilDropdown.style.display = 'list-item';
        } else {
            if (loginLink) loginLink.style.display = 'block';
            if (registroLink) registroLink.style.display = 'block';
        }
    }

    configurarEventos() {
        // Evento para cerrar sesión
        document.getElementById('cerrarSesion')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.cerrarSesion();
        });

        // Eventos para filtros
        document.getElementById('filtroCiudad')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filtroRango')?.addEventListener('change', () => this.aplicarFiltros());

        // Eventos para botones de tipo de vista
        const btnVentas = document.querySelector('.btn-outline-primary');
        const btnSatisfaccion = document.querySelector('.btn-outline-secondary.active');
        const btnOrganizacion = document.querySelectorAll('.btn-outline-secondary')[1];

        btnVentas?.addEventListener('click', () => this.cambiarVista('ventas'));
        btnSatisfaccion?.addEventListener('click', () => this.cambiarVista('satisfaccion'));
        btnOrganizacion?.addEventListener('click', () => this.cambiarVista('organizacion'));
    }

    aplicarFiltros() {
        console.log('Aplicando filtros...');
        // Aquí se aplicarían los filtros a los datos de las tiendas
        // Para esta implementación, simplemente se muestran los mismos datos
    }

    cambiarVista(tipo) {
        // Cambiar estilo de botones activos
        const botones = document.querySelectorAll('.btn-outline-primary, .btn-outline-secondary');
        botones.forEach(btn => btn.classList.remove('active'));
        
        if (tipo === 'ventas') {
            document.querySelector('.btn-outline-primary').classList.add('active');
        } else if (tipo === 'satisfaccion') {
            document.querySelectorAll('.btn-outline-secondary')[0].classList.add('active');
        } else if (tipo === 'organizacion') {
            document.querySelectorAll('.btn-outline-secondary')[1].classList.add('active');
        }

        console.log(`Cambiando vista a: ${tipo}`);
        // Aquí se podría filtrar o reorganizar los datos según el tipo de vista
    }

    inicializarGraficos() {
        // Gráfico de ventas por ciudad
        const ctx1 = document.getElementById('ventasChart').getContext('2d');
        this.chartVentas = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Santiago', 'Valparaíso', 'Concepción', 'Antofagasta'],
                datasets: [{
                    label: 'Ventas Mensuales (CLP)',
                    data: [2400000, 1500000, 1200000, 980000],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Ventas por Ciudad'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });

        // Gráfico de satisfacción por tienda
        const ctx2 = document.getElementById('satisfaccionChart').getContext('2d');
        this.chartSatisfaccion = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: ['S. Centro', 'S. Norte', 'Valparaíso', 'Concepción', 'Antofagasta'],
                datasets: [{
                    label: 'Índice de Satisfacción',
                    data: [4.8, 4.2, 4.6, 4.0, 3.5],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Satisfacción de Clientes por Tienda'
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    async cargarDatosTiendas() {
        if (!this.firebaseInicializado) {
            console.error("Firebase no está inicializado para cargar datos de tiendas.");
            return;
        }

        try {
            console.log("Cargando datos de tiendas desde Firestore...");
            // En una implementación real, esto cargaría los datos de una colección 'tiendas'
            // Por ahora, devolvemos datos simulados
            return this.obtenerDatosSimulados();
        } catch (error) {
            console.error("Error al cargar datos de tiendas:", error);
            return this.obtenerDatosSimulados();
        }
    }

    obtenerDatosSimulados() {
        return [
            {
                id: "tienda1",
                nombre: "LevelUp Santiago Centro",
                ciudad: "Santiago",
                ventasMensuales: 2400000,
                satisfaccion: 4.8,
                vendedores: 8,
                clientesMensuales: 1245,
                organizacion: 92,
                estado: "Activa"
            },
            {
                id: "tienda2",
                nombre: "LevelUp Santiago Norte",
                ciudad: "Santiago",
                ventasMensuales: 1800000,
                satisfaccion: 4.2,
                vendedores: 6,
                clientesMensuales: 892,
                organizacion: 78,
                estado: "Activa"
            },
            {
                id: "tienda3",
                nombre: "LevelUp Valparaíso",
                ciudad: "Valparaíso",
                ventasMensuales: 1500000,
                satisfaccion: 4.6,
                vendedores: 5,
                clientesMensuales: 678,
                organizacion: 88,
                estado: "Activa"
            },
            {
                id: "tienda4",
                nombre: "LevelUp Concepción",
                ciudad: "Concepción",
                ventasMensuales: 1200000,
                satisfaccion: 4.0,
                vendedores: 4,
                clientesMensuales: 543,
                organizacion: 82,
                estado: "Activa"
            },
            {
                id: "tienda5",
                nombre: "LevelUp Antofagasta",
                ciudad: "Antofagasta",
                ventasMensuales: 980000,
                satisfaccion: 3.5,
                vendedores: 3,
                clientesMensuales: 321,
                organizacion: 71,
                estado: "Activa"
            }
        ];
    }

    cerrarSesion() {
        localStorage.removeItem("usuario");
        window.location.href = 'login.html';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM Cargado - Inicializando TiendasManager...');
    window.tiendasManager = new TiendasManager();
});