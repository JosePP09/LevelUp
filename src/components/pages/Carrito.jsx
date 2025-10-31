import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Ajusta la ruta según tu estructura
import { collection, onSnapshot } from "firebase/firestore";
import "../styles/Carrito.css";

const Carrito = () => {
  const [productosOferta, setProductosOferta] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🔹 Escucha en tiempo real los productos en Firebase
  const cargarProductosOferta = () => {
    const productosRef = collection(db, "producto");

    const unsubscribe = onSnapshot(
      productosRef,
      (snapshot) => {
        const productos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filtrar solo los productos que tienen oferta (precioAnterior)
        const productosConOferta = productos.filter(
          (producto) => producto.precioAnterior
        );

        setProductosOferta(productosConOferta);
        setCargando(false);
      },
      (error) => {
        console.error("Error al cargar productos en oferta:", error);
        setCargando(false);
      }
    );

    // 🔹 Devuelve la función para desuscribirse al desmontar el componente
    return unsubscribe;
  };

  useEffect(() => {
    // Cargar carrito desde localStorage
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);

    // Iniciar escucha en tiempo real de productos
    const unsubscribe = cargarProductosOferta();

    // 🔹 Limpiar el listener cuando se desmonta el componente
    return () => unsubscribe();
  }, []);

  const agregarAlCarrito = (producto) => {
    const existente = carrito.find((item) => item.id === producto.id);

    let nuevoCarrito;
    if (existente) {
      nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  if (cargando) return <p className="texto-cargando">Cargando ofertas...</p>;

  return (
    <div className="contenedor-carrito">
      <h2 className="titulo-seccion">🛒 Ofertas Disponibles</h2>

      <div className="productos-grid">
        {productosOferta.length === 0 ? (
          <p>No hay productos en oferta por ahora.</p>
        ) : (
          productosOferta.map((producto) => (
            <div key={producto.id} className="tarjeta-producto">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="imagen-producto"
              />
              <h3>{producto.nombre}</h3>
              <p className="precio-actual">
                ${producto.precio?.toLocaleString("es-CL")}
              </p>
              {producto.precioAnterior && (
                <p className="precio-anterior">
                  Antes: ${producto.precioAnterior?.toLocaleString("es-CL")}
                </p>
              )}
              <p className="stock">
                Stock disponible: <strong>{producto.stock}</strong>
              </p>
              <button
                onClick={() => agregarAlCarrito(producto)}
                disabled={producto.stock === 0}
                className="boton-agregar"
              >
                {producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="carrito-seccion">
        <h2 className="titulo-seccion">🛍️ Tu Carrito</h2>
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          carrito.map((item) => (
            <div key={item.id} className="item-carrito">
              <span>
                {item.nombre} x {item.cantidad}
              </span>
              <button
                onClick={() => eliminarDelCarrito(item.id)}
                className="boton-eliminar"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Carrito;
