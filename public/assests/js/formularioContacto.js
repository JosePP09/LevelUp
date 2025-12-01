// formularioContacto.js

// Inicializar Firebase (mismo proceso que en otros archivos JS)
let db; // Variable global para Firestore
let firebaseInicializado = false;

async function inicializarFirebase() {
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
        console.error('Firebase no está cargado en el HTML');
        return false;
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    db = firebase.firestore(); // Inicializar la instancia de Firestore
    firebaseInicializado = true;
    console.log('Firebase (Firestore) inicializado para formularioContacto.js');
    return true;
}

// Función para obtener los datos del usuario actual desde localStorage
function obtenerUsuarioActual() {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
        try {
            const usuario = JSON.parse(usuarioStr);
            // Asegurarse de que tenga las propiedades necesarias
            if (usuario && usuario.run && usuario.nombre && usuario.correo) {
                return usuario;
            } else {
                console.warn("Usuario en localStorage no tiene run, nombre o correo.");
                return null;
            }
        } catch (e) {
            console.error("Error al parsear el usuario de localStorage:", e);
            return null;
        }
    } else {
        console.warn("No hay usuario en localStorage.");
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // Inicializar Firebase antes de configurar el evento
    const initOk = await inicializarFirebase();
    if (!initOk) {
        console.error("No se pudo inicializar Firebase. El formulario no funcionará.");
        const mensaje = document.getElementById("mensaje");
        if (mensaje) {
            mensaje.style.color = "red";
            mensaje.innerText = "Error: No se pudo conectar con el servidor.";
        }
        return;
    }

    const formulario = document.getElementById("formContacto");
    const mensaje = document.getElementById("mensaje");

    if (!formulario) {
        console.error("No se encontró el formulario con ID 'formContacto'");
        return;
    }

    // Verificar si el usuario está logueado antes de permitir el envío
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        mensaje.innerText = ""; // limpiar mensajes previos

        const usuarioActual = obtenerUsuarioActual();
        if (!usuarioActual) {
            mensaje.style.color = "red";
            mensaje.innerText = "❌ Debes iniciar sesión para enviar una reseña.";
            return;
        }

        // Obtener el comentario del textarea
        const comentario = document.getElementById("mensajeInput").value.trim();
        if (!comentario) {
            mensaje.style.color = "red";
            mensaje.innerText = "❌ El comentario no puede estar vacío.";
            return;
        }

        // Preparar datos para la reseña
        const resena = {
            run: usuarioActual.run, // Obtenido de localStorage
            nombre: usuarioActual.nombre, // Obtenido de localStorage
            correo: usuarioActual.correo, // Obtenido de localStorage
            comentario: comentario, // Obtenido del textarea
            fecha: new Date() // Fecha de envío
        };

        console.log("Enviando reseña:", resena); // Para depuración

        // Guardar en Firebase (ahora db está definido y usuarioActual tiene run)
        db.collection('resena').add(resena) // Asegúrate que la colección se llame 'resena*'
            .then((docRef) => {
                console.log("Reseña guardada con ID: ", docRef.id);
                mensaje.style.color = "green";
                mensaje.innerText = "✅ Gracias por tu reseña.";
                formulario.reset(); // Limpiar el formulario
            })
            .catch(error => {
                console.error('Error al guardar la reseña:', error);
                mensaje.style.color = "red";
                mensaje.innerText = "❌ Error al enviar la reseña. Intenta nuevamente.";
            });
    });

    // Opcional: Limpiar mensaje de error al escribir en el textarea
    document.getElementById("mensajeInput")?.addEventListener("input", () => {
        mensaje.innerText = "";
    });
});