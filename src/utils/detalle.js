// Funciones para manejo de detalles de productos
export const obtenerDetalleProducto = (productoId) => {
    const productos = {
        'catan': {
            id: 'catan',
            nombre: 'Catan',
            precio: 19990,
            descripcion: 'Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan.',
            imagen: '/assests/image/catan.jpg',
            categoria: 'Juegos de Mesa',
            stock: 15,
            detalles: ['Para 3-4 jugadores', 'Duración: 60-90 minutos', 'Edad: 10+ años']
        },
        'carcassone': {
            id: 'carcassone',
            nombre: 'Carcassone',
            precio: 21990,
            descripcion: 'Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval.',
            imagen: '/assests/image/Carcassone.jpg',
            categoria: 'Juegos de Mesa',
            stock: 12,
            detalles: ['Para 2-5 jugadores', 'Duración: 45-60 minutos', 'Edad: 7+ años']
        },
        'controlXbox': {
            id: 'controlXbox',
            nombre: 'Control Xbox Series X',
            precio: 39990,
            descripcion: 'Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada.',
            imagen: '/assests/image/Control Inalámbrico Xbox Series X.png',
            categoria: 'Accesorios',
            stock: 8,
            detalles: ['Inalámbrico', 'Batería recargable', 'Compatibilidad multiplataforma']
        },
        'auricularesHyperX': {
            id: 'auricularesHyperX',
            nombre: 'Auriculares HyperX Cloud II',
            precio: 29990,
            descripcion: 'Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma.',
            imagen: '/assests/image/Auriculares Gamer HyperX Cloud II.jpg',
            categoria: 'Accesorios',
            stock: 10,
            detalles: ['Sonido 7.1 virtual', 'Micrófono desmontable', 'Cable de 1m']
        }
    };
    
    return productos[productoId] || null;
};

export const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(precio);
};
