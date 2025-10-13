// Funciones para administración del sistema
export const validarAdmin = (correo, clave) => {
    return correo === "admin@duoc.cl" && clave === "admin123";
};

export const obtenerEstadisticasAdmin = () => {
    return {
        totalProductos: 25,
        totalUsuarios: 150,
        ventasDelMes: 2500000,
        pedidosPendientes: 8
    };
};

export const obtenerUsuarios = () => {
    return [
        {
            id: 1,
            run: "12345678-9",
            nombre: "Administrador",
            email: "admin@duoc.cl",
            tipo: "admin",
            region: "Metropolitana",
            fechaRegistro: "2024-01-15"
        },
        {
            id: 2,
            run: "87654321-0",
            nombre: "Juan Pérez",
            email: "juan.perez@duoc.cl",
            tipo: "cliente",
            region: "Valparaíso",
            fechaRegistro: "2024-02-20"
        }
    ];
};

export const obtenerProductos = () => {
    return [
        {
            id: 1,
            codigo: "CAT001",
            nombre: "Catan",
            precio: 19990,
            stock: 15,
            categoria: "Juegos de Mesa"
        },
        {
            id: 2,
            codigo: "XBOX001",
            nombre: "Control Xbox Series X",
            precio: 39990,
            stock: 8,
            categoria: "Accesorios"
        }
    ];
};
