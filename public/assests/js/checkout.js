// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCzRZxZWREqvUp9_snuvgs33DaUnU6ry6Q",
    authDomain: "tiendalevelup-f5867.firebaseapp.com",
    projectId: "tiendalevelup-f5867",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const regionesComunas = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Metropolitana": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Ñuble": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Treguaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"],
    "Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualpén", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío", "Lebú", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa"],
    "Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
    "Aysén": ["Coihaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
};

document.addEventListener('DOMContentLoaded', function() {
    inicializarCheckout();
    configurarEventosCheckout();
    cargarRegiones();
});

function cargarRegiones() {
    const selectRegion = document.getElementById('region');
    const regionesOrdenadas = Object.keys(regionesComunas).sort();
    regionesOrdenadas.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        selectRegion.appendChild(option);
    });
}

function cargarComunas(region) {
    const selectComuna = document.getElementById('comuna');
    const comunas = regionesComunas[region] || [];
    selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
    comunas.sort().forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        selectComuna.appendChild(option);
    });
    // NO usar disabled - dejar el campo habilitado para validación HTML5
    selectComuna.value = ''; // Forzar selección
}

function inicializarCheckout() {
    renderizarProductosCheckout();
    actualizarTotales();
}

function renderizarProductosCheckout() {
    const tbody = document.getElementById('tablaCheckoutBody');
    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <div class="my-4">🛒</div>
                    <h5>No hay productos en el carrito</h5>
                    <a href="carrito.html" class="btn btn-primary mt-2">Volver al Carrito</a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = carrito.map(producto => `
        <tr>
            <td>
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}" 
                     class="imagen-tabla"
                     style="width: 60px; height: auto;"
                     onerror="this.src='https://via.placeholder.com/60x60/cccccc/969696?text=Img'">
            </td>
            <td>${producto.nombre}</td>
            <td>$${(producto.precio || 0).toLocaleString('es-CL')}</td>
            <td>${producto.cantidad || 1}</td>
            <td>$${((producto.precio || 0) * (producto.cantidad || 1)).toLocaleString('es-CL')}</td>
        </tr>
    `).join('');
}

function actualizarTotales() {
    const total = carrito.reduce((sum, producto) => {
        return sum + ((producto.precio || 0) * (producto.cantidad || 1));
    }, 0);
    document.getElementById('totalPagar').textContent = total.toLocaleString('es-CL');
    document.getElementById('montoPagar').textContent = total.toLocaleString('es-CL');
}

function procesarPago() {
    if (carrito.length === 0) {
        alert('No hay productos en el carrito');
        return;
    }

    if (!validarFormularios()) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }

    try {
        const datosCliente = obtenerDatosCliente();
        const datosDireccion = obtenerDatosDireccion();
        const total = carrito.reduce((sum, producto) => sum + ((producto.precio || 0) * (producto.cantidad || 1)), 0);

        const compra = {
            fecha: new Date(),
            cliente: datosCliente,
            direccion: datosDireccion,
            productos: [...carrito],
            total: total,
            estado: 'pendiente',
            numeroOrden: generarNumeroOrden()
        };

        db.collection('compras').add(compra)
            .then(async (docRef) => {
                const pagoExitoso = Math.random() > 0.5;

                if (pagoExitoso) {
                    await db.collection('compras').doc(docRef.id).update({ estado: 'completada' });
                    localStorage.removeItem('carrito');
                    localStorage.setItem('ultimaCompra', JSON.stringify({ ...compra, id: docRef.id }));
                    window.location.href = `compraexitosa.html?orden=${compra.numeroOrden}`;
                } else {
                    await db.collection('compras').doc(docRef.id).update({ estado: 'error_pago' });
                    localStorage.setItem('ultimaCompra', JSON.stringify({ ...compra, id: docRef.id }));
                    window.location.href = `errorPago.html?orden=${compra.numeroOrden}`;
                }
            })
            .catch(error => {
                console.error('Error al guardar la compra:', error);
                alert('Error al procesar la compra. Intenta nuevamente.');
            });

    } catch (error) {
        console.error('Error procesando la compra:', error);
        alert('Error inesperado. Intenta nuevamente.');
    }
}

function validarFormularios() {
    const formCliente = document.getElementById('formCliente');
    const formDireccion = document.getElementById('formDireccion');
    return formCliente.checkValidity() && formDireccion.checkValidity();
}

function obtenerDatosCliente() {
    return {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        correo: document.getElementById('correo').value,
        telefono: document.getElementById('telefono').value
    };
}

function obtenerDatosDireccion() {
    return {
        calle: document.getElementById('direccion').value,
        departamento: document.getElementById('departamento').value || '',
        region: document.getElementById('region').value,
        comuna: document.getElementById('comuna').value,
        indicaciones: document.getElementById('indicaciones').value || ''
    };
}

function generarNumeroOrden() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `ORDEN${timestamp}${random}`;
}

function configurarEventosCheckout() {
    document.getElementById('formDireccion').addEventListener('submit', function(e) {
        e.preventDefault();
        procesarPago();
    });

    document.getElementById('region').addEventListener('change', function() {
        if (this.value) {
            cargarComunas(this.value);
        } else {
            const selectComuna = document.getElementById('comuna');
            selectComuna.innerHTML = '<option value="">Selecciona una región primero</option>';
            selectComuna.value = '';
        }
    });

    const inputs = document.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#28a745';
            }
        });
    });
}