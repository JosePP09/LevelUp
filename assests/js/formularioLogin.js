function validarCorreo(correo) {
    const regex = /^[^@\s]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formLogin");
    const correoInput = document.getElementById("correo");
    const claveInput = document.getElementById("clave"); // Campo de contraseña
    const mensaje = document.getElementById("mensaje"); // Elemento para mostrar mensajes (asumo que existe otro elemento para mensajes)

    // 🔹 Validación en el submit
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        mensaje.innerText = ""; // limpiar mensajes previos

        const correo = correoInput.value.trim();
        const contraseña = claveInput.value.trim();

        // ✅ Validación de credenciales de administrador
        if (correo === "admin@duoc.cl" && contraseña === "admin123") {
            claveInput.setCustomValidity("");
            mensaje.style.color = "green";
            mensaje.innerText = "✅ Bienvenido Administrador. Redirigiendo...";
            
            // Redirigir a la vista de administrador
            setTimeout(() => {
                window.location.href = "perfilAdmin.html"; // Ajusta la ruta según tu estructura
            }, 1000);
            return;
        }

        if (!validarCorreo(correo)) {
            correoInput.setCustomValidity("El correo debe ser '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'");
            correoInput.reportValidity();
            mensaje.style.color = "red";
            mensaje.innerText = "❌ Correo inválido. Solo se permiten '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'.";
            return;
        }

        // ✅ Si es válido (usuario normal)
        correoInput.setCustomValidity("");
        claveInput.setCustomValidity(""); // Limpiar validación de contraseña
        mensaje.style.color = "green";
        mensaje.innerText = "✅ Correo válido. Redirigiendo...";

        // Opcional: esperar 1 segundo antes de redirigir
        setTimeout(() => {
            window.location.href = "../../index.html"; // 🔥 aquí redirige
        }, 1000);
    });

    // 🔹 Limpiar error cuando el usuario escriba de nuevo
    correoInput.addEventListener("input", () => {
        correoInput.setCustomValidity("");
        mensaje.innerText = "";
    });
    
    // 🔹 Limpiar error de contraseña cuando el usuario escriba de nuevo
    claveInput.addEventListener("input", () => {
        claveInput.setCustomValidity("");
        mensaje.innerText = "";
    });
});