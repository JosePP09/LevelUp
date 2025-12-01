// Función para obtener los datos del usuario actual desde localStorage
function obtenerUsuarioActual() {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
        return JSON.parse(usuarioStr);
    } else {
        return null;
    }
}

// Función para validar el correo (manteniendo tu lógica actual)
function validarCorreo(correo) {
    const regex = /^[^@\s]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formContacto");
    const mensaje = document.getElementById("mensaje");

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

        // Suponiendo que la entrada del formulario es para el mensaje/comentario
        const comentario = document.getElementById("mensajeInput").value.trim(); // Asegúrate de que el textarea tenga id="mensajeInput"
        if (!comentario) {
            mensaje.style.color = "red";
            mensaje.innerText = "❌ El comentario no puede estar vacío.";
            return;
        }

        // Validar correo del usuario actual (opcional, pero consistente con la colección)
        if (!validarCorreo(usuarioActual.correo)) {
             mensaje.style.color = "red";
             mensaje.innerText = "❌ Correo del usuario no válido para dejar reseña.";
             return;
        }

        // Preparar datos para la reseña
        const resena = {
            run: usuarioActual.run,
            nombre: usuarioActual.nombre,
            correo: usuarioActual.correo,
            comentario: comentario, // Asumiendo que el textarea es para el comentario
            fecha: new Date() // Fecha de envío
        };

        // Guardar en Firebase
        firebase.firestore().collection('resena*').add(resena)
            .then(() => {
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

    // Opcional: Limpiar mensaje de error al escribir
    document.getElementById("mensajeInput")?.addEventListener("input", () => {
        mensaje.innerText = "";
    });
});