// =========================
// Definición de productos
// =========================
const productos = {
    catan: {
        codigo: "CAT001",
        nombre: "Catan",
        precio: 19000,
        stock: 15,
        stockCritico: 5,
        descripcion: "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos",
        imagen: "../image/catan.jpg",
        categoria: "juegos-mesa"
    },
    carcassone: {
        codigo: "CAR001",
        nombre: "Carcassone",
        precio: 21990,
        stock: 12,
        stockCritico: 3,
        descripcion: "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.",
        imagen: "../image/Carcassone.jpg",
        categoria: "juegos-mesa"
    },
    controlXbox: {
        codigo: "XBOX001",
        nombre: "Control Inalámbrico Xbox Series X",
        precio: 39990,
        stock: 8,
        stockCritico: 2,
        descripcion: "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.",
        imagen: "../image/Control Inalámbrico Xbox Series X.png",
        categoria: "accesorios"
    },
    auricularesHyperX: {
        codigo: "HYP001",
        nombre: "Auriculares Gamer HyperX Cloud II",
        precio: 29990,
        stock: 20,
        stockCritico: 5,
        descripcion: "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego.",
        imagen: "../image/Auriculares Gamer HyperX Cloud II.jpg",
        categoria: "accesorios"
    },
    mouseLogitech: {
        codigo: "LOG001",
        nombre: "Mouse Gamer Logitech G502 HERO",
        precio: 34990,
        stock: 18,
        stockCritico: 4,
        descripcion: "Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.",
        imagen: "../image/Mouse Gamer Logitech G502 HERO.jpg",
        categoria: "accesorios"
    },
    ps5: {
        codigo: "PS5001",
        nombre: "PlayStation 5",
        precio: 680990,
        stock: 3,
        stockCritico: 1,
        descripcion: "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.",
        imagen: "../image/PlayStation 5.png",
        categoria: "consolas"
    },
    sillaSecretlabTitan: {
        codigo: "SEC001",
        nombre: "Silla Gamer Secretlab Titan",
        precio: 199990,
        stock: 5,
        stockCritico: 1,
        descripcion: "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.",
        imagen: "../image/Silla Gamer Secretlab Titan.jpg",
        categoria: "sillas-gamer"
    },
    asusRogStrix: {
        codigo: "ASU001",
        nombre: "PC Gamer ASUS ROG Strix",
        precio: 980990,
        stock: 2,
        stockCritico: 1,
        descripcion: "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego.",
        imagen: "../image/PC Gamer ASUS ROG Strix.jpg",
        categoria: "computadores-gamers"
    },
    mousepadRazerGoliathus: {
        codigo: "RAZ001",
        nombre: "Mousepad Razer Goliathus Extended Chroma",
        precio: 19990,
        stock: 25,
        stockCritico: 5,
        descripcion: "Un mousepad extendido con iluminación RGB personalizable que cubre toda tu área de trabajo para una experiencia de juego inmersiva.",
        imagen: "../image/Mousepad Razer Goliathus Extended Chroma.png",
        categoria: "mousepads"
    },
    poleraGamerPersonalizada: {
        codigo: "POL001",
        nombre: "Polera Gamer Personalizada 'Level-Up'",
        precio: 14990,
        stock: 30,
        stockCritico: 10,
        descripcion: "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.",
        imagen: "../image/Polera Gamer Personalizada 'Level-Up'.png",
        categoria: "poleras-personalizadas"
    },
};

// =========================
// Categorías
// =========================
const categorias = {
    "juegos-mesa": "Juegos de Mesa",
    "accesorios": "Accesorios",
    "consolas": "Consolas",
    "sillas-gamer": "Sillas Gamer",
    "computadores-gamers": "Computadores Gamers",
    "mousepads": "Mousepads",
    "poleras-personalizadas": "Poleras Personalizadas"
};

// =========================
// Manejo de eventos de productos
// =========================
function setupProductos() {
    // Agregar eventos a los botones "Agregar al carrito"
    document.querySelectorAll(".btn-agregar-producto").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const productoId = e.target.closest('[data-id]').getAttribute("data-id");
            alert(`Función de carrito deshabilitada. Producto: ${productos[productoId].nombre}`);
        });
    });
}

// =========================
// Filtros de productos
// =========================
function filtrarProductos(categoriaSeleccionada) {
    const elementosProductos = document.querySelectorAll('.producto');
    
    elementosProductos.forEach(elemento => {
        const productoId = elemento.getAttribute('data-id');
        const categoriaProducto = productos[productoId] ? productos[productoId].categoria : null;
        
        if (categoriaSeleccionada === "todos" || categoriaSeleccionada === categoriaProducto) {
            elemento.style.display = "block";
        } else {
            elemento.style.display = "none";
        }
    });
}

// =========================
// Inicialización
// =========================
document.addEventListener("DOMContentLoaded", () => {
    // Configurar eventos de productos
    setupProductos();

    // Filtros por categoría
    document.querySelectorAll(".filtro-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            // Remover clase active de todos los botones
            document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
            // Agregar clase active al botón clickeado
            btn.classList.add("active");
            
            const cat = btn.getAttribute("data-categoria");
            filtrarProductos(cat);
        });
    });
});