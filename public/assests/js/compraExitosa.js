// Inicializar página de éxito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarPaginaExito();
    configurarEventosExito();
    actualizarCarritoHeader();
});

/**
 * Inicializa la página de éxito con los datos de la compra
 */
function inicializarPaginaExito() {
    const urlParams = new URLSearchParams(window.location.search);
    const ordenParam = urlParams.get('orden');
    const ultimaCompra = JSON.parse(localStorage.getItem('ultimaCompra'));
    
    if (!ultimaCompra && !ordenParam) {
        window.location.href = 'carrito.html';
        return;
    }

    // Mostrar datos de la compra
    mostrarDatosCompra(ultimaCompra);
    renderizarProductosExito(ultimaCompra.productos);
    actualizarTotalExito(ultimaCompra.total);
}

/**
 * Muestra los datos de la compra en los formularios
 */
function mostrarDatosCompra(compra) {
    document.getElementById('codigoOrden').textContent = compra.numeroOrden;
    document.getElementById('numeroCompra').textContent = compra.numeroOrden;

    // Datos del cliente
    document.getElementById('exitoNombre').value = compra.cliente.nombre || '';
    document.getElementById('exitoApellidos').value = compra.cliente.apellidos || '';
    document.getElementById('exitoCorreo').value = compra.cliente.correo || '';

    // Datos de dirección
    document.getElementById('exitoCalle').value = compra.direccion.calle || '';
    document.getElementById('exitoDepartamento').value = compra.direccion.departamento || '';
    document.getElementById('exitoRegion').value = compra.direccion.region || '';
    document.getElementById('exitoComuna').value = compra.direccion.comuna || '';
    document.getElementById('exitoIndicaciones').value = compra.direccion.indicaciones || '';
}

/**
 * Renderiza los productos en la tabla de éxito
 */
function renderizarProductosExito(productos) {
    const tbody = document.getElementById('tablaExitoBody');
    
    if (!productos || productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-light">No hay productos en esta compra</td></tr>';
        return;
    }

    tbody.innerHTML = productos.map(producto => `
        <tr>
            <td>
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}" 
                     class="imagen-tabla"
                     onerror="this.src='https://via.placeholder.com/60x60/cccccc/969696?text=Img'">
            </td>
            <td class="text-light">${producto.nombre}</td>
            <td class="text-light">$${(producto.precio || 0).toLocaleString('es-CL')}</td>
            <td class="text-light">${producto.cantidad || 1}</td>
            <td class="text-light">$${((producto.precio || 0) * (producto.cantidad || 1)).toLocaleString('es-CL')}</td>
        </tr>
    `).join('');
}

/**
 * Actualiza el total en la página de éxito
 */
function actualizarTotalExito(total) {
    document.getElementById('totalPagado').textContent = (total || 0).toLocaleString('es-CL');
}

/**
 * Actualiza el header del carrito (vacío después de compra exitosa)
 */
function actualizarCarritoHeader() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = '0';
    }
    // Limpiar carrito de localStorage después de mostrar la página de éxito
    localStorage.removeItem('carrito');
}

/**
 * Genera e imprime la boleta en PDF
 */
function imprimirBoletaPDF() {
    try {
        const compra = JSON.parse(localStorage.getItem('ultimaCompra'));
        if (!compra) {
            alert('No se encontraron datos de la compra');
            return;
        }
        
        const fecha = new Date().toLocaleDateString('es-CL');
        const contenidoBoleta = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Boleta - Level-Up Gamer</title>
                <style>
                    body { font-family: 'Roboto', Arial, sans-serif; margin: 20px; background: white; color: black; }
                    .header { text-align: center; border-bottom: 2px solid #1E90FF; padding-bottom: 15px; margin-bottom: 25px; }
                    .header h1 { color: #1E90FF; font-family: 'Orbitron', sans-serif; }
                    .info-section { margin-bottom: 20px; }
                    .info-section h3 { color: #1E90FF; margin-bottom: 10px; }
                    .product-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .product-table th, .product-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    .product-table th { background-color: #f0f8ff; }
                    .total { text-align: right; font-size: 18px; font-weight: bold; margin: 20px 0; color: #39FF14; }
                    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>LEVEL-UP GAMER</h1>
                    <p>Boleta Electrónica - Orden: ${compra.numeroOrden} | Fecha: ${fecha}</p>
                </div>
                
                <div class="info-section">
                    <h3>Datos del Cliente</h3>
                    <p><strong>Nombre:</strong> ${compra.cliente.nombre} ${compra.cliente.apellidos}</p>
                    <p><strong>Email:</strong> ${compra.cliente.correo}</p>
                </div>
                
                <div class="info-section">
                    <h3>Dirección de Entrega</h3>
                    <p><strong>Dirección:</strong> ${compra.direccion.calle}${compra.direccion.departamento ? ', ' + compra.direccion.departamento : ''}</p>
                    <p><strong>Comuna/Región:</strong> ${compra.direccion.comuna}, ${compra.direccion.region}</p>
                    ${compra.direccion.indicaciones ? `<p><strong>Indicaciones:</strong> ${compra.direccion.indicaciones}</p>` : ''}
                </div>
                
                <table class="product-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${compra.productos.map(producto => `
                            <tr>
                                <td>${producto.nombre}</td>
                                <td>$${(producto.precio || 0).toLocaleString('es-CL')}</td>
                                <td>${producto.cantidad || 1}</td>
                                <td>$${((producto.precio || 0) * (producto.cantidad || 1)).toLocaleString('es-CL')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total">
                    TOTAL: $${compra.total.toLocaleString('es-CL')}
                </div>
                
                <div class="footer">
                    <p>¡Gracias por tu compra en Level-Up Gamer!</p>
                    <p>Este documento es una boleta electrónica generada automáticamente</p>
                </div>
            </body>
            </html>
        `;

        const ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write(contenidoBoleta);
        ventanaImpresion.document.close();
        
        ventanaImpresion.onload = function() {
            ventanaImpresion.print();
            setTimeout(() => ventanaImpresion.close(), 1000);
        };

    } catch (error) {
        console.error('Error al generar la boleta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo generar la boleta. Por favor, intente nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    }
}

/**
 * Simula el envío de la boleta por email
 */
function enviarBoletaEmail() {
    try {
        const compra = JSON.parse(localStorage.getItem('ultimaCompra'));
        if (!compra || !compra.cliente?.correo) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró el correo del cliente.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        const btnEnviar = document.getElementById('btnEnviarEmail');
        const textoOriginal = btnEnviar.innerHTML;
        btnEnviar.innerHTML = '<i class="bi bi-send me-2"></i>Enviando...';
        btnEnviar.disabled = true;
        
        setTimeout(() => {
            btnEnviar.innerHTML = textoOriginal;
            btnEnviar.disabled = false;
            
            Swal.fire({
                icon: 'success',
                title: '¡Boleta enviada!',
                text: `La boleta ha sido enviada exitosamente a ${compra.cliente.correo}`,
                confirmButtonText: 'Aceptar',
                timer: 3000,
                timerProgressBar: true
            });
            
        }, 2000);
        
    } catch (error) {
        console.error('Error al enviar la boleta:', error);
        const btnEnviar = document.getElementById('btnEnviarEmail');
        btnEnviar.innerHTML = '<i class="bi bi-envelope me-2"></i>Enviar Boleta por Email';
        btnEnviar.disabled = false;
        
        Swal.fire({
            icon: 'error',
            title: 'Error al enviar',
            text: 'No se pudo enviar la boleta. Por favor, intente nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    }
}

/**
 * Configura los eventos de la página de éxito
 */
function configurarEventosExito() {
    const btnImprimir = document.getElementById('btnImprimirPDF');
    const btnEnviar = document.getElementById('btnEnviarEmail');
    
    if (btnImprimir) {
        btnImprimir.addEventListener('click', imprimirBoletaPDF);
    }
    
    if (btnEnviar) {
        btnEnviar.addEventListener('click', enviarBoletaEmail);
    }
}